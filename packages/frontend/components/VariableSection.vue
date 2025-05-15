<script setup lang="ts">
const chrStore = useChrStore();

const { watchedVariables, variables } = storeToRefs(useChrStore());

const erase = (index: number) => {
    chrStore.watchedVariables.splice(index,1)
}

const variableWithValue = computed(
    () => watchedVariables.value.
        map((v) =>({
            name: v,
            value: variables.value.find(v2 => v2.name === v)?.value,
        }))
);
</script>

<template>
    <section class="p-4">
        <h2 class="text-xl font-bold pb-4">Variables</h2>

        <InputWithButton label="Watch name" placeholder="New watch..." @submit="(input) => chrStore.watchedVariables.push(input)"/>
        
        <ol class="pt-4">
            <li v-for="(watch,index) in variableWithValue" :key="watch.name" class="pt-2 pb-2 border-b border-gray-300 flex">
                <UButton icon="i-lucide-x" variant="ghost" @click="erase(index)">
                    <span class="sr-only">Erase the watch</span>
                </UButton>

                <p class="font-bold pr-2 border-r border-gray-300">{{ watch.name }}</p>

                <p v-if="watch.value === undefined" class="italic pl-2">
                    <UIcon name="i-lucide-ban" class="flex align-middle"/>

                    No value
                </p>

                <p v-else>{{ watch.value }}</p>
            </li>
        </ol>
    </section>
</template>