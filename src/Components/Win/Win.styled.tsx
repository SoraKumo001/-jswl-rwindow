import styled from "styled-components";

export const Root = styled.div<{
  x: number;
  y: number;
  width: number;
  height: number;
}>`
  position: fixed;
  left: ${(p) => p.x}px;
  top: ${(p) => p.y}px;
  width: ${(p) => p.width}px;
  height: ${(p) => p.height}px;
  display: flex;
  flex-direction: column;
  box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.4);
`;
