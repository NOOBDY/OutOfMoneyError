import { Button as KButton } from "@kobalte/core";

export const Button = (props: KButton.ButtonRootProps) => {
    return (
        <KButton.Root
            class="w-52 border-2 border-orange-400 bg-orange-400 px-2 py-1 font-bold hover:bg-white"
            {...props}
        />
    );
};
