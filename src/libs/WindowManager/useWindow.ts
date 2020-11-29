import { useState, useRef, useEffect } from "react";
import {
  MoveParams,
  MEvent,
  callEvent,
  getDistance,
  getPos,
  getRadian,
} from ".";
import { BorderType } from "./types";

type WindowParams = {
  active: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
};

export const useWindow = ({
  ref,
  active,
  x,
  y,
  width,
  height,
}: WindowParams & { ref: React.RefObject<HTMLElement> }) => {
  const [params, setParams] = useState<MoveParams & { real: WindowParams }>({
    node: null,
    nodePoint: { x, y },
    nodeSize: { width, height },
    real: { active, x, y, width, height },
  });
  const [activeWindow, setActiveWindow] = useState(active);
  const refActive = useRef<boolean>(activeWindow);
  refActive.current = activeWindow;

  useEffect(() => {
    if (ref.current) {
      ref.current.dataset["__symbol"] = "Window";
      const onActive = (e: MEvent) => {
        const active = e.params === true;
        setActiveWindow(active);
        const node = ref.current!;
        if (active) {
          const parent = node.parentNode;
          if (parent) {
            node.style.zIndex = "99999";

            Array.prototype.slice
              .call(parent.childNodes, 0)
              .filter((node) => isWindow(node))
              .sort((a, b) => {
                const az = a.style.zIndex ? parseInt(a.style.zIndex) : 0;
                const bz = b.style.zIndex ? parseInt(b.style.zIndex) : 0;
                return az - bz;
              })
              .forEach((node, index) => {
                node.style.zIndex = index.toString();
              });
          }
        }
      };
      ref.current.addEventListener("active", onActive);
      return () => {
        ref.current?.removeEventListener("active", onActive);
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
    setParams((p) => ({
      ...p,
      relativePoint: { x: 0, y: 0 },
      nodePoint: { x: p.real.x, y: p.real.y },
      nodeSize: { width: p.real.width, height: p.real.height },
      node: null,
    }));
  };
  const onTouchStart = (e: TouchEvent) => {
    setParams((params) => ({ ...params, pinchiBaseDistance: undefined }));
  };

  // マウス移動時の処理
  const mouseMove = (e: MouseEvent | TouchEvent) => {
    setParams((params) => {
      if (params.node) {
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
            active: refActive.current,
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
    setParams((params) => {
      if (params.node) return params;
      const node = e.target as HTMLElement;
      const className = node.className;
      foreground(node);
      return {
        ...params,
        node,
        basePoint: getPos(e.nativeEvent),
        relativePoint: { x: 0, y: 0 },
        nodeType: (className as BorderType) || "",
        event: e.nativeEvent,
        real: { ...params.real, active: refActive.current },
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
  return {
    params: { ...params.real, active: refActive.current },
    handleWindow,
  };
};
