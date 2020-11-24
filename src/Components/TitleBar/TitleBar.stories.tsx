import React from "react";
import { TitleBar } from ".";
import { Decorator, Viewport } from "../../storybook";

export default {
  title: "Pages/TitleBar",
  decorators: [Decorator],
  component: TitleBar,
};

export const PC = () => (
  <>
    <div>Active</div>
    <TitleBar>
      AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    </TitleBar>
    <TitleBar active>通常時</TitleBar>
    <TitleBar active state="max">
      最大化
    </TitleBar>
    <TitleBar active state="min">
      最小化
    </TitleBar>
    <hr />
    <div>Normal</div>
    <TitleBar>
      AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    </TitleBar>
    <TitleBar>通常時</TitleBar>
    <TitleBar state="max">最大化</TitleBar>
    <TitleBar state="min">最小化</TitleBar>
  </>
);
PC.parameters = Viewport("PC");

export const SP = PC.bind({});
SP.parameters = Viewport("SP");
