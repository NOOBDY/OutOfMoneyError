import {
    FlowProps,
    createContext,
    createSignal,
    useContext,
    createEffect,
    Signal
} from "solid-js";

const DarkModeLocalStorageKey = "dark-mode";

const DarkModeContext = createContext<Signal<boolean>>();

/**
 * Priority:
 * 1. `defaultDarkMode`
 * 2. `localStorage`
 * 3. `(prefers-color-scheme: dark)`
 * 4. defaults to `false`
 *
 * @param defaultDarkMode
 * @returns whether to use dark mode or not by default
 */
function getDefaultDarkModeValue(defaultDarkMode?: boolean): boolean {
    if (defaultDarkMode !== undefined) {
        return defaultDarkMode;
    }

    const theme = localStorage.getItem(DarkModeLocalStorageKey);
    if (theme) {
        return theme === "true" ? true : false;
    }

    if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
        return true;
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
    const [darkMode, setDarkMode] = createSignal(
        getDefaultDarkModeValue(props.defaultDarkMode)
    );

    createEffect(() => {
        localStorage.setItem(DarkModeLocalStorageKey, darkMode().toString());
    });

    return (
        <DarkModeContext.Provider value={[darkMode, setDarkMode]}>
            {props.children}
        </DarkModeContext.Provider>
    );
}
