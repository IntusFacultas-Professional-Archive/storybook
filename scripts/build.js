/**
 * This is a development tool, we want the console for feedback.
 * We're recursing through a directory structure with fs/promises, awaits in loops are unavoidable.
 * Disabled because we want to do asynchronous work inside the forloop and forEach can be a wonky with async callbacks
 */
/* eslint-disable no-console, import/no-extraneous-dependencies, no-restricted-syntax, no-await-in-loop */
const path = require('path');
const { execSync } = require('child_process');
const fs = require('fs/promises');
const chalk = require('chalk');

const filesToBuild = [];
const errors = [];
const buildableExtensions = ['.js', '.vue'];
const excludedExtensions = ['.storybook.vue'];
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
        && buildableExtensions.some((extension) => fileOrDirectory.includes(extension))
        && !excludedExtensions.some((extension) => fileOrDirectory.includes(extension))) {
      filesToBuild.push({
        file: fileOrDirectory,
        filePath: directory,
      });
    } else if (fileOrDirectoryStat && fileOrDirectoryStat.isDirectory()) {
      await findFiles(fileOrDirectoryPath); // find the components in this directory
    }
  }
  return 1;
};

const build = async () => {
  for (const { file, filePath } of filesToBuild) {
    console.log(chalk`{cyan.inverse  Info } Building ${file}`);
    try {
      execSync(`npm run build:component -- --module ${file} --path ${filePath} 2>&1`);
      const [fileName, extension] = file.split('.');
      const expectedFile = `${fileName}.esm.js`;
      try {
        const expectedStat = await fs.stat(path.resolve(filePath, expectedFile));
        if (!expectedStat.isFile()) {
          errors.push({
            fullPath: path.resolve(filePath, file),
            file,
            filePath,
          });
        }
      } catch (error) {
        errors.push({
          fullPath: path.resolve(filePath, file),
          file,
          filePath,
        });
      }
    } catch (error) {
      errors.push({
        fullPath: path.resolve(filePath, file),
        file,
        filePath,
      });
    }
  }
  errors.forEach((error) => {
    console.error(chalk`{redBright.inverse  Error } ${error.fullPath} failed to build. 
      Try running {cyan npm run build:component -- --module ${error.file} -- path ${error.filePath}}`);
  });
};

const pipeline = async () => {
  console.log(chalk`{cyan.inverse  Info } Beginning search for buildable components`);
  await findFiles(path.resolve('./build'));
  console.log(chalk`{cyan.inverse  Info } Done.`);
  console.log(chalk`{cyan.inverse  Info } Beginning build process for components.`);
  await build();
  console.log(chalk`{cyan.inverse  Info } Done.`);
};

pipeline();
