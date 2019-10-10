import 'reflect-metadata';
import 'zone.js/dist/zone-node';
import * as express from 'express';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs.promises';
import * as path from 'path';

import { v4 as uuid } from 'uuid';
import { createConnection, Connection, ConnectionOptions } from 'typeorm';

import { environment } from '../../environments/backend';
import { User } from '../entities/user';
import * as error from './appError';

export class AppServer {

  private static httpServerInstance;
  private static debugScope: string;
  private static debugStart: number;
  private static connectionPool: Connection;
  private static PrivateRouter = express.Router().get('/privateTest', async (req, res) => { res.json({ text: 'Private Router works' }); });
  private static PublicRouter = express.Router().get('/publicTest', async (req, res) => { res.json({ text: 'Public Router works' }); });

  public static async start(sqlServer = 'sqljs', port = '4201', app = express()) {
    this.debugLog('AppServer:start', `start(${sqlServer}, ${port})`);
    await fs.writeFile('pid', process.pid);  await this.createConnectionPool(sqlServer);
    if (process.env.NODE_SQLSERVER) sqlServer = process.env.NODE_SQLSERVER;
    if (process.env.NODE_PORT) port = process.env.NODE_PORT;
    const startLog = `\n${environment.appName} starts ( Pid: ${process.pid} ) ( Cwd: ${process.cwd()} ) ( Env.: ${process.env.NODE_ENV} ) ( SqlServer: ${sqlServer} ) ( Node Port: ${port} )`; console.log(startLog);
    this.PrivateRouter.all('/user/:id', async (req, res, next) => { try { await this.restApi(req, res, next, User); } catch (err) { next(err); } });
    this.PublicRouter.post('/logout', async (req, res) => { this.CloseSession(req, res); });
    this.PublicRouter.post('/login', async (req, res, next) => { await this.login(req, res, next); });
    this.PublicRouter.get('/checkSSLlogin', async (req, res, next) => { await this.checkSSLlogin(req, res, next); });
    await this.importAppRouters();
    app.set('trust proxy', true);
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(session({ secret: 'i-love-husky', resave: false, saveUninitialized: true, cookie: { httpOnly: false } }));
    app.use(cors({ origin: environment.origin, optionsSuccessStatus: 200 }));
    app.get('*', async (req, res, next) => { this.debugLog('AppServer:start', `incomming request ${req.url}`); next(); });
    if (process.env.NODE_ENV === 'PRODUCTION') {
      app.get('*.*', express.static(process.cwd() + '/html'));
      app.get('*', (req, res, next) => { if (req.url.includes('api')) { next(); } else { res.sendFile(process.cwd() + '/html/index.html'); } });
    } else {
      this.debugStart = -1; this.debugScope = environment.appName;
      this.debugLog('AppServer:start' , 'DEVELOPMENT Environment: DEBUG Enabled');
    }
    app.use('/' + environment.apiPrefix, this.PublicRouter);
    app.use('/' + environment.apiPrefix, (req, res, next) => { if (!req.session.login) { next(new error.NotConnected()); } else if (req.method !== 'GET' && req.headers['x-xsrf-token'] !== req.session['x-xsrf-token']) { next(new error.NoValidXrsfTocken()); } else { next(); } });
    app.use('/' + environment.apiPrefix, this.PrivateRouter);
    app.use((req, res, next) => { if (req.url.includes('api')) { next(new error.NotValidApiUrl()); } else next(); });
    app.use((err, req, res, next) => { this.errorHandler(err, res); });
    this.httpServerInstance = app.listen(Number(port), () => { console.log(`${environment.appName} listening on http://localhost:${port}`); });
    this.handleCrontab();
    process.on('SIGINT', () => { this.handleSIGINT(); });
    process.on('SIGUSR1', async () => { await this.handleSIGUSR1(); });
    if (process.send) process.send('ready'); // Envoie ready au shell ou à PM2 pour indiquer qu'il est pret  et fonctionnel
  }

  private static async restApi(req, res, next, entityDal) {
    try {
      res.status(200);
      switch (req.method) {    // le return est nécessaire car dans xxxRouter.ts on fait un .get() sur la methode setBasePublicRouter -> AppServer.setBasePublicRouter('person', Person).get('/test', ...

        case 'GET': {
          this.debugLog('AppServer:restApi', `GET id = ${req.params.id}`);
          let data = {};
          if (req.params.id === 'All') { data = await entityDal.getAll(); } else { data = await entityDal.getById(req.params.id); }
          if (data) { res.json(data); } else { next(new error.NotFound()); }
          break;
        }
        // Attention à corriger Odata ---> Post = insert or create
        case 'POST': {
          this.debugLog('AppServer:restApi', `POST id = ${req.params.id}`);
          const rows = await entityDal.update(req.body, {id: req.params.id});
          if (rows === 0) { next(new error.NotUpdated()); } else { res.json({ affectedRows: rows, message: rows.toString() + ' row(s) Updated!' }); }
          break;
        }
        // Attention à corriger Odata ---> PUT = update
        case 'PUT': {
          this.debugLog('AppServer:restApi', `PUT id = ${req.body.id}`);
          const rows = await entityDal.insert(req.body);
          if (rows === 0) { next(new error.NotInserted()); } else { res.status(201); res.json({ affectedRows: rows, message: rows.toString() + ' row(s) Created!' }); }
          break;
        }
        case 'DELETE': {
          this.debugLog('AppServer:restApi', `DELETE id = ${req.params.id}`);
          const rows = await entityDal.delete({id: req.params.id});
          if (rows === 0) { next(new error.NotDeleted()); } else { res.json({ affectedRows: rows, message: rows.toString() + ' row(s) Deleted!' }); }
          break;
        }
        default: next(new error.NotValidRestMethod());
      }
    } catch (err) { next(err); }
  }

  private static CreateSessionAndCookies(req, res, user) {
    const token = uuid();
    req.session.login = true;
    req.session.user = user;
    req.session['x-xsrf-token'] = token;
    res.cookie('XSRF-COOKIE', token);
  }

  private static CloseSession(req, res) {
    req.session.login = false;
    req.session.user = null;
    req.session['x-xsrf-token'] = null;
    res.clearCookie('XSRF-COOKIE');
    res.json({ text: 'Loged Off' });
  }

  private static async checkSSLlogin(req, res, next) {
    this.debugLog('AppServer:checkSSLlogin' , 'checkSSLlogin(req, res)');
    const SSLlogin = req.get('SSL_CLIENT_S_DN_Email');
    if (SSLlogin) {
      this.debugLog('AppServer:checkSSLlogin' , 'SSLlogin: ' + SSLlogin);
      const user = await User.getByLogin(SSLlogin);
      if (!user && !await User.getAdmin()) { User.CreateAdmin(); }
      if (user) {
        this.CreateSessionAndCookies(req, res, user);
        res.json(user);
      }
    } else next();
  }

  private static async login(req, res , next) {
    try {
      let user = null;
      if (req.body.login !== '') {
        user = await User.getByLogin(req.body.login);
        if (!user && !await User.getAdmin()) { User.CreateAdmin(); }
        if (user && await bcrypt.compare(req.body.pass, user.pass)) {
          this.CreateSessionAndCookies(req, res, user);
          res.json(user);
        }
      } else { next(new error.NoValidUser()); }
    } catch (err) { next(err); }
  }

  private static async createConnectionPool(sqlServer: string) {
    const config = environment.ormconfig;
    switch (sqlServer) {
      case 'mssql':
        config.host = process.env.MSSQL_HOST;
        config.port = process.env.MSSQL_PORT;
        config.user = process.env.MSSQL_USER;
        config.pass = process.env.MSSQL_PASS;
        break;
      case 'mysql':
        config.host = process.env.MYSQL_HOST;
        config.port = process.env.MYSQL_PORT;
        config.user = process.env.MYSQL_USER;
        config.pass = process.env.MYSQL_PASS;
        break;
      case 'pgsql':
        config.host = process.env.PGSQL_HOST;
        config.port = process.env.PGSQL_PORT;
        config.user = process.env.PGSQL_USER;
        config.pass = process.env.PGSQL_PASS;
        break;
    }
    this.connectionPool = await createConnection(config as ConnectionOptions);
  }

  private static errorHandler(err, res) {
    res.status(err.httpStatus || 500);
    if (err.httpStatus) { res.json(err); } else {
      const e = error.getAppError(err);
      if (e) { res.json(e); } else {
        if (process.env.NODE_ENV.toUpperCase() === 'DEVELOPMENT') { res.json(err); } else { res.json(new error.InternalServerError()); }
      }
    }
  }

  private static handleSIGINT() {
    console.log(`\nSIGINT signal received -> ${environment.appName} stops`);
    this.httpServerInstance.close(async (err) => {
      if (err) { console.error(err); process.exit(1); }
      this.connectionPool.close()
        .then(() => { console.log('Server Stoped & DataBase Closed'); process.exit(0); })
        .catch((e) => { console.error('Error on closing typeOrm dataBase connectionPool:'); console.error(e); process.exit(1);
      });
    });
  }

  private static async handleSIGUSR1() {
    this.debugScope = (await fs.readFile('debugScope', 'utf-8')).trim();
    this.debugStart = Date.now();
    console.log('Debug Starts for 1 hour');
  }

  private static handleCrontab() {
    setInterval(() => {
      // Crontab 1: handleDebugStart
      if (typeof this.debugStart !== 'undefined' && this.debugStart !== -1 && (Date.now() - this.debugStart) > 3600000) {
        this.debugScope = 'No Debug';
        this.debugStart = undefined;
        console.log('Debug Ends');
      // Crontab 2: TODO

    }}, 10000);
  }

  private static async importAppRouters() {
    try {
      const routers = await fs.readdir('src/api/routers');
      routers.forEach(router => {
        router = '../routers/' + path.parse(router).name;
        require(router);
      });
    } catch (e) { console.error('appServer.importAppRouters() error on importing routers'); console.error(e); }
  }

  public static setBasePublicRouter(apiUrl, entityDal) {
    // le return est nécessaire car dans xxxRouter.ts on fait un .get() sur la methode setBasePublicRouter -> AppServer.setBasePublicRouter('person', Person).get('/test', ...
    return this.PublicRouter
      .get(`/${apiUrl}Test`, async (req, res) => { res.json({ message: `${apiUrl} Router works` }); })
      .all(`/${apiUrl}/:id`, async (req, res, next) => {
        try { await this.restApi(req, res, next, entityDal); } catch (err) { next(err); }
    });
  }

  public static setBasePrivateRouter(apiUrl, entityDal) {
    // le return est nécessaire car dans xxxRouter.ts on fait un .get() sur la methode setBasePublicRouter -> AppServer.setBasePublicRouter('person', Person).get('/test', ...
    return this.PrivateRouter
      .get(`/${apiUrl}Test`, async (req, res) => { res.json({ message: `${apiUrl} Router works` }); })
      .all(`/${apiUrl}/:id`, async (req, res, next) => {
        try { await this.restApi(req, res, next, entityDal); } catch (err) { next(err); }
    });
  }

  public static debugLog(scope: string, mess: string) {
    scope = environment.appName + ':' + scope;
    if (scope.includes(this.debugScope)) console.log(scope + ': ' + mess);
  }
} AppServer.start();
