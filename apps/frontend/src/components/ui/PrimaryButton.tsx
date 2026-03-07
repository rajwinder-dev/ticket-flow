interface props {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  style?: "danger" | "normal";
}

export function PrimaryButton({
  children,
  className = "min-w-44",
  onClick,
  disabled,
  type = "button",
  style = "normal",
  ...props
}: props) {
  let buttonStyle;
  if (style === "normal")
    buttonStyle = "bg-gradient-to-r from-blue hover:bg-blue-600 to-sky";
  if (style === "danger")
    buttonStyle = " hover:bg-red-500 bg-red1 font-semibold";
  return (
    <button
      className={`flex h-10 cursor-pointer justify-center gap-4 rounded-lg py-2 font-semibold text-white transition-colors hover:bg-blue-600 dark:hover:bg-blue disabled:bg-gray-100 ${buttonStyle} ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
