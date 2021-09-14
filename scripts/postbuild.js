/**
 * This is a development tool, we want the console for feedback.
 * We're recursing through a directory structure with fs/promises, awaits in loops are unavoidable.
 * Disabled because we want to do asynchronous work inside the forloop and forEach can be a wonky with async callbacks
 */
/* eslint-disable no-console, import/no-extraneous-dependencies, no-restricted-syntax, no-await-in-loop */
const path = require('path');
const fs = require('fs/promises');
const chalk = require('chalk');

const relevantExtensions = ['.esm.js'];
const badRegeneratorImport = "import { regeneratorRuntime } from 'regenerator-runtime/runtime';";
const goodRegeneratorImport = "import regeneratorRuntime from 'regenerator-runtime/runtime';";
const findFiles = async (directory) => {
  const filesAndDirectories = await fs.readdir(directory);

  for (const fileOrDirectory of filesAndDirectories) {
    if (fileOrDirectory === 'stories') {
      return null; // we don't build stories
    }
    const fileOrDirectoryPath = path.resolve(directory, fileOrDirectory);
    const fileOrDirectoryStat = await fs.stat(fileOrDirectoryPath);
    if (fileOrDirectoryStat
        && fileOrDirectoryStat.isFile()
        && relevantExtensions.some((extension) => fileOrDirectory.includes(extension))) {
      const data = await fs.readFile(fileOrDirectoryPath, 'utf-8');
      if (data.includes(badRegeneratorImport)) {
        console.log(chalk`{cyan.inverse  Info } Updating regenerator runtime import in ${fileOrDirectoryPath}`);
        fs.writeFile(fileOrDirectoryPath, data.replace(badRegeneratorImport, goodRegeneratorImport));
      }
    } else if (fileOrDirectoryStat && fileOrDirectoryStat.isDirectory()) {
      await findFiles(fileOrDirectoryPath); // find the components in this directory
    }
  }
  return 1;
};

const pipeline = async () => {
  console.log(chalk`{cyan.inverse  Info } Beginning search for components that need regenerator runtime`);
  await findFiles(path.resolve('./build'));
  console.log(chalk`{cyan.inverse  Info } Done.`);
};

pipeline();
