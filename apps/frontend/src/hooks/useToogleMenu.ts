import { useState, useEffect, useRef } from "react";

export function useToggleMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      const insideMenu = menuRef.current?.contains(target);
      const insideButton = buttonRef.current?.contains(target);

      if (insideButton) {
        setIsMenuOpen((prev) => !prev);
      } else if (!insideMenu && !insideButton) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return { isMenuOpen, menuRef, buttonRef };
}
