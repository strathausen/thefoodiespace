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

export const InputField = (props: Props) => {
  return (
    <div className="mb-3 flex flex-row">
      <label
        className="mr-4 flex flex-col text-sm font-medium text-gray-700"
        htmlFor={props.name}
        style={{ width: "150px" }}
      >
        {props.label}
        {props.description && (
          <span className="text-xs text-primary">{props.description}</span>
        )}
      </label>
      {props.type === "textarea" ? (
        <textarea
          name={props.name}
          id={props.name}
          className="block flex-1 rounded border border-primary-light px-3 py-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          placeholder={props.placeholder}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          disabled={props.disabled}
        />
      ) : (
        <input
          type={props.type}
          name={props.name}
          id={props.name}
          className="block max-h-10 flex-1 rounded border border-primary-light px-3 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          placeholder={props.placeholder}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          disabled={props.disabled}
        />
      )}
    </div>
  );
};
