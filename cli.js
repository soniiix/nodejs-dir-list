#!/usr/bin/env node

import { argv } from 'node:process';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { readdir, stat } from 'node:fs/promises';
import chalk from 'chalk';
import { formatSize } from './format-size.js'
let args = argv

// Chalk custom variables
const error = chalk.red.bold;
const warning = chalk.yellow.bold;
const info = chalk.blue.bold.underline;

// Take the provided path if specified, or the current directory if not
let relativePath = "./";
let showAll = false
if (args.length >= 3){
    // Check if the '-a' param is specified
    showAll = (args.at(2) == "-a") || (args.at(args.length - 1) == "-a")

    if (showAll){
        // Remove '-a' from args list
        args = args.filter(arg => arg != "-a")
    }
    relativePath = args.slice(2).join(' ')
}
const absolutePath = path.resolve(process.cwd(), relativePath);

// Check if the provided path is valid.
if (!existsSync(absolutePath)){
    console.error(error("Error: The specified path was not found."));
    process.exit(1);
}

// Main process
try {
    let files = await readdir(absolutePath, {
        withFileTypes: true
    });

    if (files.length == 0){
        console.log(warning("Warning: The specified directory is empty."));
        process.exit(0);
    }

    // Remove the hidden files if '-a' is not specified
    if (!showAll){
        files = files.filter(file => !file.name.startsWith('.'))
    }

    let longestSize = 0;
    let dataOutput = [];

    for (const file of files){
        const stats = await stat(path.join(absolutePath, file.name));

        // Adjust size column width according to the longest value
        longestSize =  Math.max(longestSize, formatSize(stats.size).length);

        // Retrieve data for each file
        const lastModified = new Date(stats.mtime).toLocaleString([], {
            "year": "numeric",
            "month": "numeric",
            "day": "numeric",
            "hour": "2-digit",
            "minute": "2-digit"
        });
        const type = file.isDirectory() ? "DIR." : "FILE";
        const size = file.isFile()
            ? formatSize(stats.size)
            : '-';
        const fileName = file.isDirectory()
            ? chalk.blue(file.name)
            : file.name;

        // Add to the data output
        dataOutput.push({lastModified, type, size, fileName});
    }

    // Title
    console.log(`\nContent of ${info(absolutePath)} :\n`);

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
catch (err){
    console.error(error(`Error: Unable to read directory. ${err.message})`));
    process.exit(1);
}