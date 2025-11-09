-- =====================================================
-- SEED DATA - Dados Iniciais para Desenvolvimento
-- =====================================================

-- Limpar dados existentes (apenas em desenvolvimento!)
-- TRUNCATE TABLE audit_logs, tools, tool_categories, users, developers, organizations RESTART IDENTITY CASCADE;

-- =====================================================
-- 1. ORGANIZAÇÃO DE TESTE
-- =====================================================

INSERT INTO organizations (id, name, slug, description, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Empresa Modelo S.A.', 'empresa-modelo', 'Empresa de demonstração da plataforma Ascenda', true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 2. DESENVOLVEDORES (Acesso Total)
-- =====================================================

-- Senha: Dev@2024!Super (hash bcrypt)
INSERT INTO developers (id, name, email, password_hash, role, permissions, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440101', 
 'Admin Desenvolvedor', 
 'dev@ascenda.com', 
 '$2b$10$XVF6QhYMatviYsy2aUFKYeziZUZkD46eU1qPjuDm8rv.Zc.g2My4G',
 'Senior Developer',
 '{"fullAccess": true, "canManageOrganizations": true, "canManageUsers": true, "canManageTools": true, "canViewLogs": true, "canModifySettings": true}',
 true)
ON CONFLICT (email) DO NOTHING;

-- Senha: Admin@2024!Master (hash bcrypt)
INSERT INTO developers (id, name, email, password_hash, role, permissions, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440102',
 'Super Admin',
 'admin@ascenda.com',
 '$2b$10$xZBHFc0r3svQ0jZOjEgp5.6IB2xAlfvBJPsVm0CxX9QZM4tis8IAW',
 'Platform Administrator',
 '{"fullAccess": true, "canManageOrganizations": true, "canManageUsers": true, "canManageTools": true, "canViewLogs": true, "canModifySettings": true}',
 true)
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- 3. USUÁRIOS DE TESTE (Empresa Modelo)
-- =====================================================

-- Senha: senha123 (hash bcrypt)
-- CEO
INSERT INTO users (id, organization_id, name, email, password_hash, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440201',
 '550e8400-e29b-41d4-a716-446655440001',
 'CEO da Empresa',
 'ceo@empresa.com',
 '$2b$10$afO4GqgAqsZpXDwemFpXSuKv1uIXZ9LrEbutQsksb/8JcARC4yJEu',
 true)
ON CONFLICT (organization_id, email) DO NOTHING;

-- Diretor
INSERT INTO users (id, organization_id, name, email, password_hash, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440202',
 '550e8400-e29b-41d4-a716-446655440001',
 'Diretor Executivo',
 'diretor@empresa.com',
 '$2b$10$afO4GqgAqsZpXDwemFpXSuKv1uIXZ9LrEbutQsksb/8JcARC4yJEu',
 true)
ON CONFLICT (organization_id, email) DO NOTHING;

-- Admin
INSERT INTO users (id, organization_id, name, email, password_hash, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440203',
 '550e8400-e29b-41d4-a716-446655440001',
 'Administrador Geral',
 'admin@empresa.com',
 '$2b$10$afO4GqgAqsZpXDwemFpXSuKv1uIXZ9LrEbutQsksb/8JcARC4yJEu',
 true)
ON CONFLICT (organization_id, email) DO NOTHING;

-- Dev (usuário especial com acesso a tudo)
INSERT INTO users (id, organization_id, name, email, password_hash, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440204',
 '550e8400-e29b-41d4-a716-446655440001',
 'Desenvolvedor Teste',
 'dev@empresa.com',
 '$2b$10$afO4GqgAqsZpXDwemFpXSuKv1uIXZ9LrEbutQsksb/8JcARC4yJEu',
 true)
ON CONFLICT (organization_id, email) DO NOTHING;

-- =====================================================
-- 4. FERRAMENTAS (via migrations ou manual)
-- =====================================================
-- As ferramentas serão criadas via migrations separadas
-- ou através do painel de desenvolvedor

-- =====================================================
-- Confirmação
-- =====================================================

SELECT 'Seed completed!' as status,
       (SELECT COUNT(*) FROM organizations) as organizations,
       (SELECT COUNT(*) FROM developers) as developers,
       (SELECT COUNT(*) FROM users) as users,
       (SELECT COUNT(*) FROM tool_categories) as categories;
