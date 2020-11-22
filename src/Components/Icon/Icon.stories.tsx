import React from "react";
import { Icon, Icons } from ".";
import styled from "styled-components";

export default {
  title: "Pages/Icon",
  component: Icon,
};

const Root = styled.div`
  td {
    height: 32px;
    border: 1px solid;
    box-sizing: border-box;
    line-height: 0;
  }
`;

export const Normal = () => (
  <Root>
    <table>
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

const Root2 = styled.div`
  td {
    height: 48px;
    border: 1px solid;
    box-sizing: border-box;
    line-height: 0;
  }
`;

export const Big = () => (
  <Root2>
    <table>
      {Object.entries(Icons).map(([key, value]) => (
        <tr key={key}>
          <td>{`<Icon src={Icons.${key}}/>`}</td>
          <td>
            <Icon src={value} />
          </td>
        </tr>
      ))}
    </table>
  </Root2>
);
