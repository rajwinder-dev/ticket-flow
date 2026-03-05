module.exports = {
  apps: [
    {
      name: "HRMS-API-40000",
      script: "dist/server.js",
      ignore_watch: ["node_modules", "logs", ".git"], // optional
      env: {
        NODE_ENV: "production",
        PORT: 40000,

        // optional fallback variables
      },
    },
  ],
};
