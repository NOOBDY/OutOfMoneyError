import { ButtonRootProps, Button as KButton } from "@kobalte/core/button";
import { PolymorphicProps } from "@kobalte/core/polymorphic";
import { ValidComponent } from "solid-js";

export function Button<T extends ValidComponent = "button">(
    props: PolymorphicProps<T, ButtonRootProps>
) {
    return (
        <KButton
            {...props}
            class="min-w-32 border border-black px-1 pb-1 pt-0.5 font-mono
            transition hover:border-green-600 hover:bg-green-600
            disabled:border-neutral-200 disabled:bg-neutral-200
            disabled:text-neutral-600 dark:border-white
            dark:hover:border-lime-400 dark:hover:bg-lime-400
            dark:hover:text-black dark:disabled:border-neutral-800
            dark:disabled:bg-neutral-800 dark:disabled:text-neutral-500"
        />
    );
}
