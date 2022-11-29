'use strict';

const createPopulatedController = require('../../../createPopulatedController.js');

const collectionType = 'config'
const schema = require(`../content-types/${collectionType}/schema.json`);

/**
 *  config controller
 */

module.exports = createPopulatedController('api::config.config', schema);
