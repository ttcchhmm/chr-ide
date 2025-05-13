<script setup lang="ts">
const newWatchName = ref('');
</script>

<template>
    <section class="p-4">
        <h2 class="text-xl font-bold pb-4">Variables</h2>
        
        <label for="watch-input" class="sr-only">Watch name</label>
        <UButtonGroup class="w-full flex">
            <UInput id="watch-input" v-model="newWatchName" type="text" class="grow" placeholder="New watch..."/>
            <UButton :disabled="newWatchName.trim().length === 0" icon="i-lucide-plus">
                <span class="sr-only">Create the watch</span>
            </UButton>
        </UButtonGroup>
    </section>
</template>