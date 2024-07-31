/**
 * post-document service
 */
import axios from 'axios';
import * as cheerio from 'cheerio';
import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::post-document.post-document', ({ strapi }) => ({
  async crawlBrandLinks(url) {

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
      return links;
    } catch (error) {
      console.error('Error fetching URL:', error.message);
      throw new Error('Failed to fetch the URL');
    }
  },
  async crawlManualLinks(url) {
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
  async crawlManualDetail(url) {
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
  }

}));