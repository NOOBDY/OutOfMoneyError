import { ButtonRootProps, Button as KButton } from "@kobalte/core/button";
import { PolymorphicProps } from "@kobalte/core/polymorphic";
import { ValidComponent } from "solid-js";

export function Button<T extends ValidComponent = "button">(
    props: PolymorphicProps<T, ButtonRootProps>
) {
    return (
        <KButton
            {...props}
            class="min-w-32 border border-black px-1 pb-1 pt-0.5 font-mono transition
            hover:border-green-600 hover:bg-green-600 dark:border-white
            dark:hover:border-lime-400 dark:hover:bg-lime-400
            dark:hover:text-black"
        />
    );
}
