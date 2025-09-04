import { useEffect } from "react";

export const useRipple = () => {
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = (e.target as HTMLElement).closest("[data-ripple]") as HTMLElement;
            if (!target) return;

            const ripple = document.createElement("span");
            ripple.className = "ripple";

            const rect = target.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;

            ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

            target.appendChild(ripple);

            ripple.addEventListener("animationend", () => ripple.remove());
        };

        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);
};
