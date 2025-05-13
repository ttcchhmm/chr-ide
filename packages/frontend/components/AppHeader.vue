<script setup lang="ts">
const props = defineProps<{
    filesystem: {
        saveAs: OptionalFunction,
        open: OptionalFunction,
        save: OptionalFunction,
    },

    run: () => void,
}>();
</script>

<template>
    <header class="flex justify-between p-4 border-b items-center">
        <div class="flex">
            <NuxtImg src="/logo.png" height="32" width="32" class="rounded-[50%]" alt=""/>
            <h1 class="text-2xl font-bold pl-2">CHR IDE</h1>
        </div>

        <div>
            <UButtonGroup>
                <UPopover mode="hover" :open-delay="500">
                    <UButton icon="i-lucide-play" @click="props.run">Run</UButton>

                    <template #content>
                        <span class="p-1 flex items-center">
                            <UKbd variant="solid">Ctrl / ⌘</UKbd>
                            <span class="pr-1 pl-1">+</span>
                            <UKbd variant="solid" value="shift"/>
                            <span class="pr-1 pl-1">+</span>
                            <UKbd variant="solid" value="R"/>
                        </span>
                    </template>
                </UPopover>

                <UPopover v-if="props.filesystem.save" mode="hover" :open-delay="500">
                    <UButton icon="i-lucide-save" @click="props.filesystem.save">Save</UButton>

                    <template #content>
                        <span class="p-1 flex items-center">
                            <UKbd variant="solid">Ctrl / ⌘</UKbd>
                            <span class="pr-1 pl-1">+</span>
                            <UKbd variant="solid" value="S"/>
                        </span>
                    </template>
                </UPopover>

                <UPopover v-if="props.filesystem.saveAs" mode="hover" :open-delay="500">
                    <UButton icon="i-lucide-save-all" @click="props.filesystem.saveAs">Save as</UButton>

                    <template #content>
                        <span class="p-1 flex items-center">
                            <UKbd variant="solid">Ctrl / ⌘</UKbd>
                            <span class="pr-1 pl-1">+</span>
                            <UKbd variant="solid" value="shift"/>
                            <span class="pr-1 pl-1">+</span>
                            <UKbd variant="solid" value="S"/>
                        </span>
                    </template>
                </UPopover>

                <UPopover v-if="props.filesystem.open" mode="hover" :open-delay="500">
                    <UButton icon="i-lucide-folder-open" @click="props.filesystem.open">Open</UButton>

                    <template #content>
                        <span class="p-1 flex items-center">
                            <UKbd variant="solid">Ctrl / ⌘</UKbd>
                            <span class="pr-1 pl-1">+</span>
                            <UKbd variant="solid" value="O"/>
                        </span>
                    </template>
                </UPopover>
            </UButtonGroup>
        </div>

        <UButton icon="i-lucide-info">About</UButton>
    </header>
</template>