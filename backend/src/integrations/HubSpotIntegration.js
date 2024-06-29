const { get, IntegrationBase, Options } = require('@friggframework/core');
const {
    Definition: HubSpotModule,
} = require('@friggframework/api-module-hubspot');

class HubSpotIntegration extends IntegrationBase {
    static Config = {
        name: 'hubspot',
        version: '1.0.0',
        supportedVersions: ['1.0.0'],
        events: ['LIST_COMPANIES'],
    };

    static Options = new Options({
        module: HubSpotModule,
        integrations: [HubSpotModule],
        display: {
            name: 'HubSpot',
            description: 'Sales & CRM, Marketing',
            category: 'Sales & CRM, Marketing',
            detailsUrl: 'https://hubspot.com',
            icon: 'https://friggframework.org/assets/img/hubspot.jpeg',
        },
        hasUserConfig: true,
    });

    static modules = {
        hubspot: HubSpotModule,
    };

    /**
     * HANDLE EVENTS
     */
    async receiveNotification(notifier, event, object = null) {
        if (event === 'LIST_COMPANIES') {
            return this.target.api.listCompanies(object);
        }
    }

    /**
     * ALL CUSTOM/OPTIONAL METHODS FOR AN INTEGRATION MANAGER
     */
    async getSampleData() {
        try {
            const res = await this.target.api.listCompanies();
            const formatted = res.results.map((company) => {
                const formattedCompany = {
                    id: company.id,
                    name: company.properties.name,
                    domain: company.properties.domain,
                    createdAt: company.createdAt,
                    lastModified: company.properties.hs_lastmodifieddate,
                };
                return formattedCompany;
            });
            return { data: formatted };
        } catch (error) {
            console.error('Error fetching sample data:', error);
            return { data: [], error: error.message || 'An error occurred' };
        }
    }

    /**
     * ALL REQUIRED METHODS FOR AN INTEGRATION MANAGER
     */
    async onCreate(params) {
        // Validate that we have all of the data we need
        // Set integration status as makes sense. Default ENABLED
        // TODO turn this into a validateConfig method/function
        this.record.status = 'ENABLED';
        await this.record.save();
        return this.record;
    }

    async onUpdate(params) {
        const newConfig = get(params, 'config');
        const oldConfig = this.record.config;
        // Just save whatever
        this.record.markModified('config');
        await this.record.save();
        return this.validateConfig();
    }

    async getConfigOptions() {
        const options = {};
        return options;
    }
}

module.exports = HubSpotIntegration;
