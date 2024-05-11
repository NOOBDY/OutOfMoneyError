import {
    FlowProps,
    createContext,
    createSignal,
    useContext,
    createEffect,
    Signal,
    onMount
} from "solid-js";
import { isServer } from "solid-js/web";

const DarkModeLocalStorageKey = "dark-mode";

const DarkModeContext = createContext<Signal<boolean>>();

/**
 * Priority:
 * 1. `localStorage`
 * 2. `(prefers-color-scheme: dark)`
 * 3. `defaultDarkMode`
 * 4. defaults to `false`
 *
 * @param defaultDarkMode
 * @returns whether to use dark mode or not by default
 */
function getDefaultDarkModeValue(defaultDarkMode?: boolean): boolean {
    if (isServer) {
        throw new Error("This function should only be run on the client");
    }

    const theme = localStorage.getItem(DarkModeLocalStorageKey);
    if (theme) {
        return theme === "true" ? true : false;
    }

    if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
        console.log("system");
        return true;
    }

    if (defaultDarkMode !== undefined) {
        return defaultDarkMode;
    }

    return false;
}

export function useDarkMode() {
    const context = useContext(DarkModeContext);
    if (!context) {
        throw new Error("DarkModeContext not found");
    }
    return context;
}

type Props = {
    defaultDarkMode?: boolean;
};

export function DarkModeProvider(props: FlowProps<Props>) {
    const [darkMode, setDarkMode] = createSignal(false);

    onMount(() => {
        setDarkMode(getDefaultDarkModeValue(props.defaultDarkMode));
    });

    createEffect(() => {
        localStorage.setItem(DarkModeLocalStorageKey, darkMode().toString());
    });

    return (
        <DarkModeContext.Provider value={[darkMode, setDarkMode]}>
            {props.children}
        </DarkModeContext.Provider>
    );
}
