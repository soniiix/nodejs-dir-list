import { argv } from 'node:process';

if (argv.length != 3){
    argv.length < 3
        ? console.error("Error: Missing path argument. Please provide a directory path.")
        : console.error("Error: Too many arguments provided. Only one directory path expected.");
    process.exit(1)
} else {
    //continue process...
}