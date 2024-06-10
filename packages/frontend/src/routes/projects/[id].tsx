import { SubmitHandler, createForm, zodForm } from "@modular-forms/solid";
import { useParams } from "@solidjs/router";
import { readContract, simulateContract, writeContract } from "@wagmi/core";
import { Show, createResource, createSignal, onMount } from "solid-js";
import { Address, formatEther, parseEther } from "viem";
import { z } from "zod";
import { AddressDropdown } from "~/components/AddressDropdown";
import { Button } from "~/components/Button";
import Progress from "~/components/Progress";
import { Project, State } from "~/types";
import { noneMoneyAbi } from "~/generated";
import { useConfig } from "~/hooks/useConfig";
import { contractAddress } from "~/wagmiConfig";

const DonateSchema = z.object({
    value: z.coerce.number().gt(0),
    address: z.custom<Address>(data => data, "Address required")
});

type DonateForm = z.infer<typeof DonateSchema>;

function NotFound() {
    return (
        <div class="w-full py-40 text-center">
            <p class="font-mono text-7xl text-neutral-400 dark:text-neutral-600">
                Project Not Found
            </p>
        </div>
    );
}

export default function () {
    const config = useConfig();
    const params = useParams();

    const [state, setState] = createSignal<State>();

    const [donateForm, { Form, Field }] = createForm<DonateForm>({
        validate: zodForm(DonateSchema),
        revalidateOn: "input"
    });

    const [project, { refetch }] = createResource(async () => {
        const id = BigInt(params.id);
        const data = await readContract(config, {
            abi: noneMoneyAbi,
            address: contractAddress,
            functionName: "getProjectByID",
            args: [id]
        });

        const deadline = new Date(Number(data[5]) * 1000);

        setState(data[3] as State);

        return {
            id: id,
            title: data[0],
            description: data[1],
            goal: data[6],
            current: data[7],
            deadline: deadline
        } satisfies Project;
    });

    onMount(() => {
        refetch();
    });

    const handleSubmit: SubmitHandler<DonateForm> = async (values, event) => {
        event.preventDefault();

        try {
            const id = BigInt(params.id);

            const { request } = await simulateContract(config, {
                abi: noneMoneyAbi,
                address: contractAddress,
                functionName: "addProjectDonor",
                args: [id],
                account: values.address,
                value: parseEther(values.value.toString())
            });

            await writeContract(config, request);
        } catch (e) {
            console.error(e);
        }

        refetch();
    };

    return (
        <Show when={project()} fallback={<NotFound />} keyed>
            {project => (
                <div class="mx-auto px-4 lg:w-2/3">
                    <h1 class="mb-4 font-mono text-3xl font-semibold">
                        {project.title}
                    </h1>

                    <div class="flex w-full flex-col lg:flex-row">
                        <p class="mb-4 w-full grow break-words text-xl lg:mr-6 lg:w-3/5">
                            {project.description}
                        </p>

                        <div class="w-full lg:w-96">
                            <p class="text-md mb-4 font-mono">
                                <span class="text-2xl text-green-600 dark:text-lime-400">
                                    {formatEther(project.current)} ETH
                                </span>
                                {" of "}
                                {formatEther(project.goal)} ETH
                                {" raised"}
                            </p>

                            <div class="mb-4 border">
                                <Progress
                                    current={Number(
                                        formatEther(project.current)
                                    )}
                                    goal={Number(formatEther(project.goal))}
                                />
                            </div>

                            <div class="mb-4">
                                <p class="font-mono">
                                    {project.deadline.toLocaleDateString()}
                                </p>
                            </div>

                            <Show when={state() === 0}>
                                <Form
                                    onSubmit={handleSubmit}
                                    class="flex flex-col space-y-4"
                                >
                                    <Field name="address">
                                        {(field, props) => (
                                            <div>
                                                <AddressDropdown
                                                    {...props}
                                                    value={field.value}
                                                />
                                                {field.error && (
                                                    <p class="text-red-600">
                                                        {field.error}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </Field>

                                    <Field name="value" type="number">
                                        {(field, props) => (
                                            <div class="flex flex-col">
                                                <label
                                                    for={field.name}
                                                    class="font-mono"
                                                >
                                                    Value
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
                                                    <p class="text-red-600">
                                                        {field.error}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </Field>

                                    <div class="mx-auto">
                                        <Button
                                            type="submit"
                                            disabled={donateForm.invalid}
                                        >
                                            Donate
                                        </Button>
                                    </div>
                                </Form>
                            </Show>

                            <Show when={state() === 1}>
                                <p class="font-mono">Goal Achieved!</p>
                            </Show>
                        </div>
                    </div>
                </div>
            )}
        </Show>
    );
}
