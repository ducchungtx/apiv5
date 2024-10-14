export default {
  /**
   * Simple example.
   * Every monday at 1am.
   */

  // every 1 minute
  '*/10 * * * *': async ({ strapi }) => {
    strapi.log.info('Start crawl brand link');
    const item = await strapi.db.query('api::crawl-brand-link.crawl-brand-link').findOne({
      where: { isCrawl: false },
    });
    if (item) {
      const { link } = item;
      const links = await strapi.service('api::crawl-brand-link.crawl-brand-link').getBrandLinks(link);
      console.log("links", links);
    } else {
      strapi.log.info(`No link to crawl`);
    }
  },
};