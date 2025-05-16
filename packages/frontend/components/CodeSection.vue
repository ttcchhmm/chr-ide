<script setup lang="ts">
import { Codemirror } from 'vue-codemirror';

const { code } = storeToRefs(useChrStore());
</script>

<template>
    <section class="border-r flex flex-col h-full overflow-auto">
        <h2 class="text-xl font-bold p-4">Code</h2>

        <Codemirror
            v-model="code"
            :tab-side="2"
            :intent-with-tab="true"
            :style="{ 'flex-grow': 1, 'font-family': 'JetBrains Mono, monospace' }"/>
    </section>
</template>