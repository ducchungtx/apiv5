export default {
  /**
   * Simple example.
   * Every monday at 1am.
   */

  // every 1 minute
  '*/1 * * * *': async ({ strapi }) => {
    strapi.log.info('Start crawl brand link');
    const item = await strapi.db.query('api::crawl-brand-link.crawl-brand-link').findOne({
      where: { isCrawl: false },
    });
    if (item) {
      const { link } = item;
      const url = `https://www.cleancss.com/user-manuals/${link}`;
      const links = await strapi.service('api::crawl-manual-link.crawl-manual-link').getManualLinks(url);
      // save to database
    } else {
      strapi.log.info(`No link to crawl`);
    }
  },
};