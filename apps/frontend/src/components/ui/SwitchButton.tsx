type SwitchButtonProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function SwitchButton({
  onChange,
  onBlur,
  checked,
  name,
  ...props
}: SwitchButtonProps) {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        checked={checked}
        className="peer sr-only"
        {...props}
      />
      <div className="ring-blue2 peer h-6 w-11 rounded-full bg-gray-200 ring-2 transition-all duration-300 peer-checked:bg-blue-500 peer-focus:outline-none"></div>
      <div className="ring-blue2 absolute top-1 left-1 h-4 w-4 rounded-full bg-white ring-2 transition-transform duration-300 peer-checked:translate-x-5"></div>
    </label>
  );
}
