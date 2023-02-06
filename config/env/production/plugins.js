module.exports = ({ env }) => ({
  ckeditor5: {
    enabled: true,
    resolve: "./src/plugins/strapi-plugin-ckeditor",
  },
  email: {
    provider: "nodemailer",
    providerOptions: {
      host: env("SMTP_HOST", "smtp-relay.sendinblue.com"),
      port: env("SMTP_PORT", 587),
      auth: {
        user: env("SMTP_USERNAME"),
        pass: env("SMTP_PASSWORD"),
      },
    },
    settings: {
      defaultFrom: "joao.marinho@diariodomilhao.com",
      defaultReplyTo: "joao.marinho@diariodomilhao.com",
    },
  },
  upload: {
    config: {
      provider: "cloudinary",
      providerOptions: {
        cloud_name: env("CLOUDINARY_NAME"),
        api_key: env("CLOUDINARY_KEY"),
        api_secret: env("CLOUDINARY_SECRET"),
      },
      actionOptions: {
        upload: {},
        delete: {},
      },
    },
  },
});
