module.exports = {
  routes: [
    {
      method: "POST",
      path: "/orders/webhook-approved-purchase",
      handler: "order.webhookApprovedPurchase",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/orders/webhook-subscription-changed",
      handler: "order.webhookSubscriptionChanged",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/orders/webhook-subscription-cancelled",
      handler: "order.webhookSubscriptionCancelled",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/orders/webhook-subscription-expired",
      handler: "order.webhookSubscriptionExpired",
      config: {
        auth: false,
      },
    },
  ],
};
