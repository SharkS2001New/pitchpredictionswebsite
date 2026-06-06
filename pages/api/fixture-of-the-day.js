// pages/api/fixture-of-the-day.js
import fs from 'fs';
import path from 'path';
import {
  hasCacheableData,
  removeCacheFileAtPath,
  writeCacheFileAtPath,
} from '../../components/functions/file_cache';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { date, refresh } = req.query;
  
  if (!date) {
    return res.status(400).json({ error: 'Date parameter is required' });
  }

  const headers = { "Authorization": "R9TxV3PbOEu7qZnJKgydC5LmX2" };
  const cacheDir = path.join(process.cwd(), 'public', 'cache');
  const cacheFilename = `fixture-of-the-day-${date}.json`;
  const cachePath = path.join(cacheDir, cacheFilename);

  try {
    // Create cache directory if it doesn't exist
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    // Check if we have a valid cache file (unless refresh is requested)
    if (!refresh && fs.existsSync(cachePath)) {
      const cacheContent = fs.readFileSync(cachePath, 'utf8');
      const cache = JSON.parse(cacheContent);
      
      const cacheTime = new Date(cache.generatedAt).getTime();
      const now = new Date().getTime();
      const ageInHours = (now - cacheTime) / (1000 * 60 * 60);
      
      if (ageInHours <= 1 && hasCacheableData(cache.data)) { // 1 hour cache
        return res.status(200).json({
          fromCache: true,
          generatedAt: cache.generatedAt,
          data: cache.data,
          isPrimary: cache.isPrimary,
          status: cache.status
        });
      }

      if (!hasCacheableData(cache.data)) {
        removeCacheFileAtPath(cachePath);
      }
    }

    // No valid cache or refresh requested, fetch from external APIs
    let responseData = null;
    let isPrimary = false;
    let status = "success";

    // Try primary URL first
    const primaryResponse = await fetch(`https://api.pitchpredictions.com/api/match_of_the_day?fixture_date=${date}`, {
      headers: headers
    });

    const primaryData = await primaryResponse.json();

    if (primaryData.status === true && primaryData.data && primaryData.data.length > 0) {
      responseData = primaryData.data[0];
      isPrimary = true;
      status = primaryData.message || "success";
    } else {
      // Try alternative URL
      const alternativeResponse = await fetch(`https://api.pitchpredictions.com/api/auto_featured_match_of_the_day?fixture_date=${date}`, {
        headers: headers
      });

      const alternativeData = await alternativeResponse.json();

      if (alternativeData.status === true && alternativeData.data && alternativeData.data.length > 0) {
        responseData = alternativeData.data[0];
        isPrimary = false;
        status = alternativeData.message || "success";
      } else { 
        status = "No game available";
      }
    }

    const generatedAt = new Date().toISOString();

    if (hasCacheableData(responseData)) {
      const cacheData = {
        generatedAt,
        date: date,
        data: responseData,
        isPrimary: isPrimary,
        status: status
      };

      writeCacheFileAtPath(cachePath, cacheData);
      cleanupOldCacheFiles(cacheDir);
    } else {
      removeCacheFileAtPath(cachePath);
    }

    // Return fresh data
    return res.status(200).json({
      fromCache: false,
      generatedAt,
      data: responseData,
      isPrimary: isPrimary,
      status: status
    });

  } catch (error) {
    console.error('Error in fixture-of-the-day API:', error);
    return res.status(500).json({ error: error.message });
  }
}

// Helper function to clean up old cache files
function cleanupOldCacheFiles(cacheDir) {
  try {
    if (!fs.existsSync(cacheDir)) return;
    
    const files = fs.readdirSync(cacheDir);
    const now = new Date().getTime();
    const maxAge = 30 * 60 * 1000; // 30 minutes

    for (const file of files) {
      if (file.startsWith('fixture-of-the-day-') && file.endsWith('.json')) {
        const filePath = path.join(cacheDir, file);
        const stats = fs.statSync(filePath);
        const fileAge = now - stats.mtimeMs;
        
        if (fileAge > maxAge) {
          fs.unlinkSync(filePath);
        }
      }
    }
  } catch (error) {
    console.error('Error cleaning up cache:', error);
  }
}
