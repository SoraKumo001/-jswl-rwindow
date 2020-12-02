import React, { Dispatch, useRef, useState } from "react";
import { Win } from ".";
import { ActionType, WindowParams } from "../../libs/WindowManager";
import { Decorator } from "../../storybook";

export default {
  title: "Components/Win",
  decorators: [Decorator],
  component: Win,
};

export const Normal = () => (
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
        x={160}
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

export const Usage = () => {
  const dispatch = useRef<Dispatch<ActionType>>();
  const [params, setParams] = useState<WindowParams>();
  return (
    <>
      <pre>{JSON.stringify(params, null, "  ")}</pre>
      <Win
        title="イベントテスト"
        x={100}
        y={100}
        dispatch={dispatch}
        onUpdate={setParams}
      >
        <pre>{JSON.stringify(params, null, "  ")}</pre>
      </Win>
      <button
        onClick={() => dispatch.current?.({ type: "state", payload: "normal" })}
      >
        開く
      </button>
    </>
  );
};
