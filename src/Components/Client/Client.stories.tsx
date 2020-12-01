import React from "react";
import { Client } from ".";
import { Decorator, Viewport } from "../../storybook";

export default {
  title: "Components/Client",
  decorators: [Decorator],
  component: Client,
};

export const Normal = () => (
  <>
    <Client>コンテンツ</Client>
  </>
);
