const core = require('@actions/core');
const github = require('@actions/github');

const { promisify } = require('util');
const { exec } = require('child_process');

const execAsyncInternal = promisify(exec);

async function run() {
    try {

        try {
            await execAsyncInternal(`az --version`);
            console.log("Az CLI is available");
        } catch {
            console.log("Could not find Azure CLI. Please install from https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest");
        }

        // `who-to-greet` input defined in action metadata file
        const nameToGreet = core.getInput('who-to-greet');
        const secrets = JSON.parse(nameToGreet);
        for (var key in secrets) {
            if (secrets.hasOwnProperty(key)) {
                try {
                    await execAsyncInternal(`az functionapp config appsettings set --settings ${key}=${secrets[key]} --resource-group acetest --name ssr-react-next-function`);
                    console.log("Added the secret to app setting");
                } catch {
                    console.log("Failed to add secrets to function");
                }
                
            }
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
