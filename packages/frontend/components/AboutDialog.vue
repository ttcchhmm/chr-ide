<template>
    <UModal title="About CHR IDE">
        <UButton icon="i-lucide-info" class="ml-4">About</UButton>

        <template #body>
            <p class="pb-4">CHR IDE is a web-based playground built around <ULink to="https://gitlab.com/vynce/chrpp" inactive-class="text-primary">CHR++</ULink>, a CHR-to-C++ compiler.</p>

            <p class="pb-4">CHR IDE is free software (<ULink to="https://github.com/ttcchhmm/chr-ide/blob/main/LICENCE" inactive-class="text-primary">GNU AGPLv3</ULink>). The source code is available on <ULink to="https://github.com/ttcchhmm/chr-ide" inactive-class="text-primary">GitHub</ULink>.</p>

            <p>Credits:</p>
            <ul class="pl-8 list-disc">
                <li><ULink to="https://github.com/Qraim/" inactive-class="font-bold text-primary">Quentin Raimbault</ULink>: developer on CHR IDE</li>
                <li><ULink to="https://github.com/Gyrehio/" inactive-class="font-bold text-primary">Victor Loiseau</ULink>: developer on CHR IDE</li>
                <li><ULink to="https://github.com/ttcchhmm/" inactive-class="font-bold text-primary">Tom Chedmail</ULink>: developer on CHR IDE</li>
                <li><ULink to="https://gitlab.com/vynce" inactive-class="font-bold text-primary">Vincent Barichard</ULink>: author of the <ULink to="https://gitlab.com/vynce/chrpp" inactive-class="text-primary">CHR++</ULink> project.</li>
            </ul>
        </template>
    </UModal>
</template>