import arg from "arg";
import inquirer from "inquirer";
import { createProject } from "./main";

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--template": String,
      "--yes": Boolean,
      "-t": "--template",
      "-y": "--yes",
    },
    {
      argv: rawArgs.slice(2),
    }
  );

  return {
    skipPrompts: args["--yes"] || false,
    template: args["--template"] || null,
  };
}

async function promptForMissingOptions(options) {
  if (options.skipPrompts) {
    return {
      ...options,
      runInstall: options.runInstall || true,
      template: options.template || "simple",
    };
  }

  const questions = [];

  if (!options.template) {
    questions.push({
      type: "list",
      name: "template",
      message: "Please choose which project template to use",
      choices: ["Simple without ORM", "TypeORM with MySQL"],
      default: "Simple without ORM",
    });
  }

  questions.push({
    type: "input",
    name: "projectName",
    message: "Project name",
    default: "your_project_name",
  });

  questions.push({
    type: "input",
    name: "projectDescription",
    message: "Description",
    default: "Typescript REST starter",
  });

  questions.push({
    type: "input",
    name: "projectAuthor",
    message: "Author",
  });

  const defaultGitURL = "your_git_repo_url";

  questions.push({
    type: "input",
    name: "projectGitRepo",
    message: "Git repository",
    default: defaultGitURL,
  });

  questions.push({
    type: "input",
    name: "projectLicense",
    message: "License",
    default: "ISC",
  });

  if (!options.runInstall) {
    questions.push({
      type: "confirm",
      name: "runInstall",
      message: "Would you like to install dependencies",
      default: true,
    });
  }

  if (!options.git) {
    questions.push({
      type: "confirm",
      name: "git",
      message: "Initialize a git repository?",
      default: false,
    });
  }

  const answers = await inquirer.prompt(questions);

  if (answers.template) {
    if (answers.template == "Simple without ORM") {
      answers.template = "simple";
    } else {
      answers.template = "typeorm";
    }
  }

  if (answers.projectGitRepo != defaultGitURL) {
    if (answers.projectGitRepo.substr(-4) == ".git") {
      answers.projectGitRepo = answers.projectGitRepo.replace(".git", "");
    }
  }

  return {
    ...options,
    ...answers,
  };
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);

  await createProject(options);
}
