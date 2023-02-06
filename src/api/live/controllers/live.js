"use strict";

/**
 * live controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::live.live", ({ strapi }) => ({
  async find(ctx) {
    console.log(ctx.request.header);
    const {
      data: { attributes },
    } = await super.find(ctx);
    console.log("oi", { attributes });
    return attributes;
  },
}));
