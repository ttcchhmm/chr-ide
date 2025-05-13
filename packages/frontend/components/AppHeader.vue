<script setup lang="ts">
const props = defineProps<{
    /**
     * Function called when the "Save as" button is clicked.
     */
    saveAs: NullableCallback,

    /**
     * Function called when the "Open" button is clicked.
     */
    open: NullableCallback,

    /**
     * Function called when the "Save" button is clicked.
     */
    save: NullableCallback,

    /**
     * Function called when the "New" button is clicked.
     */
    newProject: () => void,

    /**
     * Function called when the "Run" button is clicked.
     */
    run: () => void,

    /**
     * The current open filename.
     */
    fileName: string,
}>();
</script>

<template>
    <header class="flex justify-between p-4 border-b items-center">
        <div class="flex">
            <NuxtImg src="/logo.png" height="48" width="48" class="rounded-[50%]" alt=""/>
            <div class="pl-2 flex flex-col justify-center">
                <h1 class="text-2xl font-bold">CHR IDE</h1>
                <p v-if="fileName.length !== 0" class="text-xs">{{ props.fileName }}</p>
            </div>
        </div>

        <!-- Action buttons -->
        <section>
            <h2 class="sr-only">IDE controls</h2>

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

                <UPopover mode="hover" :open-delay="500">
                    <UButton icon="i-lucide-plus" @click="props.newProject">New</UButton>

                    <template #content>
                        <span class="p-1 flex items-center">
                            <UKbd variant="solid">Ctrl / ⌘</UKbd>
                            <span class="pr-1 pl-1">+</span>
                            <UKbd variant="solid" value="N"/>
                        </span>
                    </template>
                </UPopover>

                <UPopover v-if="props.save" mode="hover" :open-delay="500">
                    <UButton icon="i-lucide-save" @click="props.save">Save</UButton>

                    <template #content>
                        <span class="p-1 flex items-center">
                            <UKbd variant="solid">Ctrl / ⌘</UKbd>
                            <span class="pr-1 pl-1">+</span>
                            <UKbd variant="solid" value="S"/>
                        </span>
                    </template>
                </UPopover>

                <UPopover v-if="props.saveAs" mode="hover" :open-delay="500">
                    <UButton icon="i-lucide-save-all" @click="props.saveAs">Save as</UButton>

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

                <UPopover v-if="props.open" mode="hover" :open-delay="500">
                    <UButton icon="i-lucide-folder-open" @click="props.open">Open</UButton>

                    <template #content>
                        <span class="p-1 flex items-center">
                            <UKbd variant="solid">Ctrl / ⌘</UKbd>
                            <span class="pr-1 pl-1">+</span>
                            <UKbd variant="solid" value="O"/>
                        </span>
                    </template>
                </UPopover>
            </UButtonGroup>
        </section>

        <AboutDialog/>
    </header>
</template>