module.exports = ({ env }) => ({
  ckeditor5: {
    enabled: true,
    resolve: "./src/plugins/strapi-plugin-ckeditor",
  },
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        host: "localhost",
        port: 1025,
        ignoreTLS: true,
      },
    },
  },
});
