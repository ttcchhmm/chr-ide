<script setup lang="ts">

const chrStore = useChrStore();

const erase = (index: number) => {
    chrStore.constraints.splice(index,1)
}

const { constraints } = storeToRefs(useChrStore());
</script>

<template>
    <section class="border-r p-4">
        <h2 class="text-xl font-bold pb-4">Constraint store</h2>

        <InputWithButton label="Constraint" placeholder="Add a constraint..." @submit="(input) => chrStore.constraints.push(input)"/>

        <label for="constraints-list" class="sr-only">Constraints list</label>
        <ol class="pt-4">
            <li v-for="(constraint,index) in constraints" :key="constraint" class="pt-2 pb-2 border-b border-gray-300 flex">
                <UButton icon="i-lucide-x" variant="ghost" @click="erase(index)">
                    <span class="sr-only">Erase the watch</span>
                </UButton>
                <p class="font-bold pr-2">{{ constraint }}</p>
            </li>
        </ol>
    </section>
</template>