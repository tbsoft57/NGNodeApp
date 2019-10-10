module.exports = {
  apps : [{
    name: 'app1',
    script: '/home/thierry/app1/src/api/server.ts',
    cwd: '/home/thierry/app1',
    args: '',
    log_file: 'app1.log',
    time: true,
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '300M',
    env: { NODE_SQLSERVER: 'sqljs', NODE_PORT: '4201'}
  },{
    name: 'app2',
    script: '/home/thierry/app2/app2.js',
    cwd: '/home/thierry',
    args: '4202',
    log_file: 'app2.log',
    time: true,
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '300M',
    env: { NODE_PORT: '4202' },
  },{
    name: 'pm2',
    script: '/home/thierry/pm2/pm2.js',
    cwd: '/home/thierry',
    args: '4204',
    log_file: 'pm2.log',
    time: true,
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '300M',
    env: { NODE_PORT: '4204' },
  }
]};
