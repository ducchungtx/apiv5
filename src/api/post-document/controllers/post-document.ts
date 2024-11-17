/**
 * post-document controller
 */

import { factories } from '@strapi/strapi'
import { remoteFileUpload } from '../../../utils/utils';

export default factories.createCoreController('api::post-document.post-document', ({ strapi }) => ({
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
    const info = await strapi.service('api::crawl-manual-link.crawl-manual-link').getManualDetail(url);
    if (info) {
      const pdfurl = info.pdfurl;
      const saveManualLink = await strapi.db.query('api::crawl-manual-link.crawl-manual-link').findOne({ where: { isCrawl: false }, populate: ['crawl_brand_link'] });
      if (saveManualLink) {
        const { name, type, crawl_brand_link } = saveManualLink;
        const { brandDocumentId } = crawl_brand_link;
        // find brand by documentId
        const brand = await strapi.documents('api::brand.brand').findOne({ documentId: brandDocumentId });
        if (brand) {
          const { documentId } = brand; // brand documentId to update the post document

          // download pdf
          const uploadResponse = await remoteFileUpload(pdfurl, `${name}.pdf`);
          const postDocument = await strapi.documents('api::post-document.post-document').create({
            data: {
              name,
              type,
              brand: documentId,
              files: [uploadResponse[0].id],
              createdAt: new Date(),
              createdBy: 1,
              updatedAt: new Date(),
              updatedBy: 1,
            },
          });
          if (postDocument) {
            // update crawl manual link
            await strapi.documents('api::crawl-manual-link.crawl-manual-link').update({
              documentId: saveManualLink.documentId,
              data: {
                isCrawl: true,
                postDocument: postDocument.documentId,
                updatedAt: new Date(),
                updatedBy: 1,
              }
            });
          }
        }
      }
    }

    return {
      info: "123"
    };
  }
}));
