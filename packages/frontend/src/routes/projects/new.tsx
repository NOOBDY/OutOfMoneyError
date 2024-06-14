import { SubmitHandler, createForm, zodForm } from "@modular-forms/solid";
import { useNavigate } from "@solidjs/router";
import { simulateContract, writeContract } from "@wagmi/core";
import { Address, parseEther } from "viem";
import { z } from "zod";
import { Button } from "~/components/Button";
import { noneMoneyAbi } from "~/generated";
import { useConfig } from "~/hooks/useConfig";
import { contractAddress } from "~/wagmiConfig";
import { AddressDropdown } from "~/components/AddressDropdown";
import { toUnix } from "~/lib/unix";
import { untrack } from "solid-js";
import { useDevMode } from "~/hooks/useDevMode";

const NewProjectSchema = z.object({
    title: z.string().min(1, { message: "Title required" }),
    description: z.string().min(1, { message: "Description required" }),
    goal: z.coerce.number().gt(0.001),
    address: z.custom<Address>(data => data, "Address required"),
    deadline: z
        .string()
        .date()
        .refine(data => new Date(data) > new Date(), {
            message: "Date must be greater than now"
        })
});

type NewProjectForm = z.infer<typeof NewProjectSchema>;

export default function () {
    const devMode = useDevMode();
    const navigate = useNavigate();
    const config = useConfig();
    const [newProjectForm, { Form, Field }] = createForm<NewProjectForm>({
        validate: untrack(() => devMode())
            ? undefined
            : zodForm(NewProjectSchema),
        revalidateOn: "input"
    });

    const handleSubmit: SubmitHandler<NewProjectForm> = async (
        values,
        event
    ) => {
        event.preventDefault();
        console.log(values);

        const now = new Date();
        const deadline = new Date(values.deadline);
        const start = now > deadline ? deadline : now;

        try {
            const { request } = await simulateContract(config, {
                abi: noneMoneyAbi,
                address: contractAddress,
                functionName: "addProject",
                args: [
                    values.title,
                    values.description,
                    toUnix(start),
                    toUnix(deadline),
                    parseEther(values.goal.toString())
                ],
                account: values.address
            });

            await writeContract(config, request);

            navigate("/projects");
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div class="mx-auto px-4 md:w-2/5">
            <h1 class="mb-6 font-mono text-4xl">Create New Project</h1>
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

                <Field name="goal" type="number">
                    {(field, props) => (
                        <div class="flex flex-col">
                            <label for={field.name} class="font-mono">
                                Goal
                            </label>
                            <br />
                            <div class="flex">
                                <input
                                    {...props}
                                    id={field.name}
                                    value={field.value}
                                    type="number"
                                    min={0}
                                    required
                                    class="w-full border bg-neutral-100 px-2 dark:bg-neutral-800 dark:text-white"
                                />
                                <p class="border border-l-0 px-1 font-mono">
                                    ETH
                                </p>
                            </div>
                            {field.error && (
                                <p class="text-red-600">{field.error}</p>
                            )}
                        </div>
                    )}
                </Field>

                <Field name="deadline">
                    {(field, props) => (
                        <div class="flex flex-col">
                            <label for={field.name} class="font-mono">
                                Deadline
                            </label>
                            <br />
                            <input
                                {...props}
                                id={field.name}
                                value={field.value}
                                type="date"
                                required
                                class="w-full border bg-neutral-100 px-2 dark:bg-neutral-800 dark:text-white"
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

                <div class="mx-auto">
                    <Button
                        type="submit"
                        disabled={newProjectForm.invalid}
                        class="bg-neutral-300 disabled:bg-neutral-700"
                    >
                        Submit
                    </Button>
                </div>
            </Form>
        </div>
    );
}
