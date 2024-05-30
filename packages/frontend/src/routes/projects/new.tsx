import { SubmitHandler, createForm, zodForm } from "@modular-forms/solid";
import { useNavigate } from "@solidjs/router";
import { Address, isAddress } from "viem";
import { z } from "zod";
import { useProjects } from "~/db";

const NewProjectSchema = z.object({
    title: z.string(),
    description: z.string(),
    goal: z.number().int().gt(0),
    address: z.custom<Address>(isAddress, "Invalid address") // ! remove after dropdown
});

type NewProjectForm = z.infer<typeof NewProjectSchema>;

export default function () {
    const navigate = useNavigate();
    const [newProjectForm, { Form, Field }] = createForm<NewProjectForm>({
        validate: zodForm(NewProjectSchema),
        revalidateOn: "input"
    });
    const [, { add }] = useProjects();

    const handleSubmit: SubmitHandler<NewProjectForm> = (values, event) => {
        event.preventDefault();

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
                            <label for={field.name}>Address</label>
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
