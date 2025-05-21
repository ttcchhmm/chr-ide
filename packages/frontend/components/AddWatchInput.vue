<script setup lang="ts">
const constraintName = ref('');
const constraintPos = ref(1);

const chrStore = useChrStore();

watch(constraintPos, () => {
    if(constraintPos.value <= 0) {
        constraintPos.value = 1;
    }
});


const submit = (e: Event) => {
    e.preventDefault();

    chrStore.variables.push({
        name: constraintName.value,
        value: '',
    });

    constraintName.value = '';
};
</script>

<template>
    <form aria-label="Add a watch" class="pb-4" @submit="submit">
        <label for="add-watch-constraint" class="sr-only">Constraint name</label>
        <label for="add-watch-position" class="sr-only">Position</label>

        <UButtonGroup class="w-full flex">
            <UInput id="add-watch-constraint" ref="refName" v-model="constraintName" placeholder="Constraint name..." class="grow"/>

            <UButton icon="i-lucide-plus" type="submit" :disabled="constraintName.trim().length === 0 || constraintPos <= 0">
                <span class="sr-only">Add watch</span>
            </UButton>
        </UButtonGroup>
    </form>
</template>