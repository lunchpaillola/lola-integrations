const { createFriggBackend } = require('@friggframework/core');
const HubSpotIntegration = require('./src/integrations/HubSpotIntegration');
const LinearIntegration = require('./src/integrations/LinearIntegration');
const ContentfulIntegration = require('./src/integrations/ContentfulIntegration');
const MiroIntegration = require('./src/integrations/MiroIntegration');

const appDefinition = {
    integrations: [
        LinearIntegration,
        HubSpotIntegration,
        ContentfulIntegration,
        MiroIntegration,
    ],
    user: {
        password: true,
    },
};
const backend = createFriggBackend(appDefinition);
module.exports = { ...backend };
