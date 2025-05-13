<script setup lang="ts">
import CodeSection from '~/components/CodeSection.vue';
import ConstraintStoreSection from '~/components/ConstraintStoreSection.vue';
import VariableSection from '~/components/VariableSection.vue';

useHead({
    title: 'CHR IDE',
});

const filesystem = ref({
    save: null as OptionalFunction,
    saveAs: null as OptionalFunction,
    open: null as OptionalFunction,
});

const run = () => console.log('Run');

defineShortcuts({
    'meta_shift_r': run,

    'meta_s': () => {
        if(filesystem.value.save) {
            filesystem.value.save()
        }
    },

    'meta_o': () => {
        if(filesystem.value.open) {
            filesystem.value.open()
        }
    },
    'meta_shift_s': () => {
        if(filesystem.value.saveAs) {
            filesystem.value.saveAs()
        }
    },
});

onMounted(() => {
    filesystem.value = useFilesystem();
});
</script>

<template>
    <div class="flex flex-col h-screen">
        <AppHeader :filesystem="filesystem" :run="run"/>

        <main class="grid grid-cols-3 grow">
            <CodeSection/>
            <ConstraintStoreSection/>
            <VariableSection/>
        </main>
    </div>
</template>