/**
 * crawl-brand-link controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::crawl-brand-link.crawl-brand-link', ({ strapi }) => ({
  // get-brand-links action
  async 'get-brand-links'(ctx) {
    const { url } = ctx.query;
    const links = await strapi.services['crawl-brand-link'].crawlBrandLinks(url);
    if (links.length === 0) {
      ctx.status = 404;
      ctx.send('No links found');
      return;
    }
    links.forEach(async (link) => {
      // check link exists in database
      const item = await strapi.db.query('api::crawl-brand-link.crawl-brand-link').findOne({
        where: { link: link.link },
      });
      if (item) {
        return;
      }
      // create new link
      await strapi.db.query('api::crawl-brand-link.crawl-brand-link').create({
        data: {

        }
      });
    });
    ctx.send(links);
  },
}));
