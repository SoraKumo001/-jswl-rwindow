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
  onMouse?: (
    e:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.TouchEvent<HTMLDivElement>
  ) => void;
};

/**
 * Border
 *
 * @param {Props} { }
 */
export const Border: FC<Props> = ({ borderSize, onMouse }) => {
  return (
    <>
      <Root size={borderSize || 8}>
        {Borders.map((border) => (
          <div
            key={border}
            className={border}
            onMouseDown={onMouse}
            onTouchStart={onMouse}
          />
        ))}
      </Root>
    </>
  );
};
