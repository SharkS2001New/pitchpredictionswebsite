// pages/api/popular-tips.js
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

  // Use ISO dates (YYYY-MM-DD) instead of locale strings
  const today = new Date();
  const startDate = today.toISOString().split('T')[0]; // YYYY-MM-DD
  
  const endDateObj = new Date(today);
  endDateObj.setDate(today.getDate() + 2);
  const endDate = endDateObj.toISOString().split('T')[0]; // YYYY-MM-DD
  
  const cacheDir = path.join(process.cwd(), 'public', 'cache');
  
  // Filename will now be: popular-tips-2026-03-06-to-2026-03-08.json
  const cacheFilename = `popular-tips-${startDate}-to-${endDate}.json`;
  const cachePath = path.join(cacheDir, cacheFilename);

  try {
    // Create cache directory if it doesn't exist
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true, mode: 0o755 });
    }

    // Check if we have a valid cache file (3 hours = 10800000 ms)
    if (fs.existsSync(cachePath)) {
      const cacheContent = fs.readFileSync(cachePath, 'utf8');
      const cache = JSON.parse(cacheContent);
      
      const cacheTime = new Date(cache.generatedAt).getTime();
      const now = new Date().getTime();
      const ageInHours = (now - cacheTime) / (1000 * 60 * 60);
      
      if (ageInHours <= 3 && hasCacheableData(cache.data)) {
        // Return cached data
        return res.status(200).json({
          fromCache: true,
          generatedAt: cache.generatedAt,
          data: cache.data
        });
      } else {
        // Cache expired or empty - delete it
        removeCacheFileAtPath(cachePath);
      }
    }

    // No valid cache, fetch from external API
    const apiUrl = `https://api.pitchpredictions.com/api/fetch_free_upcoming_matches?start_date=${startDate}&end_date=${endDate}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        Origin: "https://www.pitchpredictions.com", Authorization: `Bearer ${process.env.ACCESS_TOKEN || "UJlhuDILIR1Lc2IEwZDIKOln9d"}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch matches');
    }

    const data = await response.json();

    // Prepare cache data
    const cacheData = {
      generatedAt: new Date().toISOString(),
      startDate,
      endDate,
      data: data.data || [],
      count: data.data?.length || 0
    };

    writeCacheFileAtPath(cachePath, cacheData);

    // Clean up old cache files (older than 3 hours)
    cleanupOldCacheFiles(cacheDir);

    // Return fresh data
    return res.status(200).json({
      fromCache: false,
      generatedAt: cacheData.generatedAt,
      data: cacheData.data
    });

  } catch (error) {
    console.error('Error in popular tips API:', error);
    return res.status(500).json({ error: error.message });
  }
}

// Helper function to clean up old cache files
function cleanupOldCacheFiles(cacheDir) {
  try {
    if (!fs.existsSync(cacheDir)) return;
    
    const files = fs.readdirSync(cacheDir);
    const now = new Date().getTime();
    const maxAge = 3 * 60 * 60 * 1000; // 3 hours
    
    for (const file of files) {
      if (file.startsWith('popular-tips-') && file.endsWith('.json')) {
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