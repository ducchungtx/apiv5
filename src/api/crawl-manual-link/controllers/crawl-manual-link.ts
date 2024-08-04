/**
 * crawl-manual-link controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::crawl-manual-link.crawl-manual-link', ({ strapi }) => ({
  async 'get-manual-links'(ctx) {
    const url = ctx.query.url;
    return {
      message: 'crawl-manual-links',
    }
  },

  async 'get-manual-detail'(ctx) {
    const url = ctx.query.url;
    return {
      message: 'crawl-manual-detail',
    }
  }
}));
