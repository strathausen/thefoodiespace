import type { ComponentProps } from "react";

type Props = ComponentProps<"button">;

export const Button = ({ children, ...props }: Props) => {
  return (
    <button
      {...props}
      style={{
        backgroundImage: "url(https://grainy-gradients.vercel.app/noise.svg)",
				filter: "brightness(1.10)",
      }}
      className="pressed:shadow-0 rounded bg-blue-300 px-3 py-1 text-blue-950 shadow transition hover:shadow-md active:shadow"
    >
      {children}
    </button>
  );
};
