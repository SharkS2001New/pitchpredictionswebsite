const { default: api } = require("./api");

async function getPaymentsData(paymentCategory) {
    try {
      const response = await api.get('/get_payment_options_data', {
        params: {
          category: paymentCategory,   
        },
      });
  
      return response.data;
    } catch (error) {
      // Capture errors and handle them
      const serverErrors = error.response?.data || error.message;
      console.error('Error fetching payments:', serverErrors);
  
      // Optionally, throw an error to handle upstream
      throw new Error(`Failed to fetch payments: ${serverErrors}`);
    }
}

export default getPaymentsData;