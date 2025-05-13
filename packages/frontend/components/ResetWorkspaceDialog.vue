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
</script>

<template>
    <UModal :open="open" title="Reset the workspace?">
        <template #body>
            <p>Your current workspace will be reset.</p>
        </template>

        <template #footer>
            <div class="flex place-content-end w-full">
                <UButton class="mr-4" color="neutral" @click="emit('update:open', false)">Cancel</UButton>
                <UButton color="error" @click="onNewWorkspace">New workspace</UButton>
            </div>
        </template>
    </UModal>
</template>