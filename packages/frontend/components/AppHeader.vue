<script setup lang="ts">
const props = defineProps<{
    /**
     * The current open filename.
     */
    fileName: string,

    /**
     * Whether the "save as" operation is supported.
     */
    saveAsSupported: boolean,

    /**
     * Examples to show in the "Load example" dropdown.
     */
    examples: Example[],
}>();

const emit = defineEmits<{
    /**
     * Emitted when the "Save as" button is pressed.
     */
    (e: 'saveAs'): void;

    /**
     * Emitted when the "Open" button is pressed.
     */
    (e: 'open'): void;

    /**
     * Emitted when the "Save" button is pressed.
     */
    (e: 'save'): void;

    /**
     * Emitted when the "New" button is pressed.
     */
    (e: 'newProject'): void;

    /**
     * Emitted when the "Run" button is pressed.
     */
    (e: 'run'): void;

    /**
     * Emitted when an example is to be loaded.
     */
    (e: 'loadExample', example: Example): void;
}>();

const exampleItems = computed(() => props.examples.map(e => ({
    label: e.name,
    onSelect: () => {
        emit('loadExample', e);
    },
})));

const { running } = storeToRefs(useChrStore());
</script>

<template>
    <header class="border-b">
        <div class="flex justify-between items-center p-4">
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
                        <UButton icon="i-lucide-play" :disabled="running" @click="() => emit('run')">Run</UButton>

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
                        <UButton icon="i-lucide-plus" @click="() => emit('newProject')">New</UButton>

                        <template #content>
                            <span class="p-1 flex items-center">
                                <UKbd variant="solid">Ctrl / ⌘</UKbd>
                                <span class="pr-1 pl-1">+</span>
                                <UKbd variant="solid" value="N"/>
                            </span>
                        </template>
                    </UPopover>

                    <UPopover mode="hover" :open-delay="500">
                        <UButton icon="i-lucide-save" @click="() => emit('save')">Save</UButton>

                        <template #content>
                            <span class="p-1 flex items-center">
                                <UKbd variant="solid">Ctrl / ⌘</UKbd>
                                <span class="pr-1 pl-1">+</span>
                                <UKbd variant="solid" value="S"/>
                            </span>
                        </template>
                    </UPopover>

                    <UPopover v-if="props.saveAsSupported" mode="hover" :open-delay="500">
                        <UButton icon="i-lucide-save-all" @click="() => emit('saveAs')">Save as</UButton>

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

                    <UPopover mode="hover" :open-delay="500">
                        <UButton icon="i-lucide-folder-open" @click="() => emit('open')">Open</UButton>

                        <template #content>
                            <span class="p-1 flex items-center">
                                <UKbd variant="solid">Ctrl / ⌘</UKbd>
                                <span class="pr-1 pl-1">+</span>
                                <UKbd variant="solid" value="O"/>
                            </span>
                        </template>
                    </UPopover>
                </UButtonGroup>

                <UDropdownMenu :items="exampleItems" class="ml-4">
                    <UButton icon="i-lucide-chevron-down">Load example</UButton>
                </UDropdownMenu>
            </section>

            <AboutDialog/>
        </div>
        
        <UProgress v-if="running" size="sm" />
    </header>
</template>