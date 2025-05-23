import { readFile } from 'node:fs/promises';
import { CHRVariable } from '@chr-ide/core';
import { findVariableTypes, findUppercaseVariables } from './parser.js';


type  Variabletype = { constraint: string, position: number, type: string | null, variable: string };


/**
 * Function to prepare the file for compilation.
 * 
 * @param code - The CHR code to be inserted into the skeleton.
 * @param constraints - The constraints to process.
 * @param watch - The variables to watch.
 */
export const prepareFile = async (code: string, constraints: string[], watch: CHRVariable[]) => {
    let fileContent = await readFile("./skeleton.cpp", 'utf-8');

    code = sanitizeCode(code);

    const logicalVariables = findUppercaseVariables(constraints);
    const variableTypes = findVariableTypes(code, logicalVariables);

    constraints = processConstraints(constraints);

    fileContent = fileContent.replace("//Rules", code);
    fileContent = fileContent.replace(
        "//Constraints",
        constraints.map(constraint => "space->" + constraint + ";").join('\n')
    );

    fileContent = fileContent.replace("//Variables", replaceVariables(variableTypes, watch));
    fileContent = fileContent.replace("//PrintVariables", replacePrintVariables(watch, constraints));

    return fileContent;
};

/**
 * Sanitize the CHR code to prevent code injection.
 * 
 * @param code - The CHR code to sanitize.
 */
const sanitizeCode = (code: string): string => {
    return code.replaceAll(/(\/\*)|(\*\/)|(<\/CHR>)/gi, '');
};

/**
 * Process constraints by removing comments.
 * 
 * @param constraints - The constraints to process.
 */
const processConstraints = (constraints: string[]): string[] => {
    return constraints.map(constraint =>
        constraint.replace(/\/\*[\s\S]*?\*\//g, '')
    );
};

/**
 * Replace variables in the skeleton file.
 * 
 * @param variableTypes - The variable types to replace.
 * @param watch - The variables to watch.
 */
const replaceVariables = (variableTypes: Variabletype[], watch: CHRVariable[]): string => {
    const vartemplate = 'chr::Logical_var<//Type> //Name;';
    return variableTypes.map((item: Variabletype) => {
        if (item.type) {
            const variableDeclaration = vartemplate
                .replace(/\/\/Type/g, () => item.type as string)
                .replace(/\/\/Name/g, () => item.variable);

            const watchVariable = watch.find(w => w.name === item.variable);
            if (watchVariable?.value) {
                return variableDeclaration.replace(';', `(${watchVariable.value});`);
            }

            return variableDeclaration;
        } else {
            return '';
        }
    }).join('\n');
};

/**
 * Replace print variables in the skeleton file.
 * 
 * @param watch - The variables to watch.
 * @param constraints - The constraints to check.
 */
const replacePrintVariables = (watch: CHRVariable[], constraints: string[]): string => {
    const printvartemplate = 'std::cout << "TRACE [VAR][//Name][" << //Name <<"]"<< std::endl;';
    const printvartemplatedefine = 'std::cout << "TRACE [VAR][//Name]["<< "["<< //Value << "]"<< std::endl;';

    return watch.map((item: CHRVariable) => {
        if (!constraints.find(c => c.includes(item.name))) {
            return printvartemplatedefine
                .replace(/\/\/Value/g, () => item.value ?? 'undefined')
                .replace(/\/\/Name/g, () => item.name);
        } else {
            if (item.name) {
                return printvartemplate
                    .replace(/\/\/Name/g, () => item.name);
            } else {
                return '';
            }
        }
    }).join('\n');
};


