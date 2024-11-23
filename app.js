import { argv } from 'node:process';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { readdir, stat } from 'node:fs/promises';

if (argv.length != 3){
    argv.length < 3
        ? console.error("Error: Missing path argument. Please provide a directory path.")
        : console.error("Error: Too many arguments provided. Only one directory path expected.");
    process.exit(1)
} else {
    const relativePath = argv[2];
    const absolutePath = path.resolve(process.cwd(), relativePath);

    if (!existsSync(absolutePath)){
        console.log("Error: The specified path was not found.")
        process.exit(1)
    }
    else{
        const files = await readdir(absolutePath, {
            withFileTypes: true
        });
        for (const file of files){
            const stats = await stat(path.join(absolutePath, file.name))
            console.log(
                file.isDirectory() ? "DIR." : "FILE",
                " - ",
                file.name,
                file.isFile() ? ' -  ' + stats.size + 'ko' : ''
            )
        }
    }
}