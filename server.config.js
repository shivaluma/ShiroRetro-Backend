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
        MONGODB_URL: 'mongodb://localhost:27017/sprint_retrospective',
        SECRET_KEY: 'notsecret',
      },
    },
  ],
};
