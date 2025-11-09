-- =====================================================
-- SEED SQLITE - ASCENDA PLATFORM
-- =====================================================
-- Dados iniciais para desenvolvimento
-- =====================================================

-- =====================================================
-- ORGANIZATIONS
-- =====================================================
INSERT OR IGNORE INTO organizations (id, name, slug) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Empresa Modelo S.A.', 'empresa-modelo');

-- =====================================================
-- DEVELOPERS
-- =====================================================
-- Senha: Dev@2024!Super
INSERT OR IGNORE INTO developers (id, name, email, password_hash, role, permissions) VALUES
('550e8400-e29b-41d4-a716-446655440101',
 'Desenvolvedor Principal',
 'dev@ascenda.com',
 '$2b$10$XVF6QhYMatviYsy2aUFKYeziZUZkD46eU1qPjuDm8rv.Zc.g2My4G',
 'developer',
 '{"all": true}');

-- Senha: Admin@2024!Master
INSERT OR IGNORE INTO developers (id, name, email, password_hash, role, permissions) VALUES
('550e8400-e29b-41d4-a716-446655440102',
 'Administrador Master',
 'admin@ascenda.com',
 '$2b$10$xZBHFc0r3svQ0jZOjEgp5.6IB2xAlfvBJPsVm0CxX9QZM4tis8IAW',
 'admin',
 '{"all": true, "users": true, "organizations": true}');

-- =====================================================
-- USERS
-- =====================================================
-- Senha: senha123 (todos)
-- CEO
INSERT OR IGNORE INTO users (id, organization_id, name, email, password_hash) VALUES
('550e8400-e29b-41d4-a716-446655440201',
 '550e8400-e29b-41d4-a716-446655440001',
 'CEO da Empresa',
 'ceo@empresa.com',
 '$2b$10$afO4GqgAqsZpXDwemFpXSuKv1uIXZ9LrEbutQsksb/8JcARC4yJEu');

-- Diretor
INSERT OR IGNORE INTO users (id, organization_id, name, email, password_hash) VALUES
('550e8400-e29b-41d4-a716-446655440202',
 '550e8400-e29b-41d4-a716-446655440001',
 'Diretor Executivo',
 'diretor@empresa.com',
 '$2b$10$afO4GqgAqsZpXDwemFpXSuKv1uIXZ9LrEbutQsksb/8JcARC4yJEu');

-- Admin
INSERT OR IGNORE INTO users (id, organization_id, name, email, password_hash) VALUES
('550e8400-e29b-41d4-a716-446655440203',
 '550e8400-e29b-41d4-a716-446655440001',
 'Administrador Geral',
 'admin@empresa.com',
 '$2b$10$afO4GqgAqsZpXDwemFpXSuKv1uIXZ9LrEbutQsksb/8JcARC4yJEu');

-- Dev
INSERT OR IGNORE INTO users (id, organization_id, name, email, password_hash) VALUES
('550e8400-e29b-41d4-a716-446655440204',
 '550e8400-e29b-41d4-a716-446655440001',
 'Desenvolvedor Teste',
 'dev@empresa.com',
 '$2b$10$afO4GqgAqsZpXDwemFpXSuKv1uIXZ9LrEbutQsksb/8JcARC4yJEu');

-- =====================================================
-- TOOL CATEGORIES
-- =====================================================
INSERT OR IGNORE INTO tool_categories (id, key, name, icon, description, display_order) VALUES
('550e8400-e29b-41d4-a716-446655440301', 'lideranca', 'Liderança', '🎯', 'Planejamento estratégico e direcionamento', 1),
('550e8400-e29b-41d4-a716-446655440302', 'diretoria', 'Diretoria', '📊', 'Gestão de indicadores e governança', 2),
('550e8400-e29b-41d4-a716-446655440303', 'administracao', 'Administração', '⚙️', 'Controle administrativo e financeiro', 3),
('550e8400-e29b-41d4-a716-446655440304', 'coordenacao', 'Coordenação', '🎓', 'Coordenação de projetos e equipes', 4),
('550e8400-e29b-41d4-a716-446655440305', 'gerenciamento', 'Gerenciamento', '📈', 'Gestão de recursos e orçamentos', 5),
('550e8400-e29b-41d4-a716-446655440306', 'supervisao', 'Supervisão', '👥', 'Monitoramento e relatórios', 6),
('550e8400-e29b-41d4-a716-446655440307', 'operacional', 'Operacional', '🔧', 'Execução de tarefas operacionais', 7);

-- =====================================================
-- TOOLS (Exemplos)
-- =====================================================
INSERT OR IGNORE INTO tools (id, category_id, name, description, icon, display_order) VALUES
('550e8400-e29b-41d4-a716-446655440401', '550e8400-e29b-41d4-a716-446655440301', 'Dashboard Executivo', 'Visão geral da empresa', '📊', 1),
('550e8400-e29b-41d4-a716-446655440402', '550e8400-e29b-41d4-a716-446655440301', 'Planejamento Estratégico', 'Definição de objetivos', '🎯', 2),
('550e8400-e29b-41d4-a716-446655440403', '550e8400-e29b-41d4-a716-446655440302', 'Gestão de Indicadores', 'KPIs e métricas', '📈', 1),
('550e8400-e29b-41d4-a716-446655440404', '550e8400-e29b-41d4-a716-446655440302', 'Compliance', 'Conformidade e auditoria', '✅', 2),
('550e8400-e29b-41d4-a716-446655440405', '550e8400-e29b-41d4-a716-446655440303', 'Gestão Financeira', 'Controle de finanças', '💰', 1),
('550e8400-e29b-41d4-a716-446655440406', '550e8400-e29b-41d4-a716-446655440303', 'Recursos Humanos', 'Gestão de pessoas', '👥', 2);
