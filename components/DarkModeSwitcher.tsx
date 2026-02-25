"use client"
import { useDispatch } from "react-redux";
import { toggleTheme } from "@/redux/slices/themeSlice";
import { useEffect } from "react";
import { useMode } from "@/hooks/useMode";
import "../styles/darkmode.css";

const DarkModeSwitcher = ()=>{
    const dispatch = useDispatch();
    const mode = useMode();

    useEffect(() => {
        if (mode === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [mode]);

    return(
        <button
            className={`theme-switcher ${mode === "dark" ? "dark" : ""}`}
            onClick={() => dispatch(toggleTheme())}
            aria-label="Toggle Theme"
        >
            <div className="switch-circle">
                {mode === "dark" ? "🌙" : "☀️"}
            </div>
        </button>
    )
}

export default DarkModeSwitcher;
