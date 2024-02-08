"use client";
import { useEffect, useState } from "react";
import { type IconType } from "react-icons";
import { AnimatedNumber } from "./formatted-number";

type Props = {
  count: number;
  icon: IconType;
  active?: boolean;
  activeIcon?: IconType;
  onClick?: () => Promise<void>;
};

// TODO this is only really used by the like button...maybe we don't need this component?
export const PulseCounter = (props: Props) => {
  const [active, setActive] = useState(props.active);
  const [count, setCount] = useState(props.count);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (animate) {
      setTimeout(() => {
        setAnimate(false);
      }, 500);
    }
  }, [animate]);

  useEffect(() => {
    setActive(props.active);
    setCount(props.count);
  }, [props.active, props.count]);

  return (
    <button
      className="flex cursor-pointer items-center gap-1"
      onClick={async () => {
        if (!props.onClick) return;
        setActive(!active);
        setCount(active ? count - 1 : count + 1);
        if (!active) setAnimate(true);
        try {
          await props.onClick();
        } catch (e) {
          setActive(active);
          setCount(count);
        }
      }}
    >
      {active && props.activeIcon ? (
        <div className={`hover:scale-125 ${animate ? "animate-ping" : ""}`}>
          {props.activeIcon({})}
        </div>
      ) : (
        <div className="hover:scale-125">{props.icon({})}</div>
      )}
      <AnimatedNumber count={count} />
    </button>
  );
};
