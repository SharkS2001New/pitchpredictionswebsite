import axios from "axios";

async function getExchangeRate(fromCurrency, toCurrency) {
    try {
        const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        
        if (response.data && response.data.rates[toCurrency]) {
            return response.data.rates[toCurrency];
        }

        throw new Error("Exchange rate not available.");
    } catch (error) {
        throw new Error("Failed to retrieve exchange rate.");
    }
}