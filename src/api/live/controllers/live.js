"use strict";

/**
 * live controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::live.live", ({ strapi }) => ({
  async find(ctx) {
    const {
      data: { attributes },
    } = await super.find(ctx);
    return attributes;
  },
}));
