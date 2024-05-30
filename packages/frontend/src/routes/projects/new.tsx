import { Select } from "@kobalte/core/select";
import {
    FieldElementProps,
    SubmitHandler,
    createForm,
    zodForm
} from "@modular-forms/solid";
import { useNavigate } from "@solidjs/router";
import { Show, createEffect, createSignal } from "solid-js";
import { Address } from "viem";
import { z } from "zod";
import { useProjects } from "~/db";
import { useAccount } from "~/hooks/useAccount";

const NewProjectSchema = z.object({
    title: z.string().min(1, { message: "Title required" }),
    description: z.string().min(1, { message: "Description required" }),
    goal: z.number().int().gt(0),
    address: z.custom<Address>(data => data, "Address required")
});

type NewProjectForm = z.infer<typeof NewProjectSchema>;

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
                            <label for={field.name}>Title</label>
                            <input
                                {...props}
                                id={field.name}
                                value={field.value}
                                type="text"
                                required
                                class="text-black"
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
                            <label for={field.name}>Description</label>
                            <textarea
                                {...props}
                                id={field.name}
                                value={field.value}
                                required
                                class="text-black"
                            />
                            {field.error && (
                                <p class="text-red-600">{field.error}</p>
                            )}
                        </div>
                    )}
                </Field>

                <Field name="goal" type="number">
                    {(field, props) => (
                        <div>
                            <label for={field.name}>Goal</label>
                            <input
                                {...props}
                                id={field.name}
                                value={field.value}
                                type="number"
                                required
                                class="text-black"
                            />
                            {field.error && (
                                <p class="text-red-600">{field.error}</p>
                            )}
                        </div>
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
