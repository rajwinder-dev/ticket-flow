import React from "react";

interface InputProps {
  label?: string;
  name?: string;
  type: string;
  placeholder?: string;
  className?: string;
  defaultValue?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string | number;
  disabled?: boolean;
  error?: string;
  required?: boolean;
}

export function Input({
  label,
  name,
  type,
  placeholder,
  className = "",
  defaultValue,
  onChange,
  value,
  disabled,
  error,
  required = false,
  ...props
}: InputProps) {
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

      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        } ${disabled ? "bg-gray-100" : ""} ${className}`}
        defaultValue={defaultValue}
        onChange={onChange}
        value={value}
        disabled={disabled}
        {...props}
      />

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

