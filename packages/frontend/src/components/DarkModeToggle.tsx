import { useDarkMode } from "~/providers/DarkModeProvider";

export function DarkModeToggle() {
    const [darkMode, setDarkMode] = useDarkMode();

    const handleToggle = () => {
        setDarkMode(v => !v);
    };

    return (
        <button type="button" onClick={handleToggle} class="px-2 font-mono">
            <span class={darkMode() ? "" : "font-bold underline"}>light</span>
            <span class="px-1">/</span>
            <span class={darkMode() ? "font-bold underline" : ""}>dark</span>
        </button>
    );
}
