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
});
