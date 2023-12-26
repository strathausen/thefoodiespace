"use client";
import { useEffect, useState } from "react";
import { type IconType } from "react-icons";
import { AnimatedNumber } from "./formatted-number";

type Props = {
  count: number;
  icon: IconType;
  active?: boolean;
  activeIcon?: IconType;
  onClick?: () => void;
};

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

  return (
    <button
      className="flex cursor-pointer items-center gap-1"
      onClick={() => {
        if (!props.onClick) return;
        setActive(!active);
        setCount(active ? count - 1 : count + 1);
        if (!active) setAnimate(true);
        props.onClick();
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
