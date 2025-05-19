<script setup lang="ts">
const inputWithButtonStore = useInputWithButtonStore();

const props = defineProps<{
    /**
     * Label used for the section
     */
    label: string, 
    /**
     * Placeholder in the input section
     */
    placeholder: string,
}>();

const emits = defineEmits<{
    /**
     * Emitted when a value is submitted
     */
    (e: 'submit', value: string): void,
}>();

const id = ref('0');

const input = ref('');

// Submits the content of the input in its corresponding section
const submit = () => {
    emits("submit", input.value);
    input.value = "";
}

onMounted(() => {
    id.value = inputWithButtonStore.increment().toString();
});

</script>

<template>
    <div>
        <label :for="id" class="sr-only">{{ props.label }}</label>
        <UButtonGroup class="w-full flex">
            <UInput :id="id" v-model="input" type="text" class="grow" :placeholder="props.placeholder" @keyup.enter="submit"/>
            <UButton :disabled="input.trim().length === 0" icon="i-lucide-plus" @click="submit">
                <span class="sr-only">Add</span>
            </UButton>
        </UButtonGroup>
    </div>
</template>