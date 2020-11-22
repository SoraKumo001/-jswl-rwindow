import React, { FC } from "react";
import { Root } from "./TitleBar.style";

type Props = {
  /**
   *
   *
   * @type {boolean}
   */
  active?: boolean;
};

/**
 * TitleBar
 *
 * @param {Props} { active, children }
 */
export const TitleBar: FC<Props> = ({ active, children }) => {
  return (
    <Root className={active ? "active" : undefined}>
      <div className="text">{children}</div>
    </Root>
  );
};
