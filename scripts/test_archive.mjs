import https from 'https';
import http from 'http';
import fs, { createWriteStream } from 'fs';
import { URL } from 'url';

function downloadFromArchive(archiveUrl, destPath, retries = 3) {
  return new Promise((resolve, reject) => {
    let urlObj;
    try {
      urlObj = new URL(archiveUrl);
    } catch (e) {
      reject(e);
      return;
    }
    
    const isArchive = urlObj.hostname === 'web.archive.org' || urlObj.hostname === 'archive.org';
    const hostname = isArchive ? '207.241.237.3' : urlObj.hostname;
    const path = urlObj.pathname + urlObj.search;
    
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    };
    if (isArchive) {
      headers['Host'] = 'web.archive.org';
    }
    
    const options = {
      hostname: hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: path,
      method: 'GET',
      headers: headers,
      rejectUnauthorized: false
    };
    
    if (isArchive) {
      options.servername = 'web.archive.org';
    }
    
    const protocol = urlObj.protocol === 'https:' ? https : http;
    const file = createWriteStream(destPath);
    
    const req = protocol.request(options, (res) => {
      console.log(`URL: ${archiveUrl} -> Status: ${res.statusCode}`);
      
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
        file.close();
        try { fs.unlinkSync(destPath); } catch {}
        
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          redirectUrl = new URL(redirectUrl, archiveUrl).toString();
        }
        
        console.log(`Following redirect to: ${redirectUrl}`);
        downloadFromArchive(redirectUrl, destPath, retries - 1)
          .then(resolve)
          .catch(reject);
        return;
      }
      
      if (res.statusCode !== 200) {
        file.close();
        try { fs.unlinkSync(destPath); } catch {}
        reject(new Error(`Status ${res.statusCode} for ${archiveUrl}`));
        return;
      }
      
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(destPath);
      });
    });
    
    req.on('error', (err) => {
      file.close();
      try { fs.unlinkSync(destPath); } catch {}
      if (retries > 0) {
        setTimeout(() => {
          downloadFromArchive(archiveUrl, destPath, retries - 1).then(resolve).catch(reject);
        }, 1500);
      } else {
        reject(err);
      }
    });
    
    req.setTimeout(45000, () => {
      req.destroy();
      file.close();
      try { fs.unlinkSync(destPath); } catch {}
      if (retries > 0) {
        setTimeout(() => {
          downloadFromArchive(archiveUrl, destPath, retries - 1).then(resolve).catch(reject);
        }, 2000);
      } else {
        reject(new Error(`Timeout downloading ${archiveUrl}`));
      }
    });
    
    req.end();
  });
}

// We append if_ to get the raw file directly!
const testUrl = 'https://web.archive.org/web/2023if_/https://tlal-ksa.com/wp-content/uploads/2023/05/5cc14b61bc2990efa57c88d336138f4a.jpg';
const dest = './test_download.jpg';

downloadFromArchive(testUrl, dest)
  .then(() => {
    const stats = fs.statSync(dest);
    console.log(`🎉 Download successful! File size: ${stats.size} bytes`);
    // fs.unlinkSync(dest); // Leave it for verification
  })
  .catch((e) => {
    console.error(`❌ Download failed: ${e.message}`);
  });
