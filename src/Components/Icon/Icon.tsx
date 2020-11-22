import React, { FC } from "react";
import { Root } from "./Icon.style";

import Close from "../../Images/close.svg";
import Max from "../../Images/max.svg";
import Min from "../../Images/min.svg";
import Normal from "../../Images/normal.svg";

type Props = {
  /**
   * Icon URL
   *
   * @type {string}
   */
  src: string;
};


/**
 *
 *
 * @param {Props} { src }
 */
export const Icon: FC<Props> = ({ src }) => <Root src={src} />;
export const Icons = { Close, Max, Min, Normal };
