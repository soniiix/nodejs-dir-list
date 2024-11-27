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
                let longestFile = 0;
                let longestSize = 0;
                let dataOutput = []

                for (const file of files){
                    const stats = await stat(path.join(absolutePath, file.name))

                    // Adjust columns width according to the longest values
                    longestFile =  Math.max(longestFile, file.name.length);
                    longestSize =  Math.max(longestSize, stats.size.toString().length);

                    // Retrieve data for each file
                    const lastModified = new Date(stats.mtime).toLocaleString([], {
                        "year": "numeric",
                        "month": "numeric",
                        "day": "numeric",
                        "hour": "2-digit",
                        "minute": "2-digit"
                    });
                    const type = file.isDirectory() ? "DIR." : "FILE";
                    const size = file.isFile() ? stats.size.toString() : '-';
                    const fileName = file.isDirectory()
                        ? chalk.blue(file.name)
                        : file.name;
    
                    // Add a line to the data output
                    dataOutput.push({lastModified, type, size, fileName});
                }

                // Title
                console.log(`\nContent of ${info(absolutePath)} :\n`)

                // Table head
                console.log(`Date              Type  ${'Size'.padStart(longestSize)}  Name`);
                console.log(`----              ----  ${'----'.padStart(longestSize)}  ----`);

                // Data output
                dataOutput.forEach((item) => {
                    console.log(
                        `${item.lastModified}  ` +
                        `${chalk.gray(item.type)}  ` +
                        `${item.size.padStart(longestSize < 4 ? 4 : longestSize)}  ` +
                        `${item.fileName}`
                    );
                });
            }
        }
        catch (err){
            console.error(error(`Error: Unable to read directory. ${err.message})`));
            process.exit(1);
        }    
    }
}