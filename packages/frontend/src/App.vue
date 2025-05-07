<script setup lang="ts">
import MonacoEditor from './components/MonacoEditor.vue';
</script>

<template>
  <div class="h-screen">
    <header>
    <div class="grid grid-cols-2 p-4 border-b-black border-b">
      <h1 class="text-2xl">CHR IDE</h1>

      <div class="flex justify-end">
        <button class="border p-1 m-1">Run</button>
        <button class="border p-1 m-1">Save</button>
        <button class="border p-1 m-1">Load</button>
      </div>
    </div>
  </header>

  <main class="grid grid-cols-3 font-sans p-4 h-full">
    <div class="mr-1 border-r-black border-r">
      <h2 class="text-xl">Code</h2>
      <MonacoEditor/>
    </div>

    <div class="mr-1 border-r-black border-r">
      <h2 class="text-xl">Constraint store</h2>
    </div>

    <div>
      <h2 class="text-xl">Variables</h2>
    </div>
  </main>
  </div>
</template>

<style>
</style>
