import React from "react";
import { Client } from ".";
import { Decorator, Viewport } from "../../storybook";

export default {
  title: "Components/Client",
  decorators: [Decorator],
  component: Client,
};

export const PC = () => (
  <>
    <Client>コンテンツ</Client>
  </>
);
PC.parameters = Viewport("PC");

export const SP = PC.bind({});
SP.parameters = Viewport("SP");