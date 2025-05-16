<script setup lang="ts">
const { variables } = storeToRefs(useChrStore());

const erase = (index: number) => {
    variables.value.splice(index,1)
}
</script>

<template>
    <section class="p-4 h-full overflow-auto flex flex-col">
        <h2 class="text-xl font-bold pb-4">Variables</h2>
        
        <div class="grow">
            <AddWatchInput/>
        
            <table v-if="variables.length !== 0" class="w-full border-collapse" aria-label="Watched variables">
                <thead>
                    <tr>
                        <th class="p-1 border border-(--ui-border-accented) text-left"/>
                        <th class="p-1 border border-(--ui-border-accented) text-left">Constraint</th>
                        <th class="p-1 border border-(--ui-border-accented) text-left">Position</th>
                        <th class="p-1 border border-(--ui-border-accented) text-left">Value</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="(watch, index) in variables" :key="`${watch.constraint}-${watch.position}`"> <!-- pt-2 pb-2 border-b border-gray-300 flex -->
                        <td class="p-1 border border-(--ui-border-accented) w-1">
                            <UButton icon="i-lucide-x" variant="ghost" class="w-full flex justify-center" @click="erase(index)">
                                <span class="sr-only">Erase the watch</span>
                            </UButton>
                        </td>

                        <td class="p-1 border border-(--ui-border-accented) font-mono text-sm">
                            {{ watch.constraint }}
                        </td>

                        <td class="p-1 border border-(--ui-border-accented) font-mono text-sm">
                            {{ watch.position }}
                        </td>

                        <td v-if="watch.value === ''" class="italic p-1 border border-(--ui-border-accented)">
                            <p class="flex items-center text-sm">
                                <UIcon name="i-lucide-ban" class="flex align-middle mr-1"/>

                                No value
                            </p>
                        </td>

                        <td v-else class="p-1 border border-(--ui-border-accented) font-mono text-sm">{{ watch.value }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>