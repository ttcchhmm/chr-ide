/**
 * Ask the user to select a file.
 * 
 * This should be used if the current browser does not support the *File system API*.
 * 
 * @returns A promise that resolves to the content of the selected file.
 */
export const openFileClassic = async () => {
    return new Promise<string>((resolve, reject) => {
        const input = document.querySelector('input#file-opener') as HTMLInputElement;

        if(!input) {
            reject(new Error('The FileOpener component is missing.'));
        }

        input.click();

        input.onchange = () => {
            input.onchange = null;

            if(!input.files || !input.files[0]) {
                reject(new Error('No file was selected'));
            } else {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result!.toString());
                reader.readAsText(input.files[0]);
            }
        }
    });
};