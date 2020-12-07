import React, { Dispatch, useRef, useState } from "react";
import { Win } from ".";
import { ActionType, WindowParams } from "../../libs/WindowManager";
import { Decorator } from "../../storybook";

export default {
  title: "Components/Win",
  decorators: [Decorator],
  component: Win,
};

export const Primary = (args: Parameters<typeof Win>[0]) => {
  return (
    <>
      <div style={{ position: "relative", height: "730px" }}>
        <Win {...args}>Contents</Win>
      </div>
    </>
  );
};
Primary.args = { title: "Title", overlapped: false };
Primary.parameters = {
  viewMode: "docs",
};
export const ParentAndChild = () => (
  <>
    <Win title="Top Window1" x={10} y={10}>
      コンテンツ
      <Win
        title="Child Window(Client)"
        width={400}
        height={200}
        overlapped={false}
      >
        内側専用
      </Win>
      <Win
        title="Child Window(Overlap)"
        x={160}
        y={250}
        width={400}
        height={200}
        active={true}
      >
        外側に出られる
      </Win>
    </Win>
    <Win title="TopWindow2" x={350} y={350} width={300} height={200}>
      コンテンツ
    </Win>
  </>
);

export const UpdateParams = () => {
  const [params, setParams] = useState<WindowParams>();
  return (
    <>
      <Win title="アップデートパラメータ" onUpdate={setParams}>
        <pre>{JSON.stringify(params, null, "  ")}</pre>
      </Win>
    </>
  );
};

export const dispatch = () => {
  const dispatch = useRef<Dispatch<ActionType>>(null);
  const [params, setParams] = useState<WindowParams>();
  return (
    <>
      <Win
        x={100}
        y={100}
        title="イベントテスト"
        dispatch={dispatch}
        onUpdate={setParams}
      ></Win>
      <button
        onClick={() =>
          dispatch.current?.({
            type: "state",
            payload: params?.state === "close" ? "normal" : "close",
          })
        }
      >
        {params?.state === "close" ? "開く" : "閉じる"}
      </button>
      <button
        onClick={() =>
          dispatch.current?.({
            type: "position",
            payload: { x: params.x + 50 },
          })
        }
      >
        →
      </button>
      <pre>{JSON.stringify(params, null, "  ")}</pre>
    </>
  );
};

export const Frame = () => (
  <>
    <Win
      frameSize={3}
      title="フレームサイズ3"
      resize={false}
      x={400}
      y={60}
      width={300}
      height={300}
    />
    <Win
      title="サイズ変更禁止"
      resize={false}
      x={50}
      y={60}
      width={300}
      height={300}
    />
    <Win
      title={null}
      clientMovable={true}
      x={150}
      y={160}
      width={300}
      height={300}
    >
      タイトル無しクライアントで移動
    </Win>
  </>
);

export const Position = () => (
  <Win baseX="center" baseY="center" title="親(Center)">
    <Win
      overlapped={false}
      baseX="center"
      baseY="center"
      width={300}
      height={300}
      title="子(Center)"
    ></Win>
    <Win
      overlapped={false}
      baseX="end"
      baseY="end"
      width={300}
      height={300}
      title="子(Right-Bottom)"
    ></Win>
    <Win
      overlapped={false}
      baseX="start"
      baseY="start"
      width={300}
      height={300}
      title="子(Left-Top)"
    ></Win>
  </Win>
);

export const TitleButton = () => (
  <>
    <Win
      title="最小化アイコン無し"
      titleButtons={{ min: false }}
      height={100}
    />
    <Win
      title="最大化アイコン無し"
      titleButtons={{ max: false }}
      height={100}
      y={100}
    />
    <Win
      title="Closeアイコン無し"
      titleButtons={{ close: false }}
      height={100}
      y={200}
    />
  </>
);
