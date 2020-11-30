const { MINIMAL_VIEWPORTS } = require("@storybook/addon-viewport");

export const parameters = {
  viewport: {
    viewports: {
      ...MINIMAL_VIEWPORTS,
      PC: {
        name: "PC",
        styles: {
          width: "1024px",
          height: "768px",
        },
      },
      SP: {
        name: "SP",
        styles: {
          width: "375px",
          height: "812px",
        },
      },
    },
    defaultViewport: null,
  },
};
