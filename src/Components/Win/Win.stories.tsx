import React from "react";
import { Win } from ".";
import { Decorator, Viewport } from "../../storybook";

export default {
  title: "Components/Win",
  decorators: [Decorator],
  component: Win,
};

export const PC = () => (
  <>
    <Win title="Top Window1" x={10} y={10}>
      コンテンツ
      <Win
        title="Child Window(Client)"
        x={50}
        y={150}
        width={400}
        height={100}
        child={true}
      >
        内側専用
      </Win>
      <Win
        title="Child Window(Overlap)"
        x={150}
        y={250}
        width={400}
        height={100}
      >
        外側に出られる
      </Win>
    </Win>
    <Win title="TopWindow2" x={350} y={150} width={200} height={200}>
      コンテンツ
    </Win>
  </>
);
PC.parameters = Viewport("PC");

export const SP = PC.bind(this);
SP.parameters = Viewport("SP");
