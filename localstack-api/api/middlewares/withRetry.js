const withRetry = (operation, maxRetries = 3) => {
  return async (...args) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation(...args).promise();
      } catch (error) {
        if (attempt === maxRetries) throw error;
        console.log(`Tentativa ${attempt} falhou, tentando novamente em 1s...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };
};

module.exports = withRetry; 
