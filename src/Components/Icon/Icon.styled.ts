import styled from "styled-components";

export const Root = styled.img`
  height: 100%;
  margin: auto 0;
  box-sizing: border-box;

  &.button {
    cursor: default;
    background-color: rgba(255, 255, 255, 0.05);
    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }
`;
