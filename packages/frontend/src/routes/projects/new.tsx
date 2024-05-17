import { NumberField } from "@kobalte/core/number-field";
import { TextField } from "@kobalte/core/text-field";
import { action, redirect } from "@solidjs/router";
import { createMemo, createSignal } from "solid-js";
import { Button } from "~/components/Button";
import { useProjects } from "~/db";

export default function () {
    const [title, setTitle] = createSignal("");
    const [description, setDescription] = createSignal("");
    const [goal, setGoal] = createSignal(100);
    const [, { add }] = useProjects();

    const newProject = action(async (formData: FormData) => {
        const title = formData.get("title");
        if (!title || title.toString().length <= 0) {
            alert("no title");
            return;
        }

        const description = formData.get("description");
        if (!description || description.toString().length <= 0) {
            alert("no description");
            return;
        }

        const goal = formData.get("goal");
        if (!goal || goal.toString().length <= 0) {
            alert("no goal");
            return;
        }

        add({
            title: title.toString(),
            description: description.toString(),
            goal: Number.parseFloat(goal.toString())
        });

        return redirect("/projects");
    }, "newProject");

    const disabled = createMemo(() => {
        if (title().length === 0) {
            return true;
        }

        if (description().length === 0) {
            return true;
        }

        if (isNaN(goal())) {
            return true;
        }

        if (goal() <= 0) {
            return true;
        }

        return false;
    });

    return (
        <div class="mx-auto px-4 md:w-1/3">
            <h1 class="font-mono text-4xl">Create New Project</h1>
            <form
                action={newProject}
                method="post"
                class="flex flex-col space-y-2"
            >
                <TextField
                    name="title"
                    defaultValue=""
                    value={title()}
                    onChange={setTitle}
                    validationState={title().length > 0 ? "valid" : "invalid"}
                    required
                >
                    <TextField.Label class="font-mono">Title</TextField.Label>
                    <br />
                    <TextField.Input
                        class="border bg-neutral-100 px-2 dark:bg-neutral-800
                        dark:text-white"
                    />
                </TextField>

                <TextField
                    name="description"
                    defaultValue=""
                    value={description()}
                    onChange={setDescription}
                    validationState={
                        description().length > 0 ? "valid" : "invalid"
                    }
                    required
                >
                    <TextField.Label class="font-mono">
                        Description
                    </TextField.Label>
                    <br />
                    <TextField.TextArea
                        class="border bg-neutral-100 px-2 dark:bg-neutral-800
                        dark:text-white"
                    />
                </TextField>

                <NumberField
                    name="goal"
                    defaultValue={100}
                    minValue={0}
                    rawValue={goal()}
                    onRawValueChange={setGoal}
                    validationState={goal() > 0 ? "valid" : "invalid"}
                    required
                >
                    <NumberField.Label class="font-mono">
                        Goal
                    </NumberField.Label>
                    <NumberField.HiddenInput />
                    <div class="flex">
                        <NumberField.Input
                            class="border bg-neutral-100 px-2
                            dark:bg-neutral-800 dark:text-white"
                        />
                        <div class="flex flex-col">
                            <NumberField.IncrementTrigger
                                class="flex h-4 w-6 items-center justify-center
                                border-r border-t px-1 pb-0.5 font-mono
                                transition hover:border-black
                                hover:bg-black hover:text-white
                                dark:hover:border-neutral-200
                                dark:hover:bg-neutral-200
                                dark:hover:text-black"
                            >
                                +
                            </NumberField.IncrementTrigger>
                            <hr />
                            <NumberField.DecrementTrigger
                                class="flex h-4 w-6 items-center justify-center
                                border-b border-r px-1 pb-0.5 font-mono
                                transition hover:border-black
                                hover:bg-black hover:text-white
                                dark:hover:border-neutral-200
                                dark:hover:bg-neutral-200
                                dark:hover:text-black"
                            >
                                -
                            </NumberField.DecrementTrigger>
                        </div>
                    </div>
                    <NumberField.ErrorMessage class="text-red-500">
                        Please enter a value greater than 0
                    </NumberField.ErrorMessage>
                </NumberField>

                <div class="mx-auto">
                    <Button type="submit" disabled={disabled()}>
                        Submit
                    </Button>
                </div>
            </form>
        </div>
    );
}
