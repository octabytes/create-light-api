import colors from "colors";
import fs from "fs";
import copyTemplateDir from "copy-template-dir";
import ncp from "ncp";
import path from "path";
import { promisify } from "util";
import execa from "execa";
import Listr from "listr";

const access = promisify(fs.access);
const copyTemplate = promisify(copyTemplateDir);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
  copyTemplate(options.templateDirectory, options.targetDirectory, {
    name: options.projectName,
    description: options.projectDescription,
    gitURL: options.projectGitRepo,
    license: options.projectLicense,
    author: options.projectAuthor,
  });
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false,
  });
}

async function installPackages(options) {
  const pkgs = [
    "reflect-metadata",
    "class-transformer",
    "class-validator",
    "cors",
    "dotenv",
    "express",
    "swagger-jsdoc",
    "swagger-ui-express",
    "typedi",
  ];

  if (options.template.toLowerCase() == "typeorm") {
    pkgs.push("typeorm");
    pkgs.push("mysql");
  }

  const pkgsResult = await execa("npm", ["install", ...pkgs], {
    cwd: options.targetDirectory,
  });
  if (pkgsResult.failed) {
    return Promise.reject(new Error("Failed to install main packages"));
  }

  return;
}

async function installDevPackages(options) {
  const devPkgs = [
    "@types/express",
    "@types/node",
    "@types/swagger-jsdoc",
    "@types/swagger-ui-express",
    "ts-node",
    "ts-node-dev",
    "typescript",
  ];

  const devPkgsResult = await execa("npm", ["install", ...devPkgs, "-D"], {
    cwd: options.targetDirectory,
  });
  if (devPkgsResult.failed) {
    return Promise.reject(new Error("Failed to install main packages"));
  }

  return;
}

async function initGit(options) {
  const result = await execa("git", ["init"], {
    cwd: options.targetDirectory,
  });
  if (result.failed) {
    return Promise.reject(new Error("Failed to initialize git"));
  }
  return;
}

export async function createProject(options) {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd(),
  };

  const currentFileUrl = import.meta.url;
  const templateDir = path.resolve(
    new URL(currentFileUrl).pathname,
    "../../templates",
    options.template.toLowerCase()
  );
  options.templateDirectory = templateDir;

  try {
    await access(templateDir, fs.constants.R_OK);
  } catch (err) {
    console.error("%s Invalid template name", colors.red.bold("ERROR"));
    process.exit(1);
  }

  const tasks = new Listr([
    {
      title: "Copy project files",
      task: () => copyTemplateFiles(options),
    },
    {
      title: "Initialize git",
      task: () => initGit(options),
      enabled: () => options.git,
    },
    {
      title: "Install dependencies",
      task: () => installPackages(options),
      skip: () =>
        !options.runInstall
          ? "Pass --install to automatically install dependencies"
          : undefined,
    },
    {
      title: "Install dev dependencies",
      task: () => installDevPackages(options),
      skip: () =>
        !options.runInstall
          ? "Pass --install to automatically install dev dependencies"
          : undefined,
    },
  ]);

  await tasks.run();

  console.log("%s Project ready", colors.green.bold("DONE"));
  return true;
}
