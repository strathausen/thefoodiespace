type Props = {
  label: string;
  name: string;
  type: "text" | "email" | "password" | "textarea" | "number";
  placeholder: string;
  value: string;
  description?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

const className =
  "block max-h-10 flex-1 rounded px-3 shadow sm:text-sm bg-white/90 disabled:text-stone-500";

export const InputField = (props: Props) => {
  return (
    <div className="flex flex-row">
      <label
        className="text-stone mr-4 flex flex-col text-sm font-medium"
        htmlFor={props.name}
        style={{ width: "150px" }}
      >
        {props.label}
        {props.description && (
          <span className="text-xs text-stone-500">{props.description}</span>
        )}
      </label>
      {props.type === "textarea" ? (
        <textarea
          name={props.name}
          id={props.name}
          className={`py-2 ${className}`}
          placeholder={props.placeholder}
          value={props.value}
          style={{
            minHeight: (props.value.split(/[\n|\r]/g).length + 1) * 1.5 + "rem",
          }}
          onChange={(e) => props.onChange(e.target.value)}
          disabled={props.disabled}
        />
      ) : (
        <input
          type={props.type}
          name={props.name}
          id={props.name}
          className={className}
          placeholder={props.placeholder}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          disabled={props.disabled}
        />
      )}
    </div>
  );
};
