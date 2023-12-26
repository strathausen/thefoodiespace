type Props = {
  count: number;
};

export const AnimatedNumber = ({ count }: Props) => {
  return (
    <span className="text-sm">
      {count >= 1000000
        ? `${Math.round(count / 1000000)}M`
        : count >= 1000
        ? `${Math.round(count / 1000)}k`
        : count}
    </span>
  );
};
