#!/usr/bin/env node

import { argv } from 'node:process';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { readdir, stat } from 'node:fs/promises';
import chalk from 'chalk';

// Chalk custom variables
const error = chalk.red.bold;
const warning = chalk.yellow.bold;
const info = chalk.blue.bold.underline;

if (argv.length != 3){
    argv.length < 3
        ? console.error(error("Error: Missing path argument. Please provide a directory path."))
        : console.error(error("Error: Too many arguments provided. Only one directory path expected."));
    process.exit(1)
}
else {
    const relativePath = argv[2];
    const absolutePath = path.resolve(process.cwd(), relativePath);

    if (!existsSync(absolutePath)){
        console.error(error("Error: The specified path was not found."))
        process.exit(1)
    }
    else {
        try {
            const files = await readdir(absolutePath, {
                withFileTypes: true
            });

            if (files.length == 0){
                console.log(warning("Warning: The specified directory is empty."))
            }
            else {
                console.log(`\nContent of ${info(absolutePath)} :\n`)

                

                // Adapt the minimum padding according to the file with the longest name
                let longestFileLength = files.reduce((max, file) => Math.max(max, file.name.length), 0) + 2;        
                
                // Head table
                console.log(`Date                   Type    Name ${' '.repeat(longestFileLength-2)} Size`);
                console.log('-'.repeat(31 + longestFileLength + 15));

                for (const file of files){
                    const stats = await stat(path.join(absolutePath, file.name))
    
                    const lastModifiedTime = new Date(stats.mtime).toLocaleString();
                    const type = file.isDirectory() ? "DIR." : "FILE";
                    const fileName = file.isDirectory()
                        ? chalk.blue(file.name.padEnd(longestFileLength))
                        : file.name.padEnd(longestFileLength);
                    const size = file.isFile() ? stats.size : '--';
    
                    // Add a line to the output
                    console.log(`${lastModifiedTime}    ${chalk.gray(type)}    ${fileName}    ${size}`)
                }
            }
        }
        catch (err){
            console.error(error(`Error: Unable to read directory. ${err.message})`));
            process.exit(1);
        }    
    }
}