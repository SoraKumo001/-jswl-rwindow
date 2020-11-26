import styled from "styled-components";

export const Root = styled.div<{ size: number }>`
  width: 100%;
  height: 100%;
  user-select: none;
  &:active div {
    background-color: rgba(0, 0, 0, 0.08);
  }

  div {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.03);
  }
  .top {
    cursor: n-resize;
    left: 0px;
    top: -${(p) => p.size}px;
    right: 0px;
    height: ${(p) => p.size}px;
  }
  .right {
    cursor: e-resize;
    top: 0px;
    right: -${(p) => p.size}px;
    bottom: 0px;
    width: ${(p) => p.size}px;
  }
  .bottom {
    cursor: s-resize;
    left: 0px;
    right: 0px;
    height: ${(p) => p.size}px;
    bottom: -${(p) => p.size}px;
  }
  .left {
    cursor: w-resize;
    top: 0px;
    left: -${(p) => p.size}px;
    bottom: 0px;
    width: ${(p) => p.size}px;
  }
  .leftTop {
    cursor: nw-resize;
    left: -${(p) => p.size}px;
    top: -${(p) => p.size}px;
    width: ${(p) => p.size}px;
    height: ${(p) => p.size}px;
    border-top-left-radius: 100%;
  }
  .rightTop {
    cursor: ne-resize;
    right: -${(p) => p.size}px;
    top: -${(p) => p.size}px;
    width: ${(p) => p.size}px;
    height: ${(p) => p.size}px;
    border-top-right-radius: 100%;
  }
  .leftBottom {
    cursor: sw-resize;
    left: -${(p) => p.size}px;
    bottom: -${(p) => p.size}px;
    width: ${(p) => p.size}px;
    height: ${(p) => p.size}px;
    border-bottom-left-radius: 100%;
  }
  .rightBottom {
    cursor: se-resize;
    right: -${(p) => p.size}px;
    bottom: -${(p) => p.size}px;
    width: ${(p) => p.size}px;
    height: ${(p) => p.size}px;
    border-bottom-right-radius: 100%;
  }
`;
