"use strict";

/**
 * order controller
 */

const hottokKey = process.env.HOTTOKKEY;

const isHottokValid = (hottok) => {
  if (process.env.NODE_ENV === "development") return true;
  return hottok === hottokKey;
};

const { createCoreController } = require("@strapi/strapi").factories;

const addMonths = (numOfMonths) => {
  const date = new Date();
  date.setMonth(date.getMonth() + numOfMonths);

  return date;
};

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async findUserByEmail(userEmail) {
    const userInfo = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({ where: { email: userEmail } });
    return userInfo;
  },

  async grantAccessToUser({ userId, endsAt }) {
    await strapi.db.query("plugin::users-permissions.user").update({
      where: { id: userId },
      data: { isPaid: true, endsAt },
    });
  },

  async removeAccessFromUser(userId) {
    await strapi.db.query("plugin::users-permissions.user").update({
      where: { id: userId },
      data: { isPaid: false },
    });
  },

  async webhookApprovedPurchase(ctx) {
    const hottok = ctx.request.header["x-hotmart-hottok"];

    if (!isHottokValid(hottok)) {
      return ctx.throw(401);
    }

    const body = ctx.request.body;

    const status = body.data.purchase.status;

    const userEmail = body.data.buyer.email.toLowerCase();

    const numberOfMonths =
      body.data.subscription.plan.name === "Plano mensal" ? 1 : 12;

    const endsAt = addMonths(numberOfMonths);

    try {
      const userInfo = await this.findUserByEmail(userEmail);
      const userId = userInfo.id;

      if (!userInfo) {
        return ctx.throw(404);
      }

      const approvedStatus = {
        APPROVED: async ({ userId, endsAt }) => {
          await this.grantAccessToUser({ userId, endsAt });
          ctx.response.send(200);
        },
        COMPLETED: async ({ userId, endsAt }) => {
          await this.grantAccessToUser({ userId, endsAt });
          ctx.response.send(200);
        },
        DEFAULT: async ({ userId }) => {
          await this.removeAccessFromUser(userId);
          ctx.response.send(200);
        },
      };

      return (
        approvedStatus[status]({ userId, endsAt }) ||
        approvedStatus["DEFAULT"]({ userId })
      );
    } catch (err) {
      console.error(err);
    }
  },

  async webhookSubscriptionChanged(ctx) {
    const hottok = ctx.request.header["x-hotmart-hottok"];

    if (!isHottokValid(hottok)) {
      return ctx.throw(401);
    }
    const body = ctx.request.body;

    const status = body.data.subscription.status;

    const newPlan = body.data.plans.find((plan) => plan.current);

    const numberOfMonths = newPlan.name === "Plano mensal" ? 1 : 12;

    const endsAt = addMonths(numberOfMonths);

    try {
      const userEmail = body.data.subscription.user.email.toLowerCase();

      const userInfo = await this.findUserByEmail(userEmail);
      const userId = userInfo.id;

      if (!userInfo) {
        return ctx.throw(404);
      }

      const changedStatus = {
        ACTIVE: async ({ userId, endsAt }) => {
          await this.grantAccessToUser({ userId, endsAt });
          ctx.response.send(200);
        },
        STARTED: async ({ userId, endsAt }) => {
          await this.grantAccessToUser({ userId, endsAt });
          ctx.response.send(200);
        },
        DEFAULT: async ({ userId }) => {
          await this.removeAccessFromUser(userId);
          ctx.response.send(200);
        },
      };

      return (
        changedStatus[status]({ userId, endsAt }) ||
        changedStatus["DEFAULT"]({ userId })
      );
    } catch (err) {
      console.error(err);
    }
  },

  async webhookSubscriptionCancelled(ctx) {
    const hottok = ctx.request.header["x-hotmart-hottok"];

    if (!isHottokValid(hottok)) {
      return ctx.throw(401);
    }

    const body = ctx.request.body;

    const cancellation = Object.keys(body.data).includes("cancellation_date");

    const userEmail = body.data.subscriber.email.toLowerCase();
    try {
      const userInfo = await this.findUserByEmail(userEmail);
      console.log({ userInfo });
      const userId = userInfo.id;

      if (!userInfo) {
        return ctx.throw(404);
      }

      if (cancellation) {
        await this.removeAccessFromUser(userId);
      }
      ctx.response.send(200);
    } catch (err) {
      console.error(err);
    }
  },

  async webhookSubscriptionExpired(ctx) {
    const hottok = ctx.request.header["x-hotmart-hottok"];

    if (!isHottokValid(hottok)) {
      return ctx.throw(401);
    }

    const body = ctx.request.body;
    const status = body.data.purchase.status;

    const userEmail = body.data.buyer.email.toLowerCase();

    try {
      const userInfo = await this.findUserByEmail(userEmail);
      const userId = userInfo.id;

      if (!userInfo) {
        return ctx.throw(404);
      }

      const expiredStatus = {
        EXPIRED: async ({ userId }) => {
          await this.removeAccessFromUser(userId);
          ctx.response.send(200);
        },
        PRINTED_BILLET: async ({ userId }) => {
          await this.removeAccessFromUser(userId);
          ctx.response.send(200);
        },
        BILLET_PRINTED: async ({ userId }) => {
          await this.removeAccessFromUser(userId);
          ctx.response.send(200);
        },
        OVERDUE: async ({ userId }) => {
          await this.removeAccessFromUser(userId);
          ctx.response.send(200);
        },
        DELAYED: async ({ userId }) => {
          await this.removeAccessFromUser(userId);
          ctx.response.send(200);
        },
        DEFAULT: async ({ userId }) => {
          await this.removeAccessFromUser(userId);
          ctx.response.send(200);
        },
      };
      return (
        expiredStatus[status]({ userId }) ||
        expiredStatus["DEFAULT"]({ userId })
      );
    } catch (err) {
      console.error(err);
    }
  },
}));
