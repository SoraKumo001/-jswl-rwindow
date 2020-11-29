import React, { FC } from "react";
import { WindowState } from "../../libs/WindowManager";
import { Root } from "./Client.styled";

type Props = { state: WindowState };

/**
 * Client
 *
 * @param {Props} { }
 */
export const Client: FC<Props> = ({ state, children }) => {
  return (
    <Root style={state !== "normal" ? { border: "none" } : {}}>{children}</Root>
  );
};
