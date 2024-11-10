export default {
  /**
   * Simple example.
   * Every monday at 1am.
   */

  // every 1 minute
  // '*/1 * * * *': async ({ strapi }) => {
  //   strapi.log.info('Start crawl brand link');
  //   const item = await strapi.db.query('api::crawl-brand-link.crawl-brand-link').findOne({
  //     where: { isCrawToLink: false },
  //   });
  //   if (item) {
  //     const { link, documentId, id } = item;
  //     console.log("item", item);
  //     const url = `https://www.cleancss.com/user-manuals/${link}`;
  //     const links = await strapi.service('api::crawl-manual-link.crawl-manual-link').getManualLinks(url);
  //     strapi.log.info(`Found ${links.length} links`);
  //     // save to database
  //     await strapi.service('api::crawl-manual-link.crawl-manual-link').saveManualLink(links, id, documentId);
  //   } else {
  //     strapi.log.info(`No link to crawl`);
  //   }
  // },

  // every 1 minute
  '*/1 * * * *': async ({ strapi }) => {
   // saveBrandLink
    strapi.log.info('Start save brand link');
    await strapi.service('api::crawl-brand-link.crawl-brand-link').saveBrandLink();
  },
};