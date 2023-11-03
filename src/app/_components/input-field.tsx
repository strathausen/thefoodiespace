type Props = {
  label: string;
  name: string;
  type: "text" | "email" | "password";
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

export const InputField = (props: Props) => {
  return (
    <div className="flex flex-row">
      <label
        className="mr-4 block text-sm font-medium text-gray-700"
        htmlFor={props.name}
      >
        {props.label}
      </label>
      <input
        type={props.type}
        name={props.name}
        id={props.name}
        className="border-primary-light block rounded border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};
