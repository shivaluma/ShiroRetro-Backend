module.exports = {
  apps: [
    {
      name: 'Server API',
      script: './src/app.js',
      instances: 2,
      exec_mode: 'cluster',
      watch: true,
      env: {
        NODE_ENV: 'production',
        PORT: '5000',
        MONGODB_URL:
          'mongodb://shivaluma:nguhamay@35.201.203.222:27017/sprint_restrospective',
        SECRET_KEY: 'notsecret',
      },
    },
  ],
};
