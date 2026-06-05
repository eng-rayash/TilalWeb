import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://tlal-ksa.com';

function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/&#8211;/g, '-')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8217;/g, "'")
    .replace(/&#8230;/g, '...')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchFromWP(endpoint) {
  const url = `${BASE_URL}/wp-json/wp/v2/${endpoint}`;
  console.log(`Fetching from WP API: ${url}`);
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      }
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch ${endpoint} - Status: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`Error fetching ${endpoint}:`, err.message);
    return [];
  }
}

async function scrapeAll() {
  console.log('--- STARTING LIGHTNING FAST WP API IMPORT ---');
  
  // Fetch posts and pages in parallel
  const [posts, pages] = await Promise.all([
    fetchFromWP('posts?per_page=100'),
    fetchFromWP('pages?per_page=100')
  ]);
  
  console.log(`Fetched ${posts.length} posts and ${pages.length} pages.`);
  
  const allItems = [...posts, ...pages];
  const results = [];
  
  for (const item of allItems) {
    const title = cleanText(item.title?.rendered || '');
    const slug = item.slug || '';
    const date = item.date || '2026-06-02';
    const link = item.link || `${BASE_URL}/${slug}`;
    const htmlContent = item.content?.rendered || '';
    
    // Parse HTML with cheerio
    const $ = cheerio.load(htmlContent);
    
    // Extract structured contents: headings, paragraphs, list items in order
    const content = [];
    $('h1, h2, h3, h4, h5, h6, p, li').each((_, el) => {
      const type = el.name;
      const text = cleanText($(el).text());
      const lowerText = text.toLowerCase();
      
      // Exclude footer widgets/wordpress boilerplate
      if (
        text.length < 5 ||
        lowerText.includes('تبديل القائمة') ||
        lowerText.includes('جميع الحقوق محفوظة') ||
        lowerText.includes('موقع ووردبريس') ||
        lowerText.includes('تخفيضات و عروض') ||
        lowerText.includes('جميع أنواع الهناجر') ||
        lowerText.includes('ساعات العمل') ||
        lowerText.includes('أرقام التواصل')
      ) {
        return;
      }
      
      content.push({ type, text });
    });
    
    // Extract images
    const images = [];
    $('img').each((_, el) => {
      const src = $(el).attr('src');
      const alt = $(el).attr('alt') || '';
      
      if (
        src && 
        !src.startsWith('data:') && 
        !src.includes('logo') && 
        !src.includes('favicon') && 
        !src.includes('loader') && 
        !src.includes('avatar')
      ) {
        let fullSrc = src;
        if (src.startsWith('/')) {
          fullSrc = BASE_URL + src;
        }
        images.push({ src: fullSrc, alt: cleanText(alt) || title });
      }
    });
    
    // Exclude system pages / duplicate pages
    if (content.length === 0 && images.length === 0) {
      continue;
    }
    
    // Try to get a clean description
    let description = cleanText(item.excerpt?.rendered || '');
    if (!description && content.length > 0) {
      const firstP = content.find(c => c.type === 'p');
      description = firstP ? firstP.text.slice(0, 160) : '';
    }
    
    results.push({
      url: link,
      title,
      description,
      keywords: '',
      images,
      content,
      rawUrl: link
    });
  }
  
  // Structure data for storage
  const structuredData = {
    settings: {
      siteName: 'مؤسسة تلال للمقاولات العامة',
      slogan: 'مقاولات عامة الدمام والشرقية | هناجر – مستودعات – مظلات – سواتر – ترميم احترافي',
      description: 'مؤسسة مقاولات عامة بالدمام والشرقية متخصصة في بناء هناجر ومستودعات، وتركيب مظلات وسواتر، وأعمال الترميم الشامل بأفضل جودة وأسعار تنافسية.',
      phone: '0506819387',
      whatsapp: '966506819387',
      email: 'info@tlal-ksa.com',
      address: 'الدمام - المنطقة الشرقية، المملكة العربية السعودية',
      workingHours: 'طوال أيام الأسبوع من 8:00 صباحًا إلى 8:00 مساءً'
    },
    services: [],
    projects: [],
    articles: [],
    pages: [],
    rawPages: results
  };
  
  // Categorize pages and structure them
  for (const page of results) {
    const slug = page.url.replace(BASE_URL, '').replace(/^\/|\/$/g, '');
    page.slug = slug || 'home';
    
    const isHome = page.slug === 'home' || page.slug === '';
    if (isHome) {
      continue;
    }
    
    const titleLower = page.title.toLowerCase();
    
    const isService = page.slug.includes('service') || 
                     page.slug.includes('خدمات') || 
                     titleLower.includes('مظلات') || 
                     titleLower.includes('هناجر') || 
                     titleLower.includes('ترميم') || 
                     titleLower.includes('سواتر') || 
                     titleLower.includes('كلادنج') || 
                     titleLower.includes('برجول') || 
                     titleLower.includes('قرميد') || 
                     titleLower.includes('شبوك') ||
                     titleLower.includes('شعر') ||
                     titleLower.includes('مستودعات');
                     
    if (isService) {
      structuredData.services.push({
        slug: page.slug,
        title: page.title,
        description: page.description,
        content: page.content,
        images: page.images,
        rawUrl: page.url
      });
    } else {
      structuredData.articles.push({
        slug: page.slug,
        title: page.title,
        description: page.description,
        content: page.content,
        images: page.images,
        rawUrl: page.url
      });
    }
  }
  
  const dataDir = path.join(process.cwd(), 'lib', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(dataDir, 'website_data.json'),
    JSON.stringify(structuredData, null, 2),
    'utf-8'
  );
  
  console.log(`\n\n--- IMPORT COMPLETE. Saved ${results.length} pages to lib/data/website_data.json ---`);
}

scrapeAll();
