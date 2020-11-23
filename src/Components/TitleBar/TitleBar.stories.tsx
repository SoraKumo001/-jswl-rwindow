import React from "react";
import { TitleBar } from ".";

export default {
  title: "Pages/TitleBar",
};

export const Active = () => <TitleBar active>タイトル</TitleBar>;

export const Normal = () => <TitleBar>タイトル</TitleBar>;
