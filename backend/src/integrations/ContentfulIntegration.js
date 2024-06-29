const { get, IntegrationBase, Options } = require('@friggframework/core');
const {
    Definition: ContentfulModule,
} = require('@friggframework/api-module-contentful');

class ContentfulIntegration extends IntegrationBase {
    static Config = {
        name: 'contentful',
        version: '1.0.0',
        supportedVersions: ['1.0.0'],
        events: ['GET_SPACES'],
    };

    static Options = new Options({
        module: ContentfulModule,
        integrations: [ContentfulModule],
        display: {
            name: 'Contentful',
            description: 'Contentful',
            category: 'Sales & CRM, Marketing',
            detailsUrl: 'https://contentful.com',
            icon: 'https://asset.brandfetch.io/idHHabFFo2/idLkQEYlr8.svg',
        },
        hasUserConfig: true,
    });

    static modules = {
        contentful: ContentfulModule,
    };

    /**
     * HANDLE EVENTS
     */
    async receiveNotification(notifier, event, object = null) {
        if (event === 'GET_SPACES') {
            return this.target.api.getSpaces(object);
        }
    }

    /**
     * ALL CUSTOM/OPTIONAL METHODS FOR AN INTEGRATION MANAGER
     */
    async getSampleData() {
        try {
            const res = await this.target.api.getSpaces();
            const formatted = res.items.map((space) => {
                const formattedSpace = {
                    id: space.sys.id,
                    name: space.name,
                    createdBy: space.sys.createdBy.sys.id,
                    createdAt: space.sys.createdAt,
                    updatedBy: space.sys.updatedBy.sys.id,
                    updatedAt: space.sys.updatedAt,
                    organization: space.sys.organization.sys.id,
                };
                return formattedSpace;
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

module.exports = ContentfulIntegration;
