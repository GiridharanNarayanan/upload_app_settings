const core = require('@actions/core');

const { promisify } = require('util');
const { exec } = require('child_process');

const execAsyncInternal = promisify(exec);

async function run() {
    try {

        try {
            await execAsyncInternal(`az --version`);
            console.log("Azure CLI is available.");
        } catch (error) {
            console.log("Unable to find Azure CLI");
            core.setFailed(error.message);
            return;
        }

        const appSecretsJSON = core.getInput('app_secrets');
        if (!appSecretsJSON) {
            core.setFailed("'app_secrets' input value is null or empty.");
            return;
        }

        const secrets = JSON.parse(appSecretsJSON);
        for (var key in secrets) {
            if (secrets.hasOwnProperty(key)) {
                try {
                    await execAsyncInternal(`az functionapp config appsettings set --settings ${key}=${secrets[key]} --resource-group acetest --name ssr-react-next-function`);
                    console.log("Added the secret to app setting.");
                } catch (error) {
                    console.log("Failed to add secrets to app setting.");
                    core.setFailed(error.message);
                    return;
                }
            }
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
