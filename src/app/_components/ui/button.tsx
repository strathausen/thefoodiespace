import type { ComponentProps } from "react";

type Props = ComponentProps<"button">;

export const Button = ({ children, ...props }: Props) => {
  return (
    <button
      {...props}
      className="pressed:shadow-0 rounded bg-green-950/50 px-3 py-1 text-green-50 shadow-md transition hover:shadow-lg active:shadow"
    >
      {children}
    </button>
  );
};
