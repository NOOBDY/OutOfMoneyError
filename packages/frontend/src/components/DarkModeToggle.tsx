import { useDarkMode } from "~/hooks/useDarkMode";

export function DarkModeToggle() {
    const [darkMode, setDarkMode] = useDarkMode();

    const handleToggle = () => {
        setDarkMode(v => !v);
    };

    return (
        <div class="px-2 font-mono">
            <div class="hidden lg:block">
                <button
                    type="button"
                    onClick={() => setDarkMode(false)}
                    class={darkMode() ? "" : "font-bold underline"}
                >
                    light
                </button>
                <span class="px-1">/</span>
                <button
                    type="button"
                    onClick={() => setDarkMode(true)}
                    class={darkMode() ? "font-bold underline" : ""}
                >
                    dark
                </button>
            </div>

            <div class="block lg:hidden">
                <button
                    type="button"
                    onClick={handleToggle}
                    class="font-bold underline"
                >
                    {darkMode() ? "dark" : "light"}
                </button>
            </div>
        </div>
    );
}
