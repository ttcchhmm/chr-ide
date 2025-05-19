<script setup lang="ts">
const constraintName = ref('');
const constraintPos = ref(1);

const refPosition = useTemplateRef('refPosition');

const chrStore = useChrStore();

watch(constraintPos, () => {
    if(constraintPos.value <= 0) {
        constraintPos.value = 1;
    }
});

// Handle pasting and entering a slash to move the focus on the next field
watch(constraintName, (newValue) => {
    const parsedInput = newValue.split('/');

    if(parsedInput.length > 1) {
        // If a number was entered after the slash, put it in the second field.
        const possiblePos = +parsedInput[1];
        if(!isNaN(possiblePos)) {
            constraintPos.value = possiblePos;
        }

        refPosition.value?.inputRef?.focus();
        
        // Slight delay needed to make sure that the slash is properly removed.
        setTimeout(() => constraintName.value = parsedInput[0], 0);
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
            <UInput id="add-watch-constraint" ref="refName" v-model="constraintName" placeholder="Constraint name..." class="grow"/>

            <div class="border-t border-b border-(--ui-border-accented) pr-2 pl-2 flex flex-col justify-center cursor-not-allowed">
                <p>/</p>
            </div>
            
            <UInput id="add-watch-position" ref="refPosition" v-model="constraintPos" placeholder="1" type="number" class="w-10 [&>input]:[appearance:textfield] [&>input::-webkit-inner-spin-button]:appearance-none"/>

            <UButton icon="i-lucide-plus" type="submit" :disabled="constraintName.trim().length === 0 || constraintPos <= 0">
                <span class="sr-only">Add watch</span>
            </UButton>
        </UButtonGroup>
    </form>
</template>