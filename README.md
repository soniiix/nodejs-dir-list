# listdir 🗂️
[![npm version](https://img.shields.io/npm/v/@soniix/listdir)](https://www.npmjs.com/package/@soniix/listdir)

## Description
``listdir`` is a simple and intuitive CLI command that lists the content of a directory, including information like file type, size and last modified time.

## Install
Make sure you have Node.js installed and run the following command :
```bash
npm install -g @soniix/listdir
```

## Usage
Once installed, use the ``listdir`` command followed by the directory path :
```bash
listdir /directory/path
```
If no directory path is provided, the current directory will be listed :
```bash
listdir
```

### Options

You can choose to show all files including hidden files using the `-a` option :

```bash
listdir -a /directory/path
```

This will also work :

```bash
listdir /directory/path -a
```

## Example
Here is an example of the `listdir` command output :

![output_example](https://raw.githubusercontent.com/soniiix/nodejs-listdir/refs/heads/main/resources/screenshot.png)

## Useful links
- [NPM page](https://www.npmjs.com/package/@soniix/listdir)
- [Github repository](https://github.com/soniiix/nodejs-listdir)