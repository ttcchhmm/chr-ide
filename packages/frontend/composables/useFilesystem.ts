/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/showOpenFilePicker#parameters
 */
type FilePickerOptions = {
    types: {
        description: string,
        accept: Record<string, string[]>,
    }[],
    multiple: boolean,
};

declare global {
    interface Window {
        /**
         * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/showOpenFilePicker
         */
        showOpenFilePicker?: (options?: FilePickerOptions) => Promise<FileSystemFileHandle[]>;

        /**
         * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/showOpenFilePicker
         */
        showSaveFilePicker?: (options?: FilePickerOptions) => Promise<FileSystemFileHandle>;
    }
};

const options = {
    types: [
        {
            description: 'CHR IDE project',
            accept: {
                'application/json': ['.json'],
            },
        },
    ],
    multiple: false,
};

export const useFilesystem = () => {
    const chrStore = useChrStore();
    const fileName = ref('');

    if('showOpenFilePicker' in window) {
        let handle: FileSystemFileHandle | null = null;
        
        const getOpenHandle = async () => {
            const handle = (await window.showOpenFilePicker!(options))[0];
            fileName.value = (await handle.getFile()).name;

            return handle;
        };
        const getSaveHandle = async () => {
            const handle = await window.showSaveFilePicker!(options);
            fileName.value = (await handle.getFile()).name;

            return handle;
        };

        const saveToHandle = async () => {
            const json = JSON.stringify(chrStore.getSaveFormat());

            const writable = await handle!.createWritable();
            await writable.write(json);
            await writable.close();

            useToast().add({
                title: 'File saved!',
                description: `Saved as ${fileName.value}.`,
                color: 'success',
            });
        }

        return {
            save: async () => {
                if(!handle) {
                    handle = await getSaveHandle();
                }

                await saveToHandle();
            },

            saveAs: async () => {
                handle = await getSaveHandle();
                await saveToHandle();
            },

            open: async () => {
                handle = await getOpenHandle();

                const json = JSON.parse(await (await handle.getFile()).text());
                chrStore.$patch(json);
            },

            fileName,
        };
    } else {
        return {
            save: () => {
                const url = URL.createObjectURL(new Blob([JSON.stringify(chrStore.getSaveFormat())], {
                    type: 'application/json',
                }));

                const a = document.createElement('a');
                a.href = url;
                a.download = `chr-ide-${Date.now()}.json`;

                document.body.append(a);
                a.click();

                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);  
                }, 0); 
            },

            saveAs: null, // Unsupported without a way to keep an handle

            open: async () => {
                const json = JSON.parse(await openFileClassic());
                chrStore.$patch(json);
            },

            fileName,
        };
    }
};