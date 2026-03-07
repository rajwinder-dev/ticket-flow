import React from "react";

interface CheckBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

function CheckBox({ label, checked, onChange, ...props }: CheckBoxProps) {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        className="accent-black w-5 h-5"
        checked={checked}
        onChange={onChange}
        {...props}
      />
      {label && <span>{label}</span>}
    </label>
  );
}

export default CheckBox;
