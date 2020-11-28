import * as path from "path";
import { StorybookConfig } from "@storybook/core/types";

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
  babel: async (options: object) => ({
    ...options,
    plugins: [],
  }),
  webpackFinal: async (config) => {
    if (config.resolve)
      config.resolve.modules = [
        ...(config.resolve.modules || []),
        path.resolve(__dirname, "../src"),
      ];
    return config;
  },
} as StorybookConfig;
