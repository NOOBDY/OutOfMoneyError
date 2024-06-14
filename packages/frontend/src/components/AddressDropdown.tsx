import { Select } from "@kobalte/core/select";
import { FieldElementProps } from "@modular-forms/solid";
import { Show, createEffect, createSignal } from "solid-js";
import { Address } from "viem";
import { useAccount } from "~/hooks/useAccount";
import { useDarkMode } from "~/hooks/useDarkMode";

export function AddressDropdown(
    props: FieldElementProps<{ address: Address }, "address"> & {
        value: Address | undefined;
    }
) {
    const [darkMode] = useDarkMode();
    const [value, setValue] = createSignal<Address>();
    createEffect(() => {
        setValue(props.value);
    });

    const [account] = useAccount();

    return (
        <Show
            when={account.status === "connected" && [...account.addresses]}
            keyed
        >
            {addresses => {
                return (
                    <Select
                        value={value()}
                        onChange={setValue}
                        defaultValue={addresses[0]}
                        placeholder="Select an Address"
                        options={addresses}
                        required
                        itemComponent={props => (
                            <Select.Item
                                item={props.item}
                                classList={{ dark: darkMode() }}
                            >
                                <Select.ItemLabel
                                    class="w-full border bg-neutral-100 px-2
                                    font-mono dark:bg-neutral-800 dark:text-white"
                                >
                                    {props.item.rawValue}
                                </Select.ItemLabel>
                            </Select.Item>
                        )}
                    >
                        <Select.Label class="font-mono">Address</Select.Label>
                        <Select.HiddenSelect {...props} />
                        <Select.Trigger
                            class="w-full overflow-hidden border bg-neutral-100
                            px-2 text-left font-mono dark:bg-neutral-800 dark:text-white"
                        >
                            <Select.Value<Address>>
                                {state => state.selectedOption()}
                            </Select.Value>
                        </Select.Trigger>

                        <Select.Portal>
                            <Select.Content>
                                <Select.Listbox />
                            </Select.Content>
                        </Select.Portal>
                    </Select>
                );
            }}
        </Show>
    );
}
