/**
 * post-document service
 */
import axios from 'axios';
import * as cheerio from 'cheerio';
import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::post-document.post-document');