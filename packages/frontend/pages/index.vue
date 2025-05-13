<script setup lang="ts">
import CodeSection from '~/components/CodeSection.vue';
import ConstraintStoreSection from '~/components/ConstraintStoreSection.vue';
import VariableSection from '~/components/VariableSection.vue';

const save = ref<OptionalFunction>(null);
const saveAs = ref<OptionalFunction>(null);
const open = ref<OptionalFunction>(null);
const fileName = ref('');

const run = () => console.log('Run');

useHead({
    title: computed(() => fileName.value.length === 0 ? 'CHR IDE' : `CHR IDE - ${fileName.value}`),
});

defineShortcuts({
    'meta_shift_r': run,

    'meta_s': () => {
        if(save.value) {
            save.value();
        }
    },

    'meta_o': () => {
        if(open.value) {
            open.value();
        }
    },
    'meta_shift_s': () => {
        if(saveAs.value) {
            saveAs.value();
        }
    },
});

onMounted(() => {
    const { save: fsSave, saveAs: fsSaveAs, open: fsOpen, fileName: fsFileName } = useFilesystem();
    save.value = fsSave;
    saveAs.value = fsSaveAs;
    open.value = fsOpen;

    watch(fsFileName, () => fileName.value = fsFileName.value);
});
</script>

<template>
    <div class="flex flex-col h-screen">
        <AppHeader :open="open" :save="save" :save-as="saveAs" :run="run" :file-name="fileName"/>

        <main class="grid grid-cols-3 grow">
            <CodeSection/>
            <ConstraintStoreSection/>
            <VariableSection/>
        </main>
    </div>
</template>