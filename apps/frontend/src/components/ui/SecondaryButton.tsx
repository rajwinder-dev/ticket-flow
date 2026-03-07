import { useGeneralContext } from "../../context/generalContext";
import { cn } from "../../utils/cn";

interface props {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}
export function SecondaryButton({
  children,
  className = "min-w-44",
  onClick,
  type = "button",
  ...props
}: props) {
  const { darkMode } = useGeneralContext();
  return (
    <button
      className={cn(
        `border-blue text-blue2 bg-lightWhite4 cursor-pointer rounded border py-2 disabled:border-gray-500 disabled:text-gray-500`,
        className,
        darkMode ? "hover:bg-gray-950" : "hover:bg-blue-50",
        "common-styles-here",
      )}
      onClick={onClick}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
