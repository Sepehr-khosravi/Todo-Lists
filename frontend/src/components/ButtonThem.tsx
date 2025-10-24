import { useEffect, useState } from "react";
import Logo from "../assets/react.svg";

export default function ThemeToggle() {
    const [theme, setTheme] = useState<"light" | "dark">(() => {
        const saved = localStorage.getItem("theme") as "light" | "dark" | null;
        if (saved) return saved;
        const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        return systemDark ? "dark" : "light";
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <div className="logo-div">
            <img
                onClick={toggleTheme}
                src={Logo}
                className="logo"
                alt="logo"
                style={{
                    cursor: "pointer",
                    transition: "transform 0.3s ease",
                    transform: theme === "dark" ? "rotate(180deg)" : "rotate(0deg)",
                }}
            />
        </div>
    );
}
