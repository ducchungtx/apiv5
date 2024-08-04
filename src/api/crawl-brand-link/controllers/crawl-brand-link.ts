/**
 * crawl-brand-link controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::crawl-brand-link.crawl-brand-link', ({ strapi }) => ({
  // get-brand-links action
  async 'get-brand-links'(ctx) {
    const { url } = ctx.query;
    const links = await strapi.service('api::crawl-brand-link.crawl-brand-link').getBrandLinks(url);
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
      var saveItem = await strapi.db.query('api::crawl-brand-link.crawl-brand-link').create({
        data: {
          link: link.link,
          name: link.text,
          isCrawled: false,
          created_by_id: 1,
          updated_by_id: 1,
          published_at: new Date(),
        }
      });
      if (saveItem) {
        strapi.log.info(`Link ${link.link} added to database`);
      } else {
        strapi.log.error(`Link ${link.link} failed to add to database`);
      }
    });
    ctx.send(links);
  },
}));
