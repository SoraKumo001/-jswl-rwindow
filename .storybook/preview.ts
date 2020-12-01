import { withScreenshot } from "storycap";

export const decorators = [withScreenshot];

const viewport = {
  viewports: {
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
  defaultViewport: "PC",
};
export const parameters = {
  viewport,
  screenshot: {
    viewports: {
      PC: {
        width: 1024,
        height: 768,
      },
      SP: {
        width: 375,
        height: 668,
      },
    },
  },
};
