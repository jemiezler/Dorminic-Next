#!/usr/bin/env node

const { spawn } = require('child_process');
const { Command } = require('commander');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const program = new Command();

const defaultPorts = {
  backend: 8080,
  admin: 3000,
  user: 3001,
  shared: 3002,
};

// Function to create .env files with user-defined or default ports
async function createEnvFiles() {
  const ports = {};

  // Prompt user for port numbers
  const questions = Object.keys(defaultPorts).map(service => ({
    type: 'input',
    name: service,
    message: `Enter port for ${service} (default ${defaultPorts[service]}):`,
    default: defaultPorts[service].toString(),
    validate: input => !isNaN(parseInt(input, 10)) ? true : 'Please enter a valid number.'
  }));

  const mongoUriQuestion = {
    type: 'input',
    name: 'mongoUri',
    message: 'Enter MongoDB URI for backend:',
    default: 'mongodb://localhost:27017/dorminic-next',
  };

  const answers = await inquirer.prompt([...questions, mongoUriQuestion]);

  Object.keys(defaultPorts).forEach(service => {
    const port = answers[service] || defaultPorts[service];
    ports[service] = parseInt(port, 10);
    let envFilePath;
    if (service === 'backend') {
      envFilePath = path.join('./backend', '.env');
    } else {
      envFilePath = path.join('./frontend', service, '.env');
    }

    // Ensure the directory exists before creating the .env file
    fs.mkdirSync(path.dirname(envFilePath), { recursive: true });

    let envContent = `PORT=${ports[service]}`;
    if (service === 'backend') {
      envContent += `\nMONGODB_URI=${answers.mongoUri}`;
    }
    fs.writeFileSync(envFilePath, envContent, { encoding: 'utf8' });
    console.log(`Created .env file for ${service} with PORT=${ports[service]}`);
  });
}

// Function to run a specific service and stream the output
function runService(service) {
  if (service in services) {
    console.log(`Starting ${service}...`);

    // Set environment variables
    const env = { PORT: services[service].port };

    const [command, ...args] = services[service].command.split(' ');
    const serviceProcess = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, ...env }
    });

    serviceProcess.on('error', (error) => {
      console.error(`Error starting ${service}: ${error.message}`);
    });

    serviceProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`${service} exited with code ${code}`);
      }
    });
  } else {
    console.error(`Unknown service: ${service}`);
  }
}

// Function to run all services
function runAllServices() {
  Object.keys(services).forEach(runService);
}

// Function to interactively select a service to start
function promptServiceSelection() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'service',
        message: 'Select a service to run:',
        choices: [...Object.keys(services), 'All'],
      },
    ])
    .then((answers) => {
      if (answers.service === 'All') {
        runAllServices();
      } else {
        runService(answers.service);
      }
    });
}

// Define services
const services = {
  backend: {
    command: 'cd backend && pnpm run start:dev',
    port: 8080
  },
  admin: {
    command: 'cd frontend/admin && pnpm run dev',
    port: 3000
  },
  user: {
    command: 'cd frontend/user && pnpm run dev',
    port: 3001
  },
  shared: {
    command: 'cd frontend/shared && pnpm run dev',
    port: 3002
  },
};

// Setup command to install dependencies and create .env files
program
  .command('setup')
  .description('Install all dependencies for each project and create .env files')
  .action(async () => {
    await createEnvFiles();
    const setupCommands = [
      'cd backend && pnpm install',
      'cd frontend/admin && pnpm install',
      'cd frontend/user && pnpm install',
      'cd frontend/shared && pnpm install',
    ];

    console.log('Installing dependencies for all projects...');

    setupCommands.forEach((command) => {
      const [cmd, ...args] = command.split(' ');
      const setupProcess = spawn(cmd, args, { stdio: 'inherit', shell: true });

      setupProcess.on('error', (error) => {
        console.error(`Error during setup: ${error.message}`);
      });
    });
  });

// Setup command to install dependencies
program
  .command('install')
  .description('Install all dependencies for each project')
  .action(async () => {
    const setupCommands = [
      'cd backend && pnpm install',
      'cd frontend/admin && pnpm install',
      'cd frontend/user && pnpm install',
      'cd frontend/shared && pnpm install',
    ];

    console.log('Installing dependencies for all projects...');

    setupCommands.forEach((command) => {
      const [cmd, ...args] = command.split(' ');
      const setupProcess = spawn(cmd, args, { stdio: 'inherit', shell: true });

      setupProcess.on('error', (error) => {
        console.error(`Error during setup: ${error.message}`);
      });
    });
  });

// Dev command to start services interactively
program
  .command('dev')
  .description('Select a service to start interactively')
  .action(() => {
    console.log('Running dorminic dev...');
    promptServiceSelection();
  });

program.parse(process.argv);
