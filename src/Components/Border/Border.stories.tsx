import React from "react";
import styled from "styled-components";
import { Border, Borders } from ".";
import { Decorator, Viewport } from "../../storybook";

export default {
  title: "Components/Border",
  decorators: [Decorator],
  component: Border,
};

const Box = styled.div`
  position: absolute;
  left: 32px;
  top: 32px;
  width: 100px;
  height: 100px;
  background: greenyellow;
`;

export const Normal = () => (
  <>
    <Box>
      <Border borderSize={8} />
    </Box>
    <Box style={{ top: "64px", left: "64px" }}>
      <Border borderSize={8} />
    </Box>
  </>
);
