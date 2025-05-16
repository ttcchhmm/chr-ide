<script setup lang="ts">

const chrStore = useChrStore();

const erase = (index: number) => {
    chrStore.constraints.splice(index,1)
}

const submit = (input: string) => {
    chrStore.constraints = chrStore.constraints.concat(
        input
            .split(/\),\s*/g)
            .map(c => c.trim())
            .filter(c => c !== ',' && c.length !== 0)
            .map((c) => {
                if(c.endsWith(')')) {
                    return c;
                } else {
                    return `${c})`;
                }
            })
    );
};

const { constraints } = storeToRefs(useChrStore());
</script>

<template>
    <section class="border-r p-4 h-full overflow-auto flex flex-col">
        <h2 class="text-xl font-bold pb-4">Constraint store</h2>

        <InputWithButton label="Constraint" placeholder="Add a constraint..." @submit="submit"/>

        <label for="constraints-list" class="sr-only">Constraints list</label>
        <ol class="pt-4 grow">
            <li v-for="(constraint,index) in constraints" :key="constraint" class="pt-2 pb-2 border-b border-gray-300 flex">
                <UButton icon="i-lucide-x" variant="ghost" @click="erase(index)">
                    <span class="sr-only">Erase the constraint</span>
                </UButton>
                <p class="font-bold pr-2">{{ constraint }}</p>
            </li>
        </ol>
    </section>
</template>