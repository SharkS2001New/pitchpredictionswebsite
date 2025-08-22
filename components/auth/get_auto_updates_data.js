const { default: api } = require("./api");

async function getAutoUpdatesData(paymentPlan) {
    try {
      const response = await api.get('/get_auto_update_data', {
        params: {
          plan: paymentPlan, 
        },
      });
  
      return response.data;
    } catch (error) {
      // Capture errors and handle them
      const serverErrors = error.response?.data || error.message;
      console.error('Error fetching data:', serverErrors);
  
      // Optionally, throw an error to handle upstream
      throw new Error(`Failed to fetch data: ${serverErrors}`);
    }
}

export default getAutoUpdatesData;