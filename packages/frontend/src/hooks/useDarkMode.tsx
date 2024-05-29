import { useContext } from "solid-js";
import { DarkModeContext } from "../providers/DarkModeProvider";

export function useDarkMode() {
    const context = useContext(DarkModeContext);
    if (!context) {
        throw new Error("DarkModeContext not found");
    }
    return context;
}
