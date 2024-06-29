const { get, IntegrationBase, Options } = require('@friggframework/core');
const { Definition: MiroModule } = require('@friggframework/api-module-miro');

class MiroIntegration extends IntegrationBase {
    static Config = {
        name: 'miro',
        version: '1.0.0',
        supportedVersions: ['1.0.0'],
        events: ['GET_BOARDS'],
    };

    static Options = new Options({
        module: MiroModule,
        integrations: [MiroModule],
        display: {
            name: 'Miro',
            description: 'Miro',
            category: 'Project Management & Team Communication',
            detailsUrl: 'https://miro.com',
            icon: 'https://asset.brandfetch.io/idAnDTFapY/idkwvxShC9.jpeg',
        },
        hasUserConfig: true,
    });

    static modules = {
        miro: MiroModule,
    };

    /**
     * HANDLE EVENTS
     */
    async receiveNotification(notifier, event, object = null) {
        if (event === 'GET_BOARDS') {
            return this.target.api.getBoards(object);
        }
    }

    /**
     * ALL CUSTOM/OPTIONAL METHODS FOR AN INTEGRATION MANAGER
     */
    async getSampleData() {
        try {
            const res = await this.target.api.getBoards();
            const formatted = res.data.map((board) => ({
                id: board.id,
                name: board.name,
                description: board.description,
                createdBy: board.createdBy.name,
                createdAt: board.createdAt,
                modifiedBy: board.modifiedBy.name,
                modifiedAt: board.modifiedAt,
                owner: board.owner.name,
                viewLink: board.viewLink,
            }));
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
        this.record.status = 'ENABLED';
        await this.record.save();
        return this.record;
    }

    async onUpdate(params) {
        const newConfig = get(params, 'config');
        this.record.config = newConfig;
        this.record.markModified('config');
        await this.record.save();
        return this.validateConfig();
    }

    async getConfigOptions() {
        const options = {};
        return options;
    }
}

module.exports = MiroIntegration;
