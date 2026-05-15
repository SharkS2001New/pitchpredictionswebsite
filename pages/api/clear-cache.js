// pages/api/clear-cache.js
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Only allow POST or DELETE methods for security
  if (req.method !== 'POST' && req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Add authentication for security
  const authToken = req.headers.authorization;
  const secretKey = process.env.CACHE_CLEAR_KEY; // Set this in your env variables
  
  if (!authToken || authToken !== `Bearer ${secretKey}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const cacheDir = path.join(process.cwd(), 'public', 'cache');
  
  try {
    if (!fs.existsSync(cacheDir)) {
      return res.status(200).json({ message: 'Cache directory does not exist', cleared: false });
    }

    const files = fs.readdirSync(cacheDir);
    let clearedCount = 0;

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(cacheDir, file);
        fs.unlinkSync(filePath);
        clearedCount++;
      }
    }

    return res.status(200).json({
      message: `Cleared ${clearedCount} cache file(s)`,
      cleared: true,
      count: clearedCount
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    return res.status(500).json({ error: error.message });
  }
}