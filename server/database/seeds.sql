-- ============================================================
-- DADOS INICIAIS PARA DESENVOLVIMENTO
-- ============================================================

-- Limpar dados existentes (cuidado em produção!)
TRUNCATE TABLE 
    audit_logs,
    squad_members,
    team_members,
    squads,
    teams,
    sectors,
    departments,
    user_tool_categories,
    user_permissions,
    user_roles,
    role_tool_categories,
    role_permissions,
    roles,
    users,
    organizations
CASCADE;

-- ============================================================
-- 1. ORGANIZAÇÃO DE EXEMPLO
-- ============================================================

INSERT INTO organizations (id, name, slug, description) VALUES
('00000000-0000-0000-0000-000000000001', 'Empresa Modelo S.A.', 'empresa-modelo', 'Organização de demonstração do sistema');

-- ============================================================
-- 2. ROLES/PERFIS
-- ============================================================

INSERT INTO roles (id, organization_id, name, description, is_system_role) VALUES
('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000001', 'CEO', 'Chief Executive Officer - Acesso total estratégico', true),
('00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0000-000000000001', 'Diretor', 'Diretor de departamento', true),
('00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0000-000000000001', 'Administrador', 'Gerenciamento administrativo', true),
('00000000-0000-0000-0001-000000000004', '00000000-0000-0000-0000-000000000001', 'Coordenador', 'Coordenação de projetos', true),
('00000000-0000-0000-0001-000000000005', '00000000-0000-0000-0000-000000000001', 'Gerente', 'Gerente de equipe', true),
('00000000-0000-0000-0001-000000000006', '00000000-0000-0000-0000-000000000001', 'Supervisor', 'Supervisor de operações', true),
('00000000-0000-0000-0001-000000000007', '00000000-0000-0000-0000-000000000001', 'Operacional', 'Executor de tarefas', true),
('00000000-0000-0000-0001-000000000008', '00000000-0000-0000-0000-000000000001', 'Desenvolvedor', 'Desenvolvedor do sistema', true);

-- ============================================================
-- 3. ASSOCIAR CATEGORIAS DE FERRAMENTAS AOS ROLES
-- ============================================================

-- CEO: Todas as categorias
INSERT INTO role_tool_categories (role_id, tool_category_id)
SELECT '00000000-0000-0000-0001-000000000001', id FROM tool_categories;

-- Diretor: Liderança + Diretoria
INSERT INTO role_tool_categories (role_id, tool_category_id)
SELECT '00000000-0000-0000-0001-000000000002', id FROM tool_categories 
WHERE key IN ('lideranca', 'diretoria');

-- Administrador: Administração + Gerenciamento
INSERT INTO role_tool_categories (role_id, tool_category_id)
SELECT '00000000-0000-0000-0001-000000000003', id FROM tool_categories 
WHERE key IN ('administracao', 'gerenciamento');

-- Coordenador: Coordenação + Gerenciamento
INSERT INTO role_tool_categories (role_id, tool_category_id)
SELECT '00000000-0000-0000-0001-000000000004', id FROM tool_categories 
WHERE key IN ('coordenacao', 'gerenciamento');

-- Gerente: Gerenciamento
INSERT INTO role_tool_categories (role_id, tool_category_id)
SELECT '00000000-0000-0000-0001-000000000005', id FROM tool_categories 
WHERE key = 'gerenciamento';

-- Supervisor: Supervisão + Gerenciamento
INSERT INTO role_tool_categories (role_id, tool_category_id)
SELECT '00000000-0000-0000-0001-000000000006', id FROM tool_categories 
WHERE key IN ('supervisao', 'gerenciamento');

-- Operacional: Operacional
INSERT INTO role_tool_categories (role_id, tool_category_id)
SELECT '00000000-0000-0000-0001-000000000007', id FROM tool_categories 
WHERE key = 'operacional';

-- ============================================================
-- 4. ASSOCIAR PERMISSÕES ESPECIAIS AOS ROLES
-- ============================================================

-- CEO: Todas as permissões
INSERT INTO role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0001-000000000001', id FROM permissions;

-- Administrador: Gerenciar usuários e organização
INSERT INTO role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0001-000000000003', id FROM permissions 
WHERE key IN ('can_manage_users', 'can_manage_organization', 'can_view_all_data');

-- Desenvolvedor: Acesso dev
INSERT INTO role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0001-000000000008', id FROM permissions 
WHERE key = 'can_access_dev';

-- ============================================================
-- 5. USUÁRIOS DE EXEMPLO
-- ============================================================

-- Senha: "senha123" (hash bcrypt)
-- $2b$10$rqYz8K5YC0J8xE9ZhK5f1.VYOjW7j8vF9yGQwK5xF7J8K5xF7J8K5e

INSERT INTO users (id, organization_id, email, password_hash, name, is_verified) VALUES
('00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0000-000000000001', 'ceo@empresa.com', '$2b$10$rqYz8K5YC0J8xE9ZhK5f1.VYOjW7j8vF9yGQwK5xF7J8K5xF7J8K5e', 'Carlos Silva (CEO)', true),
('00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0000-000000000001', 'diretor@empresa.com', '$2b$10$rqYz8K5YC0J8xE9ZhK5f1.VYOjW7j8vF9yGQwK5xF7J8K5xF7J8K5e', 'Maria Santos (Diretora)', true),
('00000000-0000-0000-0002-000000000003', '00000000-0000-0000-0000-000000000001', 'admin@empresa.com', '$2b$10$rqYz8K5YC0J8xE9ZhK5f1.VYOjW7j8vF9yGQwK5xF7J8K5xF7J8K5e', 'João Oliveira (Admin)', true),
('00000000-0000-0000-0002-000000000004', '00000000-0000-0000-0000-000000000001', 'coordenador@empresa.com', '$2b$10$rqYz8K5YC0J8xE9ZhK5f1.VYOjW7j8vF9yGQwK5xF7J8K5xF7J8K5e', 'Ana Costa (Coordenadora)', true),
('00000000-0000-0000-0002-000000000005', '00000000-0000-0000-0000-000000000001', 'gerente@empresa.com', '$2b$10$rqYz8K5YC0J8xE9ZhK5f1.VYOjW7j8vF9yGQwK5xF7J8K5xF7J8K5e', 'Pedro Almeida (Gerente)', true),
('00000000-0000-0000-0002-000000000006', '00000000-0000-0000-0000-000000000001', 'supervisor@empresa.com', '$2b$10$rqYz8K5YC0J8xE9ZhK5f1.VYOjW7j8vF9yGQwK5xF7J8K5xF7J8K5e', 'Lucia Ferreira (Supervisora)', true),
('00000000-0000-0000-0002-000000000007', '00000000-0000-0000-0000-000000000001', 'operador@empresa.com', '$2b$10$rqYz8K5YC0J8xE9ZhK5f1.VYOjW7j8vF9yGQwK5xF7J8K5xF7J8K5e', 'Roberto Lima (Operador)', true),
('00000000-0000-0000-0002-000000000008', '00000000-0000-0000-0000-000000000001', 'dev@empresa.com', '$2b$10$rqYz8K5YC0J8xE9ZhK5f1.VYOjW7j8vF9yGQwK5xF7J8K5xF7J8K5e', 'Developer System', true);

-- ============================================================
-- 6. ASSOCIAR USUÁRIOS AOS ROLES
-- ============================================================

INSERT INTO user_roles (user_id, role_id) VALUES
('00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0001-000000000001'), -- CEO
('00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0001-000000000002'), -- Diretor
('00000000-0000-0000-0002-000000000003', '00000000-0000-0000-0001-000000000003'), -- Administrador
('00000000-0000-0000-0002-000000000004', '00000000-0000-0000-0001-000000000004'), -- Coordenador
('00000000-0000-0000-0002-000000000005', '00000000-0000-0000-0001-000000000005'), -- Gerente
('00000000-0000-0000-0002-000000000006', '00000000-0000-0000-0001-000000000006'), -- Supervisor
('00000000-0000-0000-0002-000000000007', '00000000-0000-0000-0001-000000000007'), -- Operacional
('00000000-0000-0000-0002-000000000008', '00000000-0000-0000-0001-000000000008'); -- Desenvolvedor

-- ============================================================
-- 7. ESTRUTURA ORGANIZACIONAL DE EXEMPLO
-- ============================================================

-- Departamentos
INSERT INTO departments (id, organization_id, name, description, manager_id) VALUES
('00000000-0000-0000-0003-000000000001', '00000000-0000-0000-0000-000000000001', 'Tecnologia', 'Departamento de TI', '00000000-0000-0000-0002-000000000002'),
('00000000-0000-0000-0003-000000000002', '00000000-0000-0000-0000-000000000001', 'Financeiro', 'Departamento Financeiro', '00000000-0000-0000-0002-000000000002'),
('00000000-0000-0000-0003-000000000003', '00000000-0000-0000-0000-000000000001', 'Operações', 'Departamento de Operações', '00000000-0000-0000-0002-000000000002');

-- Setores
INSERT INTO sectors (id, organization_id, department_id, name, coordinator_id) VALUES
('00000000-0000-0000-0004-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0003-000000000001', 'Desenvolvimento', '00000000-0000-0000-0002-000000000004'),
('00000000-0000-0000-0004-000000000002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0003-000000000002', 'Contabilidade', '00000000-0000-0000-0002-000000000004');

-- Equipes
INSERT INTO teams (id, organization_id, sector_id, name, leader_id) VALUES
('00000000-0000-0000-0005-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0004-000000000001', 'Equipe Backend', '00000000-0000-0000-0002-000000000005'),
('00000000-0000-0000-0005-000000000002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0004-000000000001', 'Equipe Frontend', '00000000-0000-0000-0002-000000000005');

-- Squads
INSERT INTO squads (id, organization_id, name, product_owner_id, scrum_master_id) VALUES
('00000000-0000-0000-0006-000000000001', '00000000-0000-0000-0000-000000000001', 'Squad Ascenda', '00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0002-000000000004');

-- Membros das equipes
INSERT INTO team_members (team_id, user_id, role) VALUES
('00000000-0000-0000-0005-000000000001', '00000000-0000-0000-0002-000000000008', 'Developer'),
('00000000-0000-0000-0005-000000000002', '00000000-0000-0000-0002-000000000008', 'Developer');

-- Membros dos squads
INSERT INTO squad_members (squad_id, user_id, role) VALUES
('00000000-0000-0000-0006-000000000001', '00000000-0000-0000-0002-000000000008', 'Developer');
