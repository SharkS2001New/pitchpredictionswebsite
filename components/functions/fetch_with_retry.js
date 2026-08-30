function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJsonWithRetry(url, options = {}) {
  const {
    method = "GET",
    headers = {},
    retries = 2,
    timeoutMs = 7000,
    retryDelayMs = 700,
    backoffFactor = 2,
  } = options;

  let lastError = null;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          ...(typeof url === "string" && url.includes("api.pitchpredictions.com")
            ? {
                Origin: "https://www.pitchpredictions.com",
                Authorization: `Bearer ${process.env.ACCESS_TOKEN || "UJlhuDILIR1Lc2IEwZDIKOln9d"}`,
              }
            : {}),
          ...headers,
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        const delayMs = retryDelayMs * Math.pow(backoffFactor, attempt);
        await sleep(delayMs);
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  throw lastError;
}

export default fetchJsonWithRetry;
