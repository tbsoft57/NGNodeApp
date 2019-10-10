import { AppServer } from '../_lib/appServer';
import { Client } from '../entities/client';
import * as error from '../errors';

AppServer.setBasePublicRouter('client', Client);
