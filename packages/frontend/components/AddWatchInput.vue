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
        constraint: constraintName.value,
        position: constraintPos.value,
        value: '',
    });

    constraintName.value = '';
    constraintPos.value = 1;
};
</script>

<template>
    <form aria-label="Add a watch" class="pb-4" @submit="submit">
        <label for="add-watch-constraint" class="sr-only">Constraint name</label>
        <label for="add-watch-position" class="sr-only">Position</label>

        <UButtonGroup class="w-full flex">
            <UInput id="add-watch-constraint" v-model="constraintName" placeholder="Constraint name..." class="grow"/>

            <div class="border-t border-b border-(--ui-border-accented) pr-2 pl-2 flex flex-col justify-center cursor-not-allowed">
                <p>/</p>
            </div>
            
            <UInput id="add-watch-position" v-model="constraintPos" placeholder="1" type="number" class="w-10 [&>input]:[appearance:textfield] [&>input::-webkit-inner-spin-button]:appearance-none"/>

            <UButton icon="i-lucide-plus" type="submit" :disabled="constraintName.trim().length === 0 || constraintPos <= 0">
                <span class="sr-only">Add watch</span>
            </UButton>
        </UButtonGroup>
    </form>
</template>