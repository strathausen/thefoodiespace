export const Heading = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <div className="flex group items-center justify-center">
      <a
        href={`#${props.id}`}
        className="-ml-[13px] hidden w-[13px] group-hover:block"
      >
        #
      </a>
      <h1
        id={props.id}
        className={`text-center font-vollkorn text-3xl font-semibold ${className}`}
        {...props}
      >
        {children}
      </h1>
    </div>
  );
};
