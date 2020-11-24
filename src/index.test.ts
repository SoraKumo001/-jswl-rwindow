import initStoryshots from "@storybook/addon-storyshots";
import {
  imageSnapshot,
  ImageSnapshotConfig,
} from "@storybook/addon-storyshots-puppeteer";
import path from "path";

const beforeScreenshot: ImageSnapshotConfig["beforeScreenshot"] = async (
  page,
  { context: { parameters } }
) => {
  const viewport = parameters.viewport;
  if (viewport) {
    const defaultViewport = viewport.viewports[viewport.defaultViewport];
    await page.setViewport({
      width: parseInt(defaultViewport.styles.width, 10),
      height: parseInt(defaultViewport.styles.height, 10),
    });
  }
};

initStoryshots({
  suite: "Puppeteer storyshots",
  test: imageSnapshot({
    beforeScreenshot,
    storybookUrl: `file://${path.resolve(__dirname, "../storybook-static")}`,
  }),
});
