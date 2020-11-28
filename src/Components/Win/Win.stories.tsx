import React from "react";
import { Win } from ".";
import { Decorator, Viewport } from "../../storybook";

export default {
  title: "Components/Win",
  decorators: [Decorator],
  component: Win,
};

export const PC = () => (
  <>
    <Win title="タイトル" x={10} y={10}>
      コンテンツ
    </Win>
    <Win title="タイトル" x={50} y={150} width={200} height={100}>
      コンテンツ
    </Win>
  </>
);
PC.parameters = Viewport("PC");

export const SP = PC.bind({});
SP.parameters = Viewport("SP");
