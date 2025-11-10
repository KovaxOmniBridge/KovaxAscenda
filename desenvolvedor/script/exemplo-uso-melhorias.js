/**
 * =====================================================
 * DEMONSTRAÇÃO DAS MELHORIAS - SISTEMA DE CARREGAMENTO
 * =====================================================
 * 
 * Este arquivo demonstra como usar as novas funcionalidades
 * de carregamento otimizado de empresas.
 */

// ============================================
// 1. SISTEMA DE CACHE
// ============================================

/**
 * O cache é gerenciado automaticamente, mas você pode:
 */

// Verificar se há dados em cache válidos
const hasCachedOrgs = cacheManager.isValid('organizations');
console.log('Cache válido?', hasCachedOrgs);

// Obter dados do cache
const cachedData = cacheManager.get('organizations');
if (cachedData) {
  console.log('Usando dados em cache:', cachedData.length, 'empresas');
}

// Invalidar cache manualmente (força atualização)
cacheManager.invalidate('organizations');
console.log('Cache invalidado - próxima carga será da API');

// ============================================
// 2. CARREGAMENTO COM RETRY AUTOMÁTICO
// ============================================

/**
 * Todas as requisições usam retry automático:
 * - 1ª tentativa: imediata
 * - 2ª tentativa: aguarda 1 segundo
 * - 3ª tentativa: aguarda 2 segundos
 * - 4ª tentativa: aguarda 4 segundos
 * 
 * Total: até 7 segundos de tentativas antes de falhar
 */

async function exemploFetchComRetry() {
  try {
    const response = await fetchWithRetry(
      'https://api.exemplo.com/data',
      { headers: { 'Authorization': 'Bearer token' } },
      3 // máximo de 3 tentativas
    );
    
    if (response.ok) {
      const data = await response.json();
      console.log('Dados recebidos:', data);
    }
  } catch (error) {
    console.error('Falhou após 3 tentativas:', error);
  }
}

// ============================================
// 3. CARREGAMENTO INCREMENTAL
// ============================================

/**
 * Empresas são carregadas e processadas em lotes:
 * - Primeiro: lista de empresas básica (rápido)
 * - Depois: detalhes em lotes de 3 empresas
 * - Interface atualiza progressivamente
 */

async function exemploCarregamentoIncremental(items) {
  const batchSize = 3;
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    
    // Processar lote atual
    await Promise.all(batch.map(async item => {
      // Processar item
      console.log('Processando:', item.name);
    }));
    
    // Atualizar interface após cada lote
    console.log(`Processados ${Math.min(i + batchSize, items.length)} de ${items.length}`);
    
    // Pequeno delay entre lotes
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
}

// ============================================
// 4. CONTROLE DE ESTADO DE CARREGAMENTO
// ============================================

/**
 * Estado de carregamento é gerenciado globalmente
 */

// Verificar se está carregando
if (loadingState.isLoading) {
  console.log('Carregamento em progresso...');
}

// Verificar quais organizações já foram carregadas
console.log('Organizações carregadas:', loadingState.loadedOrgs.size);

// Verificar se uma organização específica foi carregada
const orgId = 'abc-123';
if (loadingState.loadedOrgs.has(orgId)) {
  console.log('Organização', orgId, 'já foi carregada');
}

// ============================================
// 5. FUNÇÕES PÚBLICAS DISPONÍVEIS
// ============================================

/**
 * Funções globais que podem ser chamadas do console
 * ou de outros scripts
 */

// Forçar atualização (invalida cache)
window.refreshOrganizations();

// Tentar novamente após erro
window.retryLoadOrganizations();

// Recarregar página completa
window.refreshPage();

// Abrir modal de nova empresa
window.openNewOrgModal();

// ============================================
// 6. EXEMPLOS DE USO NO CONSOLE
// ============================================

/**
 * Você pode testar no console do navegador:
 */

// Verificar cache
console.log('Cache válido?', cacheManager.isValid('organizations'));
console.log('Dados em cache:', cacheManager.get('organizations'));

// Ver estado atual
console.log('Estado de carregamento:', loadingState);

// Forçar refresh
refreshOrganizations();

// Ver organizações carregadas
console.log('Organizações:', organizationsData);

// ============================================
// 7. TRATAMENTO DE ERROS
// ============================================

/**
 * Quando ocorre um erro, o sistema:
 * 1. Tenta 3 vezes automaticamente
 * 2. Se falhar, mostra tela de erro
 * 3. Oferece opções de recuperação
 */

// Exemplo de erro capturado
try {
  await loadOrganizationsOnce();
} catch (error) {
  console.error('Erro no carregamento:', error.message);
  
  // Sistema mostra automaticamente:
  // - Ícone de erro animado
  // - Mensagem clara
  // - Botão "Tentar Novamente"
  // - Botão "Recarregar Página"
  // - Detalhes técnicos (expansível)
}

// ============================================
// 8. PERFORMANCE E MÉTRICAS
// ============================================

/**
 * Medir performance do carregamento
 */

console.time('Carregamento de organizações');
await loadOrganizationsOnce();
console.timeEnd('Carregamento de organizações');

// Informações do cache
console.log('Cache TTL:', cacheManager.organizations.ttl / 1000, 'segundos');
console.log('Cache timestamp:', new Date(cacheManager.organizations.timestamp));

// ============================================
// 9. DEBUGGING
// ============================================

/**
 * Para debug, você pode habilitar logs detalhados
 */

// No console, antes de carregar:
localStorage.setItem('debug_loading', 'true');

// Depois de testar, desabilitar:
localStorage.removeItem('debug_loading');

// ============================================
// 10. TESTES RÁPIDOS
// ============================================

/**
 * Testar diferentes cenários
 */

// Simular cache expirado
cacheManager.organizations.timestamp = Date.now() - (10 * 60 * 1000); // 10 min atrás
await loadOrganizationsOnce(); // Vai buscar da API

// Simular cache válido
cacheManager.set('organizations', [{id: '1', name: 'Teste'}]);
await loadOrganizationsOnce(); // Vai usar o cache

// Limpar tudo e recarregar
cacheManager.invalidate('organizations');
loadingState.loadedOrgs.clear();
hasLoadedOnce = false;
await loadOrganizationsOnce();

// ============================================
// EXEMPLO COMPLETO DE FLUXO
// ============================================

async function exemploFluxoCompleto() {
  console.log('🚀 Iniciando carregamento de empresas...');
  
  // 1. Verificar cache
  const cached = cacheManager.get('organizations');
  if (cached) {
    console.log('✨ Usando cache -', cached.length, 'empresas');
    return cached;
  }
  
  // 2. Carregar da API com retry
  console.log('📡 Buscando da API...');
  try {
    const response = await fetchWithRetry(
      'http://localhost:3000/api/organizations',
      { headers: { 'Authorization': 'Bearer token' } }
    );
    
    const data = await response.json();
    const orgs = data.organizations || [];
    
    console.log('✅ Recebido:', orgs.length, 'empresas');
    
    // 3. Salvar no cache
    cacheManager.set('organizations', orgs);
    console.log('💾 Salvo em cache');
    
    // 4. Carregar detalhes incrementalmente
    console.log('🔄 Carregando detalhes...');
    // ... processamento incremental
    
    console.log('✅ Concluído!');
    return orgs;
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    throw error;
  }
}

// Executar exemplo
// exemploFluxoCompleto();
