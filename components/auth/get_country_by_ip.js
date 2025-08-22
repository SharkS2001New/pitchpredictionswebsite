import axios from 'axios';

// Function to get country code by IP
async function getCountryByIp(ip) {
    try {
      const response = await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=5527afd344ab4bd894a4fd0b695a410d&ip=${ip}`);
      return response.data.country_code2; // Returns the country code
    } catch (error) {
      console.error('Error fetching country data:', error);
      return null;
    }
}

export default getCountryByIp;
