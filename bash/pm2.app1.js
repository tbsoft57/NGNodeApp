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
  }]
};
