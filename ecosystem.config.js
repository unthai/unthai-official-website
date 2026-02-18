module.exports = {
    apps: [
        {
            name: 'unthai-strapi',
            script: 'npm',
            args: 'start',
            cwd: './strapi',
            env_production: {
                NODE_ENV: 'production',
            },
        },
    ],
};
