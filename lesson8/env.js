// 1. Module Scaffolding: Create a container for all environments
const environments = {};

// 2. Staging Object: Settings for your local computer
// FIX: Removed '()=>', changed to simple object '{}'
environments.staging = {
    port: 3000,
    envName: 'staging'
};

// 3. Production Object: Settings for the real server
// FIX: Removed '()=>', changed to simple object '{}'
environments.production = {
    port: 5000,
    envName: 'production'
};

// 4. Determine Environment: Check what the user passed in the command line
// Example: if user types "NODE_ENV=production node index.js", this becomes 'production'
const currentEnv = typeof(process.env.NODE_ENV) === 'string' 
    ? process.env.NODE_ENV 
    : 'staging'; // Default to staging if nothing is passed

// 5. Export Logic: Check if the chosen environment actually exists in our list
// FIX: Changed 'env[CSSSupportsRule]' (which is undefined) to 'environments[currentEnv]'
const environmentToExport = typeof(environments[currentEnv]) === 'object' 
    ? environments[currentEnv] 
    : environments.staging; // Fallback to staging if the user typed a wrong name

// 6. Export the Module: Send the chosen settings out
module.exports = environmentToExport;