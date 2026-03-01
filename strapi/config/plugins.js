module.exports = ({ env }) => ({
    graphql: {
        enabled: true,
        config: {
            playgroundAlways: true,
            defaultLimit: 10,
            maxLimit: 20,
            apolloServer: {
                tracing: true,
            },
        }
    },
    sentry: {
        enabled: true,
        config: {
            dsn: env('SENTRY_DSN'),
        },
    },
    email: {
        config: {
            provider: 'nodemailer',
            providerOptions: {
                host: env('SMTP_HOST', 'localhost'),
                port: env('SMTP_PORT', 25),
                auth: {
                    user: env('SMTP_USERNAME'),
                    pass: env('SMTP_PASSWORD'),
                },
            },
            settings: {
                defaultFrom: 'hello@unth.ai',
                defaultReplyTo: 'hello@unth.ai',
            },
        },
    },
    ckeditor: {
        enabled: true
    },
    'strapi-cache': {
        enabled: true,
        config: {
            debug: false,
            max: 500,
            ttl: 3600, // 1 hour in seconds
            routes: [
                '/api/hero',
                '/api/services',
                '/api/services/*',
                '/api/newsletter',
                '/api/about-page',
                '/api/global-content',
                '/api/lead-form',
            ],
        },
    },
});
