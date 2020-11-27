import initStoryshots from "@storybook/addon-storyshots";
import {
  imageSnapshot,
  ImageSnapshotConfig,
} from "@storybook/addon-storyshots-puppeteer";
import { MatchImageSnapshotOptions } from "jest-image-snapshot";
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

const getMatchOptions = (): MatchImageSnapshotOptions => {
  return {
    customSnapshotsDir: path.resolve(__dirname, "..", "__image_snapshots__"),
    customDiffDir: path.resolve(__dirname, "..", "__image_diff__"),
  };
};

initStoryshots({
  suite: "Puppeteer storyshots",
  test: imageSnapshot({
    getMatchOptions,
    beforeScreenshot,
    storybookUrl: `file://${path.resolve(__dirname, "../storybook-static")}`,
  }),
});
