import styled from "styled-components";

export const Root = styled.div`
  user-select: none;
  cursor: move;
  overflow: hidden;
  border-left: 0.5px solid rgba(0, 0, 0, 0.4);
  border-right: 0.5px solid rgba(0, 0, 0, 0.4);
  border-top: 0.5px solid rgba(0, 0, 0, 0.4);
  box-sizing: border-box;
  border-radius: 0.8em 0.8em 0 0;
  left: -1px;
  top: -1px;
  right: -1px;
  height: 32px;

  background-color: rgba(50, 100, 255, 0.9);
  color: #eeeeee;

  &.active {
    background-color: rgba(100, 150, 255, 0.9);
    color: white;
  }

  > .text {
    flex: 1;
    overflow: hidden;
    font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
      "Lucida Sans", Arial, sans-serif;
    font-size: 24px;
    padding: 0px 0.5em;
    align-items: center;
    display: flex;
    white-space: nowrap;
  }
`;
