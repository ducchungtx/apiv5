/**
 * crawl-manual-link controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::crawl-manual-link.crawl-manual-link', ({ strapi }) => ({
  async 'get-manual-links'(ctx) {
    const url = ctx.query.url;
    const links = await strapi.service('api::crawl-manual-link.crawl-manual-link').getManualLinks(url);
    return {
      message: 'crawl-manual-links',
      links
    }
  },

  async 'get-manual-detail'(ctx) {
    const url = ctx.query.url;
    const info = strapi.service('api::crawl-manual-link.crawl-manual-link').getManualDetail(url);
    return {
      message: 'crawl-manual-detail',
      info
    }
  }
}));
