/**
 * post-document controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::post-document.post-document', ({ strapi }) => ({
  async crawlLinks(ctx) {
    const { url } = ctx.query;
    const { postDocument } = strapi.services;
    const links = await postDocument.crawlLinks(url);
    ctx.send(links);
  }
}));
