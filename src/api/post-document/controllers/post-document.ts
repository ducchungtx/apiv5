/**
 * post-document controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::post-document.post-document', ({ strapi }) => ({
  async 'crawl-brand-links'(ctx) {
    const url = ctx.query.url;
    const links = await strapi.service('api::post-document.post-document').crawlBrandLinks(url);
    return {
      links
    };
  },
  async 'crawl-manual-links'(ctx) {
    const url = ctx.query.url;
    console.log('url', url);
    const links = await strapi.service('api::post-document.post-document').crawlManualLinks(url);
    return {
      links
    };
  },
  async 'crawl-manual-detail'(ctx) {
    const url = ctx.query.url;
    console.log('url', url);
    const info = await strapi.service('api::post-document.post-document').crawlManualDetail(url);
    return {
      info
    };
  }
}));
