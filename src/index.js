"use strict";

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    let io = require("socket.io")(strapi.server.httpServer, {
      cors: {
        origin: `${process.env.ENDPOINT_URL}`,
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      socket.on("join", () => {
        socket.join("live");
      });
      socket.on("message", async (data, callback) => {
        try {
          io.emit("message", {
            username: data.username,
            message: data.message,
          });

          callback();
        } catch (err) {
          console.log("err inside catch block", err);
        }
      });
    });
  },
};
