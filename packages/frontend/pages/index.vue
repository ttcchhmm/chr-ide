<script setup lang="ts">
import CodeSection from '~/components/CodeSection.vue';
import ConstraintStoreSection from '~/components/ConstraintStoreSection.vue';
import ResetWorkspaceDialog from '~/components/ResetWorkspaceDialog.vue';
import VariableSection from '~/components/VariableSection.vue';

const save = ref<NullableCallback>(null);
const saveAs = ref<NullableCallback>(null);
const open = ref<NullableCallback>(null);
const resetHandle = ref<NullableCallback>(null);

const fileName = ref('');

const showResetDialog = ref(false);

const chrStore = useChrStore();

const run = () => console.log('Run');

const newProject = () => {
    if(resetHandle.value) {
        resetHandle.value();
    }

    useChrStore().reset();
};

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

    'meta_shift_n': () => showResetDialog.value = true,
});

onMounted(() => {
    const { save: fsSave, saveAs: fsSaveAs, open: fsOpen, fileName: fsFileName, resetHandle: fsResetHandle } = useFilesystem();
    save.value = fsSave;
    saveAs.value = fsSaveAs;
    open.value = fsOpen;
    resetHandle.value = fsResetHandle;

    watch(fsFileName, () => fileName.value = fsFileName.value);

    chrStore.setupSocket(useSocket());
});

const { disconnected } = storeToRefs(chrStore);
watch(disconnected, () => {
    const toast = useToast();

    if(disconnected.value) {
        toast.add({
            title: 'Connection lost',
            color: 'error',
        });
    } else {
        toast.add({
            title: 'Connected',
            color: 'success',
        });
    }
});
</script>

<template>
    <div class="flex flex-col h-screen">
        <AppHeader :open="open" :save="save" :save-as="saveAs" :new-project="() => showResetDialog = true" :run="run" :file-name="fileName"/>

        <main class="grid grid-cols-3 grow h-full">
            <CodeSection/>
            <ConstraintStoreSection/>
            <VariableSection/>
        </main>

        <ResetWorkspaceDialog v-model:open="showResetDialog" :new-project="newProject"/>
    </div>
</template>