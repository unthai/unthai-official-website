const { createStrapi } = require('@strapi/strapi');

(async () => {
    try {
        const strapi = await createStrapi({ distDir: './dist' }).load();

        console.log('--- CONTENT VERIFICATION REPORT ---');

        const types = ['api::hero.hero', 'api::about-page.about-page', 'api::global-content.global-content', 'api::lead-form.lead-form'];

        for (const type of types) {
            const count = await strapi.db.query(type).count();
            console.log(`Type: ${type} | Count: ${count}`);
            if (count > 0) {
                const entries = await strapi.db.query(type).findMany({ populate: true });
                console.log(`Entries for ${type}:`, JSON.stringify(entries, null, 2));
            }
        }

        // Check publications state specifically
        const heroPreview = await strapi.db.query('api::hero.hero').findOne({
            where: { documentId: { $ne: null } }
        });
        console.log('Hero Raw DB Entry:', JSON.stringify(heroPreview, null, 2));

        process.exit(0);
    } catch (error) {
        console.error('Error verifying content:', error);
        process.exit(1);
    }
})();
