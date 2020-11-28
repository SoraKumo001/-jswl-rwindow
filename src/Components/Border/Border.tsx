import React, { FC } from "react";
import { Root } from "./Border.styled";

export type BorderType =
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "leftTop"
  | "rightTop"
  | "rightBottom"
  | "leftBottom";

export const Borders: BorderType[] = [
  "top",
  "right",
  "bottom",
  "left",
  "leftTop",
  "rightTop",
  "leftBottom",
  "rightBottom",
];

type Props = {
  borderSize?: number;
};

/**
 * Border
 *
 * @param {Props} { }
 */
export const Border: FC<Props> = ({ borderSize }) => {
  return (
    <>
      <Root size={borderSize || 8}>
        {Borders.map((border) => (
          <div key={border} className={border} />
        ))}
      </Root>
    </>
  );
};
