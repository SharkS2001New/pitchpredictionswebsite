// pages/api/popular-tips.js (this is a separate file!)
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const startDate = new Date().toLocaleDateString("en-CA");
  const endDate = new Date(new Date().setDate(new Date().getDate() + 2)).toLocaleDateString("en-CA");
  
  const cacheDir = path.join(process.cwd(), 'public', 'cache');
  const cacheFilename = `popular-tips-${startDate}-to-${endDate}.json`;
  const cachePath = path.join(cacheDir, cacheFilename);

  try {
    // Create cache directory if it doesn't exist
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    // Check if we have a valid cache file (3 hours = 10800000 ms)
    if (fs.existsSync(cachePath)) {
      const cacheContent = fs.readFileSync(cachePath, 'utf8');
      const cache = JSON.parse(cacheContent);
      
      const cacheTime = new Date(cache.generatedAt).getTime();
      const now = new Date().getTime();
      const ageInHours = (now - cacheTime) / (1000 * 60 * 60);
      
      if (ageInHours <= 3) {
        // Return cached data
        return res.status(200).json({
          fromCache: true,
          generatedAt: cache.generatedAt,
          data: cache.data
        });
      }
    }

    // No valid cache, fetch from external API
    const apiUrl = `https://api.pitchpredictions.com/api/fetch_free_upcoming_matches?start_date=${startDate}&end_date=${endDate}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: "R9TxV3PbOEu7qZnJKgydC5LmX2",
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

    // Save to cache (atomic write for K3s)
    const tempPath = `${cachePath}.tmp.${Date.now()}`;
    fs.writeFileSync(tempPath, JSON.stringify(cacheData, null, 2));
    fs.renameSync(tempPath, cachePath);

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