<script setup lang="ts">
const { code } = storeToRefs(useChrStore());
</script>

<template>
    <section class="border-r flex flex-col">
        <h2 class="text-xl font-bold p-4">Code</h2>
        <MonacoEditor v-model="code" class="grow"/>
    </section>
</template>