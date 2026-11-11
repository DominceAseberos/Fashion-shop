import puppeteer from 'puppeteer-core';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function capture() {
  console.log('Launching browser with Chrome at:', chromePath);
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Capture Strapi Admin
  console.log('Navigating to Strapi Admin (http://localhost:1337/admin)...');
  try {
    await page.goto('http://localhost:1337/admin', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    const adminPath = path.resolve(__dirname, '../../docs/screenshots/strapi-admin.png');
    await page.screenshot({ path: adminPath, fullPage: false });
    console.log('Strapi admin screenshot saved to:', adminPath);
  } catch (err) {
    console.error('Error capturing Strapi admin:', err.message);
  }

  // 2. Capture Storefront
  console.log('Navigating to Storefront (http://localhost:5173)...');
  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    const storefrontPath = path.resolve(__dirname, '../../docs/screenshots/storefront.png');
    await page.screenshot({ path: storefrontPath, fullPage: false });
    console.log('Storefront screenshot saved to:', storefrontPath);
  } catch (err) {
    console.error('Error capturing storefront:', err.message);
  }

  await browser.close();
  console.log('Done!');
}

capture().catch(console.error);
