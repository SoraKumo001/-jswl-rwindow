import { useState, useRef, useEffect, useMemo, Dispatch } from "react";
import {
  MoveParams,
  MEvent,
  callEvent,
  getDistance,
  getPos,
  getRadian,
} from ".";
import { ActionType, BorderType, WindowParams, WindowState } from "./types";

export type WindowDispatch = Dispatch<ActionType>;

type Props = WindowParams & { ref: React.RefObject<HTMLElement> };

export const useWindow = (windowParams: Props | (() => Props)) => {
  const { ref, active, x, y, width, height, child, state } = useMemo(
    () => (windowParams instanceof Function ? windowParams() : windowParams),
    []
  );
  const [params, setParams] = useState<MoveParams & { real: WindowParams }>(
    () => ({
      node: null,
      nodePoint: { x, y },
      nodeSize: { width, height },
      state,
      real: { active, x, y, width, height, child, state },
    })
  );

  const setWindowState = (state: WindowState) => {
    setParams((params) => ({
      ...params,
      state,
    }));
  };

  const dispatch: Dispatch<ActionType> = ({ type, payload }) => {
    switch (type) {
      case "state":
        setWindowState(payload as WindowState);
        break;
    }
  };

  useEffect(() => {
    const node = ref?.current;
    if (!node) return;
    switch (params.state) {
      case "max":
        setParams((params) => ({
          ...params,
          real: { ...params.real, state: params.state },
        }));
        node.style.animation = "Max 0.5s ease 0s 1 forwards";
        break;
      case "min":
        node.style.animation = "MinRoot 0.3s ease 0s 1 forwards";
        (node.lastChild as HTMLElement).style.animation =
          "MinClient 0.3s ease 0s 1 alternate forwards";
        break;
      case "close":
        node.style.animation = "Hide 0.5s ease 0s forwards";
        break;
      case "normal":
        setParams((params) => ({
          ...params,
          real: { ...params.real, state: params.state },
        }));
        if (params.real.state === "max")
          node.style.animation = "Restore 0.5s ease 0s forwards";
        else if (params.real.state === "min") {
          node.style.animation =
            "MinRestoreRoot 0.5s ease 0s 1 alternate forwards";
          (node.lastChild as HTMLElement).style.animation =
            "MinRestoreClient 0.1s ease 0s 1 alternate forwards";
        } else {
          node.style.animation = "Show 0.5s ease 0s none";
        }
        break;
    }
  }, [params.state]);

  useEffect(() => {
    if (ref.current) {
      ref.current.dataset["__symbol"] = "Window";
      if (params.state === "hide") setWindowState("normal");

      const onActive = (e: MEvent) => {
        setParams((params) => {
          const active = e.params === true;
          const node = ref.current!;
          if (active) {
            const parent = node.parentNode;
            if (parent) {
              node.style.zIndex = "99999";

              Array.prototype.slice
                .call(parent.childNodes, 0)
                .filter((node) => isWindow(node))
                .sort((a, b) => {
                  if (a.style.position === b.style.position) {
                    const az = a.style.zIndex ? parseInt(a.style.zIndex) : 0;
                    const bz = b.style.zIndex ? parseInt(b.style.zIndex) : 0;
                    return az - bz;
                  } else {
                    return a.style.position < b.style.position ? -1 : 1;
                  }
                })
                .forEach((node, index) => {
                  node.style.zIndex = index.toString();
                });
            }
          }
          return { ...params, real: { ...params.real, active } };
        });
      };
      const onAnimationEnd = () => {
        setParams((p) => ({ ...p, real: { ...p.real, state: p.state } }));
      };
      ref.current.addEventListener("active", onActive);
      ref.current.addEventListener("animationend", onAnimationEnd);
      // setParams({ ...params });
      return () => {
        ref.current?.removeEventListener("active", onActive);
        ref.current?.removeEventListener("animationend", onAnimationEnd);
      };
    }
  }, [ref.current]);
  /**
   *ウインドウをフォアグラウンドにする
   *
   * @memberof
   */
  const foreground = (node: HTMLElement) => {
    //Activeになるノードを取得
    const activeNodes = new Set<HTMLElement>();
    if (node) {
      let topNode: HTMLElement = node;
      do {
        if (isWindow(node)) {
          activeNodes.add(node);
          topNode = node;
        }
      } while ((node = node.parentNode as HTMLElement));
      const parent = topNode.parentNode;
      if (parent) {
        const sendActive = (node: HTMLElement) => {
          if (isWindow(node)) {
            const act = activeNodes.has(node);
            callEvent(node, "active", act);
          }
          Array.prototype.forEach.call(node.childNodes, (node) => {
            sendActive(node as HTMLElement);
          });
        };
        sendActive(parent as HTMLElement);
      }
    }
  };
  function isWindow(node: HTMLElement) {
    return node.dataset?.["__symbol"] === "Window";
  }

  // マウスが離された場合に選択をリセット
  const mouseUp = () => {
    setParams((p) =>
      p.node
        ? {
            ...p,
            relativePoint: { x: 0, y: 0 },
            nodePoint: { x: p.real.x, y: p.real.y },
            nodeSize: { width: p.real.width, height: p.real.height },
            node: null,
          }
        : p
    );
  };
  const onTouchStart = (e: TouchEvent) => {
    setParams((params) => ({ ...params, pinchiBaseDistance: undefined }));
  };

  // マウス移動時の処理
  const mouseMove = (e: MouseEvent | TouchEvent) => {
    setParams((params) => {
      if (params.node && params.real.state !== "max") {
        e.preventDefault();
        if ("touches" in e && e.touches.length === 2) {
          if (params.distance === undefined) {
            params.distance = getDistance(e.touches);
          } else {
            params.distance = getDistance(e.touches) - params.distance;
            params.radian = getRadian(e.touches);
          }
        }
        const relativePoint = getPos(e); // 座標の取得

        let { x, y } = params.nodePoint;
        let { width, height } = params.nodeSize;
        const deltaX = relativePoint.x - params.basePoint.x;
        const deltaY = relativePoint.y - params.basePoint.y;
        switch (params.nodeType) {
          case "top":
            y += deltaY;
            height -= deltaY;
            break;
          case "right":
            width += deltaX;
            break;
          case "bottom":
            height += deltaY;
            break;
          case "left":
            x += deltaX;
            width -= deltaX;
            break;
          case "leftTop":
            x += deltaX;
            y += deltaY;
            width -= deltaX;
            height -= deltaY;
            break;
          case "rightTop":
            y += deltaY;
            width += deltaX;
            height -= deltaY;
            break;
          case "leftBottom":
            x += deltaX;
            width -= deltaX;
            height += deltaY;
            break;
          case "rightBottom":
            width += deltaX;
            height += deltaY;
            break;
          default:
            x += deltaX;
            y += deltaY;
            break;
        }
        return {
          ...params,
          relativePoint,
          real: {
            ...params.real,
            x,
            y,
            width,
            height,
          },
        };
      }
      return params;
    });
  };
  const handleWindow = (
    e: React.MouseEvent<HTMLElement, MouseEvent> | React.TouchEvent<HTMLElement>
  ) => {
    e.stopPropagation();
    foreground(e.target as HTMLElement);
    setParams((params) => {
      if (params.node) return params;
      const node = e.target as HTMLElement;
      const className = node.className;
      return {
        ...params,
        node,
        basePoint: getPos(e.nativeEvent),
        relativePoint: { x: 0, y: 0 },
        nodeType: (className as BorderType) || "",
        event: e.nativeEvent,
      };
    });
  };

  useEffect(() => {
    addEventListener("mouseup", mouseUp, false);
    addEventListener("touchend", mouseUp, { passive: false });
    addEventListener("mousemove", mouseMove, false);
    addEventListener("touchmove", mouseMove, {
      passive: false,
    });
    addEventListener("touchstart", onTouchStart, {
      passive: false,
    });
    return () => {
      removeEventListener("mouseup", mouseUp);
      removeEventListener("touchend", mouseUp);
      removeEventListener("mousemove", mouseMove);
      removeEventListener("touchmove", mouseMove);
      removeEventListener("touchstart", onTouchStart);
    };
  }, []);
  const real = useMemo(() => {
    const { real } = params;
    if (real.state === "max") {
      //座標系リミットチェック
      const node = ref.current!;
      if (node) {
        const parent = node.parentNode as HTMLElement;
        const width = real.child ? parent.clientWidth : window.innerWidth;
        const height = real.child ? parent.clientHeight : window.innerHeight;
        return { ...real, x: 0, y: 0, width, height };
      }
    }
    if (real.state === "min") {
      return { ...real, height: 32 };
    }
    return { ...real };
  }, [params.real]);
  return {
    params: real,
    handleWindow,
    dispatch,
  };
};
