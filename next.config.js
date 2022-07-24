module.exports = {
    // target: 'experimental-serverless-trace',
    webpack: (config) => {
      config.experiments = config.experiments || {};
      config.experiments.topLevelAwait = true;
      return config;
    },

    images: {
      domains: ['res.cloudinary.com']
    },
  };