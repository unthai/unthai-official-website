'use strict';

/**
 * detailed-service service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::detailed-service.detailed-service');
