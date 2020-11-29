import React, { FC } from "react";
import { Root } from "./Icon.styled";

import Close from "../../Images/close.svg";
import Max from "../../Images/max.svg";
import Min from "../../Images/min.svg";
import Normal from "../../Images/normal.svg";

type IconType = "button";

type Props = {
  /**
   * Icon URL
   *
   * @type {string}
   */
  src: string;
  type?: [IconType] | IconType;
  onClick?: () => void;
};

/**
 *
 *
 * @param {Props} { src }
 */
export const Icon: FC<Props> = ({ src, type, onClick }) => (
  <Root
    className={isType(type, "button") ? "button" : undefined}
    src={src}
    onClick={(e) => {
      onClick?.();
      e.stopPropagation();
    }}
  />
);
export const Icons = { Close, Max, Min, Normal };

const isType = (src: IconType | [IconType] | undefined, type: IconType) =>
  src && (src === type || (Array.isArray(src) && src.includes(type)));
