export default {
  routes: [
    {
      method: 'GET',
      path: '/post-document/crawl-brand-links',
      handler: 'api::post-document.post-document.crawl-brand-links',
    },
    {
      method: 'GET',
      path: '/post-document/crawl-manual-links',
      handler: 'api::post-document.post-document.crawl-manual-links',
    },
    {
      method: 'GET',
      path: '/post-document/crawl-manual-detail',
      handler: 'api::post-document.post-document.crawl-manual-detail',
    }
  ]
}