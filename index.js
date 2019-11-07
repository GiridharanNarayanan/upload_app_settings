const core = require('@actions/core');
const github = require('@actions/github');

const { promisify } = require('util');
const { exec } = require('child_process');

const execAsyncInternal = promisify(exec);

async function run() {
    try {
        // `who-to-greet` input defined in action metadata file
        const nameToGreet = core.getInput('who-to-greet');
        const secrets = JSON.parse(nameToGreet);
        for (var key in secrets) {
            if (secrets.hasOwnProperty(key)) {
                try {
                    await execAsyncInternal(`az --version`);
                    console.log("Az CLI is available");
                } catch {
                    console.log("Could not find Azure CLI. Please install from https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest");
                }
            }
        }

        const time = (new Date()).toTimeString();
        core.setOutput("time", time);
        // Get the JSON webhook payload for the event that triggered the workflow
        const payload = JSON.stringify(github.context.payload, undefined, 2);
        console.log(`The event payload: ${payload}`);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
