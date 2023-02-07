module.exports = ({ env }) => {
  return {
    connection: {
      client: "postgres",
      connection: {
        host: env("DATABASE_HOST", "127.0.0.1"),
        port: env.int("DATABASE_PORT", 5432),
        database: env("DATABASE_NAME", "ddm"),
        user: env("DATABASE_USERNAME", "ddm"),
        password: env("DATABASE_PASSWORD", "3336"),
        ssl: env.bool("DATABASE_SSL", false)
          ? {
              require: true,
              rejectUnauthorized: false,
            }
          : false,
      },
    },
  };
};
