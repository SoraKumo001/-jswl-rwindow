import React, { FC } from "react";
import { Root } from "./Client.styled";

type Props = {};

/**
 * Client
 *
 * @param {Props} { }
 */
export const Client: FC<Props> = ({ children }) => {
  return <Root>{children}</Root>;
};
