import React, { FC } from "react";
import { BorderType } from "../../libs/WindowManager";
import { Root } from "./Border.styled";

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
