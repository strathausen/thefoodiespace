import type { ComponentProps } from "react";

export const Container = ({ children, ...props }: ComponentProps<"div">) => {
  return (
    <div
      {...props}
      className="mx-auto rounded-lg shadow backdrop-blur-3xl backdrop-brightness-110"
    >
      {children}
    </div>
  );
};
