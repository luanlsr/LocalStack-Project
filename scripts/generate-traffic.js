const axios = require('axios');

const API_BASE = 'http://localhost:3000';

async function generateTraffic() {
  console.log('🚀 Gerando tráfego para popular métricas...');
  
  try {
    // Login para obter token
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      user: 'admin',
      password: '123'
    });
    
    const token = loginResponse.data.token;
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    console.log('✅ Login realizado com sucesso');
    
    // Gerar requisições para diferentes endpoints
    for (let i = 0; i < 10; i++) {
      try {
        // Health check
        await axios.get(`${API_BASE}/health`);
        console.log(`✅ Health check ${i + 1}`);
        
        // DynamoDB (se funcionar)
        try {
          await axios.post(`${API_BASE}/dynamodb/item`, {
            id: `test-${i}`,
            nome: `Item ${i}`,
            valor: i * 10
          }, { headers });
          console.log(`✅ DynamoDB ${i + 1}`);
        } catch (err) {
          console.log(`⚠️ DynamoDB ${i + 1} - ${err.response?.data?.error || err.message}`);
        }
        
        // SQS (se funcionar)
        try {
          await axios.post(`${API_BASE}/sqs/send`, {
            message: `Mensagem ${i}`
          }, { headers });
          console.log(`✅ SQS ${i + 1}`);
        } catch (err) {
          console.log(`⚠️ SQS ${i + 1} - ${err.response?.data?.error || err.message}`);
        }
        
        // S3 (se funcionar)
        try {
          await axios.post(`${API_BASE}/s3/upload`, {
            key: `arquivo-${i}.txt`,
            content: `Conteúdo do arquivo ${i}`
          }, { headers });
          console.log(`✅ S3 ${i + 1}`);
        } catch (err) {
          console.log(`⚠️ S3 ${i + 1} - ${err.response?.data?.error || err.message}`);
        }
        
        // Aguardar um pouco entre as requisições
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (err) {
        console.log(`❌ Erro na requisição ${i + 1}:`, err.message);
      }
    }
    
    console.log('🎉 Tráfego gerado com sucesso!');
    console.log('📊 Acesse o Grafana em: http://localhost:3001');
    console.log('📈 Métricas disponíveis em: http://localhost:3000/metrics');
    
  } catch (err) {
    console.error('❌ Erro ao gerar tráfego:', err.message);
  }
}

generateTraffic(); 
