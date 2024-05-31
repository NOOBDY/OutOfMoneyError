import { NumberField } from "@kobalte/core/number-field";
import { Select } from "@kobalte/core/select";
import {
    FieldElementProps,
    SubmitHandler,
    createForm,
    toCustom,
    zodForm
} from "@modular-forms/solid";
import { useNavigate } from "@solidjs/router";
import { Show, createEffect, createSignal, splitProps } from "solid-js";
import { Address } from "viem";
import { z } from "zod";
import { useProjects } from "~/db";
import { useAccount } from "~/hooks/useAccount";

const NewProjectSchema = z.object({
    title: z.string().min(1, { message: "Title required" }),
    description: z.string().min(1, { message: "Description required" }),
    goal: z.coerce.number().int().gt(0),
    address: z.custom<Address>(data => data, "Address required")
});

type NewProjectForm = z.infer<typeof NewProjectSchema>;

function GoalInput(
    props: FieldElementProps<NewProjectForm, "goal"> & {
        value: number | undefined;
    }
) {
    const [, inputProps] = splitProps(props, ["value"]);
    const [value, setValue] = createSignal<number>();
    createEffect(() => {
        setValue(props.value);
    });
}

function AddressDropdown(
    props: FieldElementProps<NewProjectForm, "address"> & {
        value: Address | undefined;
    }
) {
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
                            <Select.Item item={props.item}>
                                <Select.ItemLabel>
                                    {props.item.rawValue}
                                </Select.ItemLabel>
                            </Select.Item>
                        )}
                    >
                        <Select.Label class="font-mono">Address</Select.Label>
                        <Select.HiddenSelect {...props} />
                        <Select.Trigger class="h-6 w-full border">
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

export default function () {
    const navigate = useNavigate();
    const [newProjectForm, { Form, Field }] = createForm<NewProjectForm>({
        validate: zodForm(NewProjectSchema),
        revalidateOn: "input"
    });
    const [, { add }] = useProjects();

    const handleSubmit: SubmitHandler<NewProjectForm> = (values, event) => {
        event.preventDefault();

        console.log(values);

        add({
            title: values.title,
            description: values.description,
            goal: values.goal
        });

        navigate("/projects");
    };

    return (
        <div class="mx-auto px-4 md:w-2/5">
            <h1 class="font-mono text-4xl">Create New Project</h1>
            <Form onSubmit={handleSubmit} class="flex flex-col space-y-4">
                <Field name="title">
                    {(field, props) => (
                        <div>
                            <label for={field.name} class="font-mono">
                                Title
                            </label>
                            <br />
                            <input
                                {...props}
                                id={field.name}
                                value={field.value}
                                type="text"
                                required
                                // ! new line on class breaks compilation somehow
                                class="w-full border bg-neutral-100 px-2 dark:bg-neutral-800 dark:text-white"
                            />
                            {field.error && (
                                <p class="text-red-600">{field.error}</p>
                            )}
                        </div>
                    )}
                </Field>

                <Field name="description">
                    {(field, props) => (
                        <div>
                            <label for={field.name} class="font-mono">
                                Description
                            </label>
                            <br />
                            <textarea
                                {...props}
                                id={field.name}
                                value={field.value}
                                required
                                // ! new line on class breaks compilation somehow
                                class="w-full border bg-neutral-100 px-2 dark:bg-neutral-800 dark:text-white"
                            />
                            {field.error && (
                                <p class="text-red-600">{field.error}</p>
                            )}
                        </div>
                    )}
                </Field>

                <Field
                    name="goal"
                    type="number"
                    transform={toCustom(
                        value => {
                            console.log("custom");
                            return value;
                        },
                        { on: "input" }
                    )}
                >
                    {(field, props) => (
                        <>
                            <NumberField
                                rawValue={field.value}
                                defaultValue={100}
                                minValue={0}
                                format={false}
                                required
                                class="flex flex-col"
                            >
                                <p>{typeof field.value}</p>
                                <NumberField.Label class="font-mono">
                                    Goal
                                </NumberField.Label>
                                <NumberField.HiddenInput {...props} />
                                <div class="flex">
                                    <NumberField.Input
                                        class="grow border bg-neutral-100 px-2 dark:bg-neutral-800
                    dark:text-white"
                                    />
                                    <div class="flex flex-col">
                                        <NumberField.IncrementTrigger
                                            class="flex h-4 w-6 items-center justify-center
                        border-r border-t px-1 pb-0.5 font-mono transition
                        hover:border-black hover:bg-black hover:text-white
                        dark:hover:border-neutral-200 dark:hover:bg-neutral-200
                        dark:hover:text-black"
                                        >
                                            +
                                        </NumberField.IncrementTrigger>
                                        <hr />
                                        <NumberField.DecrementTrigger
                                            class="flex h-4 w-6 items-center justify-center
                        border-b border-r px-1 pb-0.5 font-mono transition
                        hover:border-black hover:bg-black hover:text-white
                        dark:hover:border-neutral-200 dark:hover:bg-neutral-200
                        dark:hover:text-black"
                                        >
                                            -
                                        </NumberField.DecrementTrigger>
                                    </div>
                                </div>
                            </NumberField>
                            {field.value}
                            {field.error && (
                                <p class="text-red-600">{field.error}</p>
                            )}
                        </>
                    )}
                </Field>

                <Field name="address">
                    {(field, props) => (
                        <div>
                            <AddressDropdown {...props} value={field.value} />
                            {field.error && (
                                <p class="text-red-600">{field.error}</p>
                            )}
                        </div>
                    )}
                </Field>

                <button
                    type="submit"
                    disabled={newProjectForm.invalid}
                    class="bg-neutral-300 disabled:bg-neutral-700"
                >
                    Submit
                </button>
            </Form>
        </div>
    );
}
