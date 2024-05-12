import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { FlowProps, Suspense } from "solid-js";
import "./app.css";
import Nav from "~/components/Nav";
import { DarkModeProvider, useDarkMode } from "~/providers/DarkModeProvider";

function Background(props: FlowProps) {
    const [darkMode] = useDarkMode();

    return (
        <div
            class="min-h-screen bg-white text-black dark:bg-neutral-950 dark:text-white"
            classList={{ dark: darkMode() }}
        >
            {props.children}
        </div>
    );
}

export default function App() {
    return (
        <Router
            root={props => (
                <DarkModeProvider defaultDarkMode={true}>
                    <Background>
                        <Nav />
                        <Suspense>{props.children}</Suspense>
                    </Background>
                </DarkModeProvider>
            )}
        >
            <FileRoutes />
        </Router>
    );
}
