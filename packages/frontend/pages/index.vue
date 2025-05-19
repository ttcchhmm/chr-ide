<script setup lang="ts">
const save = ref<NullableCallback>(null);
const saveAs = ref<NullableCallback>(null);
const open = ref<NullableCallback>(null);
const resetHandle = ref<NullableCallback>(null);

const fileName = ref('');

const showResetDialog = ref(false);

const chrStore = useChrStore();
const exampleStore = useExampleStore();

const run = () => chrStore.run();

const invokeIfPossible = (func: (() => void) | null) => {
    if(func) {
        func();
    }
};

const newProject = () => {
    if(resetHandle.value) {
        resetHandle.value();
    }

    chrStore.reset();
    
    if(exampleStore.example) {
        chrStore.$patch({
            code: exampleStore.example.code,
            constraints: exampleStore.example.constraints.slice(), // Clone the array
            variables: exampleStore.example.variables.slice(), // Clone the array
        });

        exampleStore.example = null;
    }
};

const loadExample = (example: Example) => {
    exampleStore.example = example;
    showResetDialog.value = true;
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
        <AppHeader :examples="examples" :file-name="fileName" :save-as-supported="saveAs !== null" @open="() => invokeIfPossible(open)" @save="invokeIfPossible(save)" @save-as="invokeIfPossible(saveAs)" @new-project="() => showResetDialog = true" @run="run" @load-example="loadExample"/>

        <main class="grid grid-cols-3 grow h-0 shrink-0 basis-auto">
            <CodeSection/>
            <ConstraintStoreSection/>
            <VariableSection/>
        </main>

        <ResetWorkspaceDialog v-model:open="showResetDialog" :new-project="newProject"/>
    </div>
</template>