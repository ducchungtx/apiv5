/**
 * crawl-brand-link service
 */
import axios from 'axios';
import * as cheerio from 'cheerio';
import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::crawl-brand-link.crawl-brand-link', ({ strapi }) => ({
  async getBrandLinks(url: string) {
    try {
      const { data } = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
          'Cookie': '_gid=GA1.2.867027341.1722347230; _ga=GA1.2.437145486.1722347230; _ga_HDSF42X0DM=GS1.1.1722347229.1.1.1722347263.0.0.0',
        }
      });
      const links = [];
      const $ = cheerio.load(data);
      $('div.brand a').each((index, element) => {
        const link = $(element).attr('href');
        const text = $(element).text().trim();
        links.push({ link, text });
      });
      console.log("links-service", links);
      return links;
    } catch (error) {
      console.error('Error fetching URL:', error.message);
      throw new Error('Failed to fetch the URL');
    }
  },

  async saveBrandLink() {
    const item = await strapi.db.query('api::crawl-brand-link.crawl-brand-link').findOne({
      where: { isCrawl: false },
    });
    if (item) {
      const { name, documentId } = item;
      // save to database
      const brand = await strapi.documents('api::brand.brand').create({
        data: {
          name,
        }
      });
      if(brand) {
        // update to published
        await strapi.documents('api::brand.brand').publish({
          documentId: brand.documentId,
        });
        strapi.log.info(`Brand ${name} added to database`);

        // update the crawl-brand-link
        await strapi.db.query('api::crawl-brand-link.crawl-brand-link').update({
          where: { documentId },
          data: {
            isCrawl: true,
            brandDocumentId: brand.documentId,
          },
        });

        // publish the crawl-brand-link
        await strapi.documents('api::crawl-brand-link.crawl-brand-link').publish({
          documentId,
        });
      }
    } else {
      strapi.log.info(`No brand data to save`);
    }
  }
}));
