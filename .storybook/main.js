const path = require("path");

module.exports = {
  stories: ["../src/**/*.stories.@(tsx)"],
  addons: [
    "@storybook/addon-storysource",
    "@storybook/addon-actions",
    "@storybook/addon-docs",
    "@storybook/addon-viewport",
  ],
  typescript: {
    //  check: true,
  },
  babel: async (options) => ({
    ...options,
    plugins: [],
  }),
  webpackFinal: async (config) => {
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      path.resolve(__dirname, "../src"),
    ];
    return config;
  },
};
