<script setup lang="ts">
const props = defineProps<{
    newProject: () => void;
    open: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:open', value: boolean): void,
}>();

const onNewWorkspace = () => {
    emit('update:open', false);
    props.newProject();
}

const exampleStore = useExampleStore();

const cancel = () => {
    exampleStore.example = null;
    emit('update:open', false);
}
</script>

<template>
    <UModal :open="open" :close="false" title="Reset the workspace?">
        <template #body>
            <p>Your current workspace will be reset.</p>
            <p v-if="exampleStore.example" class="pt-4">"{{ exampleStore.example.name }}" will be loaded.</p>
        </template>

        <template #footer>
            <div class="flex place-content-end w-full">
                <UButton class="mr-4" color="neutral" @click="cancel">Cancel</UButton>
                <UButton color="error" @click="onNewWorkspace">New workspace</UButton>
            </div>
        </template>
    </UModal>
</template>