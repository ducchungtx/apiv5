/**
 * crawl-manual-link service
 */

import { factories } from '@strapi/strapi';
import axios from 'axios';
import * as cheerio from 'cheerio';

export default factories.createCoreService('api::crawl-manual-link.crawl-manual-link', ({ strapi }) => ({
  async getManualLinks(url: string) {
    try {
      const { data } = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
          'Cookie': '_gid=GA1.2.867027341.1722347230; _ga=GA1.2.437145486.1722347230; _ga_HDSF42X0DM=GS1.1.1722347229.1.1.1722347263.0.0.0',
        }
      });
      const links = [];
      const $ = cheerio.load(data);
      $('table.ui.celled.striped.padded.table.tablet.stackable.filter-results tbody tr').each((index, element) => {
        const link = $(element).find('td a').attr('href');
        const text = $(element).find('td a').text().trim();
        const description = $(element).find('td:nth-child(2)').text().trim();
        const manufacturer = $(element).find('td:nth-child(3)').text().trim();
        links.push({ link, text, description, manufacturer });
      });
      return links;
    } catch (error) {
      console.error('Error fetching URL:', error.message);
      throw new Error('Failed to fetch the URL');
    }
  },
  async getManualDetail(url: string) {
    try {
      const { data } = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
          'Cookie': '_gid=GA1.2.867027341.1722347230; _ga=GA1.2.437145486.1722347230; _ga_HDSF42X0DM=GS1.1.1722347229.1.1.1722347263.0.0.0',
        }
      });
      let info: any = {};
      const $ = cheerio.load(data);
      info.title = $('h1').text().trim();
      // tìm thẻ script có chứa pdfurl
      $('script').each((index, element) => {
        const script = $(element).html();
        if (script.includes('pdfurl')) {
          // trích xuất ra link url pdf từ nội dung script
          // var pdfurl = "https://s3.amazonaws.com/devicemanuals/28984651d40d90780b4bdad2e07b036c4d151f06.pdf";
          const pdfurl = script.match(/var pdfurl = "(.*?)";/)[1];
          info.pdfurl = pdfurl;
        }
      });
      return info;
    } catch (error) {
      console.error('Error fetching URL:', error.message);
      throw new Error('Failed to fetch the URL');
    }
  },
  async saveManualLink(links: any[], id: string, documentId: string) {
    try {
      strapi.log.info('Start save links to database');
      const promises = links.map(async (link: any) => {
        strapi.log.info(`Processing link: ${link.link}`);
        const manual = await strapi.query('api::crawl-manual-link.crawl-manual-link').findOne({ where: { link: link.link } });
        if (!manual) {
          const createdLink = await strapi.documents('api::crawl-manual-link.crawl-manual-link').create({
            data: {
              name: link.text,
              link: link.link,
              type: link.description,
              isCrawl: false,
              createdAt: new Date(),
              createdBy: 1,
              updatedAt: new Date(),
              updatedBy: 1,
              crawl_brand_link: id,
            },
          });
          if (createdLink) {
            await strapi.documents('api::crawl-manual-link.crawl-manual-link').publish({
              documentId: createdLink.documentId,
            });
            strapi.log.info(`Link ${createdLink.link} added to database`);
          } else {
            strapi.log.error(`Link ${link.link} failed to add to database`);
          }
        } else {
          strapi.log.info(`Link already exists in database: ${link.link}`);
        }
      });
      await Promise.all(promises);
      strapi.log.info('All links processed, updating crawl-brand-link status');
      // Gán documentId vào crawl-brand-link
      await strapi.query('api::crawl-brand-link.crawl-brand-link').update({
        where: { id },
        data: {
          isCrawToLink: true,
        },
      });
      await strapi.documents('api::crawl-brand-link.crawl-brand-link').publish({
        documentId: documentId,
      });
      strapi.log.info(`Updated crawl-brand-link with id ${id} to isCrawToLink: true`);
      return {
        message: 'Save manual links successfully'
      };
    } catch (error) {
      strapi.log.error(`Error save manual links: ${error.message}`);
      throw new Error('Failed to save manual links');
    }
  }
}));