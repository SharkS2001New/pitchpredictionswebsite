import axios from 'axios';

// Function to get the user IP
async function getUserIp() {
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      return response.data.ip;
    } catch (error) {
      console.error('Error fetching IP address:', error);
      return null;
    }
}

export default getUserIp;