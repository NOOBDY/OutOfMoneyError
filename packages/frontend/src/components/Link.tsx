import { Link as KLink, LinkRootProps } from "@kobalte/core/link";
import { PolymorphicProps } from "@kobalte/core/polymorphic";
import { ValidComponent } from "solid-js";
export default function Link<T extends ValidComponent = "a">(
    props: PolymorphicProps<T, LinkRootProps>
) {
    return (
        <KLink
            {...props}
            class="text-green-600 underline transition-all
            hover:text-green-800 dark:text-lime-400 dark:hover:text-lime-600"
        />
    );
}
