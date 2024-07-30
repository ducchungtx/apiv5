import path from "path";
import { config } from "process";
import middlewares from "../../../../config/middlewares";

export default {
  routes: [
    {
      method: 'GET',
      path: '/post-document/crawl-links',
      handler: 'api::post-document.post-document.crawl-links',
    }
  ]
}