import React from "react";

interface SelectInputProps {
  label?: string;
  name?: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: string | number;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  children: React.ReactElement<typeof Option> | React.ReactElement<typeof Option>[];
}

function SelectInput({
  label,
  name,
  className = "",
  onChange,
  value,
  disabled,
  error,
  required = false,
  children,
  ...props
}: SelectInputProps) {

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <select
        id={name}
        name={name}
        className={`w-full border rounded px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        } ${disabled ? "bg-gray-100" : ""} ${className}`}
        disabled={disabled}
        value={value}
        onChange={onChange}
        {...props}
      >
        {children}
      </select>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

interface OptionProps {
  value: string;
  children: React.ReactElement| string;
}

function Option({ value, children }: OptionProps) {
  return <option value={value}>{children}</option>;
}

SelectInput.Option = Option;
export default SelectInput;
