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
         * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/showSaveFilePicker
         */
        showSaveFilePicker?: (options?: FilePickerOptions) => Promise<FileSystemFileHandle>;
    }
};

/**
 * Common options for the file picker.
 */
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

/**
 * Get functions to access a file on the filesystem.
 * @returns Functions to access a file on the filesystem.
 */
export const useFilesystem = () => {
    const chrStore = useChrStore();
    const fileName = ref('');

    if('showOpenFilePicker' in window) { // Current browser supports the filesystem API
        let handle: FileSystemFileHandle | null = null;
        
        /**
         * Open a file from the filesystem.
         * @returns A file handle
         */
        const getOpenHandle = async () => {
            const handle = (await window.showOpenFilePicker!(options))[0];
            fileName.value = (await handle.getFile()).name;

            return handle;
        };

        /**
         * Create a file on the filesystem.
         * @returns A file handle
         */
        const getSaveHandle = async () => {
            const handle = await window.showSaveFilePicker!(options);
            fileName.value = (await handle.getFile()).name;

            return handle;
        };

        /**
         * Save the current state to the filesystem.
         */
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

            resetHandle: () => {
                handle = null;
                fileName.value = '';
            },

            fileName,
        };
    } else { // Fallback for browsers without filesystem API support
        // Warn the user
        useToast().add({
            title: 'Limited file access',
            description: 'Your browser does not support the filesystem API. Reading and writing to your local filesystem is limited.',
            color: 'error',
        });

        return {
            save: () => { // Create a link with the download and click it
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

            resetHandle: () => {},

            open: async () => {
                const json = JSON.parse(await openFileClassic());
                chrStore.$patch(json);
            },

            fileName, // Will always be blank
        };
    }
};