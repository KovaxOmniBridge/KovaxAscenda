const { Pool } = require('pg');

// Configuração do pool de conexões PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'ascenda_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20, // Máximo de conexões no pool
  idleTimeoutMillis: 30000, // Tempo para fechar conexões ociosas
  connectionTimeoutMillis: 2000, // Tempo máximo para conectar
});

// Event listeners para monitoramento
pool.on('connect', () => {
  console.log('✓ Nova conexão estabelecida com PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Erro inesperado no pool de conexões:', err);
  process.exit(-1);
});

// Função helper para executar queries
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Query executada:', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Erro ao executar query:', { text, error: error.message });
    throw error;
  }
};

// Função helper para transações
const getClient = async () => {
  const client = await pool.connect();
  const query = client.query.bind(client);
  const release = client.release.bind(client);
  
  // Wrapper para garantir release
  const releaseWrapper = () => {
    client.release();
    console.log('Cliente do pool liberado');
  };
  
  client.query = (...args) => {
    console.log('Query em transação:', args[0]);
    return query(...args);
  };
  
  client.release = releaseWrapper;
  
  return client;
};

// Verificar conexão com o banco
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✓ Conexão com PostgreSQL bem-sucedida:', result.rows[0].now);
    client.release();
    return true;
  } catch (error) {
    console.error('✗ Erro ao conectar ao PostgreSQL:', error.message);
    return false;
  }
};

// Fechar todas as conexões
const closePool = async () => {
  try {
    await pool.end();
    console.log('✓ Pool de conexões fechado');
  } catch (error) {
    console.error('✗ Erro ao fechar pool:', error.message);
  }
};

module.exports = {
  pool,
  query,
  getClient,
  testConnection,
  closePool
};
