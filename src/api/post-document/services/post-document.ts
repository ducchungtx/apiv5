/**
 * post-document service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::post-document.post-document', ({ strapi }) => ({
  async crawlLinks(url) {
    return url;
  }
}));
