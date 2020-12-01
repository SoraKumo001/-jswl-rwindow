import React from "react";
import { Icon, Icons } from ".";
import styled from "styled-components";
import { Decorator, Viewport } from "../../storybook";

export default {
  title: "Components/Icon",
  decorators: [Decorator],
  component: Icon,
};

const Root = styled.div`
  td {
    border: 1px solid;
    box-sizing: border-box;
    line-height: 0;
  }
  td {
    border: 1px solid;
    box-sizing: border-box;
    line-height: 0;
  }
  .normal {
    td {
      height: 32px;
    }
  }
  .big {
    td {
      height: 64px;
    }
  }
`;

export const Normal = () => (
  <Root>
    <div>Normal</div>
    <table className="normal">
      {Object.entries(Icons).map(([key, value]) => (
        <tr key={key}>
          <td>{`<Icon src={Icons.${key}}/>`}</td>
          <td>
            <Icon src={value} />
          </td>
        </tr>
      ))}
    </table>
    <hr />
    <div>Big</div>
    <table className="big">
      {Object.entries(Icons).map(([key, value]) => (
        <tr key={key}>
          <td>{`<Icon src={Icons.${key}}/>`}</td>
          <td>
            <Icon src={value} />
          </td>
        </tr>
      ))}
    </table>
  </Root>
);

