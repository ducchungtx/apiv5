export default {
  routes: [
    {
      method: 'GET',
      path: '/crawl-manual-link/get-manual-links',
      handler: 'api::crawl-manual-link.crawl-manual-link.crawl-manual-links',
    },
    {
      method: 'GET',
      path: '/crawl-manual-link/get-manual-detail',
      handler: 'api::crawl-manual-link.crawl-manual-link.crawl-manual-detail',
    }
  ]
}
