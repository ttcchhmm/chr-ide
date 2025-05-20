<script setup lang="ts">
const { logs } = storeToRefs(useChrStore());
</script>

<template>
    <USlideover title="Logs">
        <UButton label="Logs" icon="i-lucide-logs"/>

        <template #body>
            <ol v-if="logs.length !== 0">
                <li v-for="l in logs" :key="l.date.toString()">
                    <p class="font-mono text-sm border-b pt-1 pb-1 border-(--ui-border-accented)">
                        [<UPopover mode="hover">
                            <time>{{ l.date.toLocaleTimeString() }}</time>

                            <template #content>
                                <time class="text-sm font-bold font-mono p-2">{{ l.date.toLocaleString() }}</time>
                            </template>
                        </UPopover>]: {{ l.content }}
                    </p>
                </li>
            </ol>

            <div v-else class="h-full flex justify-center items-center">
                <div class="flex flex-col justify-center items-center">
                    <UIcon name="i-lucide-ban" size="50"/>
                    <p class="text-xl p-4 font-bold">No logs.</p>
                </div>
            </div>
        </template>
    </USlideover>
</template>