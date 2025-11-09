-- ============================================================
-- ASCENDA PLATFORM - DATABASE SCHEMA
-- Sistema Multi-Tenant Escalável
-- ============================================================

-- ============================================================
-- 1. ORGANIZAÇÕES (Multi-Tenant)
-- ============================================================

-- Tabela principal de organizações/empresas
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_active ON organizations(is_active);

-- ============================================================
-- 1.1. DESENVOLVEDORES (Acesso Total à Plataforma)
-- ============================================================

CREATE TABLE developers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(100),
    permissions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_developers_email ON developers(email);
CREATE INDEX idx_developers_active ON developers(is_active);

-- ============================================================
-- 2. USUÁRIOS
-- ============================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id, email)
);

CREATE INDEX idx_users_org ON users(organization_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active);

-- ============================================================
-- 3. CATEGORIAS DE FERRAMENTAS
-- ============================================================

CREATE TABLE tool_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tool_categories_key ON tool_categories(key);
CREATE INDEX idx_tool_categories_order ON tool_categories(display_order);

-- Dados iniciais de categorias
INSERT INTO tool_categories (key, name, description, icon, display_order) VALUES
('lideranca', 'Liderança', 'Ferramentas estratégicas de liderança', '📊', 1),
('diretoria', 'Diretoria', 'Gestão de alto nível', '🏢', 2),
('administracao', 'Administração', 'Processos administrativos', '🏗️', 3),
('coordenacao', 'Coordenação', 'Coordenação de projetos e equipes', '📋', 4),
('gerenciamento', 'Gerenciamento', 'Gestão operacional', '✅', 5),
('supervisao', 'Supervisão', 'Monitoramento e aprovações', '👀', 6),
('operacional', 'Operacional', 'Atividades operacionais', '📝', 7);

-- ============================================================
-- 4. FERRAMENTAS
-- ============================================================

CREATE TABLE tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tool_category_id UUID NOT NULL REFERENCES tool_categories(id) ON DELETE CASCADE,
    key VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    route VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tools_category ON tools(tool_category_id);
CREATE INDEX idx_tools_key ON tools(key);
CREATE INDEX idx_tools_active ON tools(is_active);

-- Dados iniciais de ferramentas
INSERT INTO tools (tool_category_id, key, name, description, icon, route, display_order) VALUES
-- Liderança
((SELECT id FROM tool_categories WHERE key = 'lideranca'), 'visao-estrategica', 'Visão Estratégica', 'Dashboard executivo com KPIs estratégicos', '📊', '/pages/tools/visao-estrategica.html', 1),
((SELECT id FROM tool_categories WHERE key = 'lideranca'), 'planejamento-estrategico', 'Planejamento Estratégico', 'Ferramentas de planejamento de longo prazo', '🎯', '/pages/tools/planejamento-estrategico.html', 2),

-- Diretoria
((SELECT id FROM tool_categories WHERE key = 'diretoria'), 'gestao-departamentos', 'Gestão de Departamentos', 'Organização e acompanhamento de departamentos', '🏢', '/pages/tools/gestao-departamentos.html', 1),
((SELECT id FROM tool_categories WHERE key = 'diretoria'), 'relatorios-gerenciais', 'Relatórios Gerenciais', 'Relatórios consolidados da empresa', '📈', '/pages/tools/relatorios-gerenciais.html', 2),

-- Administração
((SELECT id FROM tool_categories WHERE key = 'administracao'), 'gestao-equipes', 'Gestão de Equipes', 'Criar e gerenciar equipes de trabalho', '👥', '/pages/tools/gestao-equipes.html', 1),
((SELECT id FROM tool_categories WHERE key = 'administracao'), 'gestao-squads', 'Gestão de Squads', 'Criar e gerenciar squads ágeis', '🚀', '/pages/tools/gestao-squads.html', 2),
((SELECT id FROM tool_categories WHERE key = 'administracao'), 'gestao-setores', 'Gestão de Setores', 'Organizar e administrar setores', '🏗️', '/pages/tools/gestao-setores.html', 3),
((SELECT id FROM tool_categories WHERE key = 'administracao'), 'contabilidade', 'Ferramentas Contábeis', 'Gestão contábil e financeira', '💰', '/pages/tools/contabilidade.html', 4),
((SELECT id FROM tool_categories WHERE key = 'administracao'), 'juridico', 'Ferramentas Jurídicas', 'Gestão de documentos e processos jurídicos', '⚖️', '/pages/tools/juridico.html', 5),

-- Coordenação
((SELECT id FROM tool_categories WHERE key = 'coordenacao'), 'coordenacao-projetos', 'Coordenação de Projetos', 'Gerenciar múltiplos projetos', '📋', '/pages/tools/coordenacao-projetos.html', 1),
((SELECT id FROM tool_categories WHERE key = 'coordenacao'), 'alocacao-recursos', 'Alocação de Recursos', 'Distribuir recursos entre projetos', '🔄', '/pages/tools/alocacao-recursos.html', 2),

-- Gerenciamento
((SELECT id FROM tool_categories WHERE key = 'gerenciamento'), 'gestao-tarefas', 'Gestão de Tarefas', 'Criar e acompanhar tarefas', '✅', '/pages/tools/gestao-tarefas.html', 1),
((SELECT id FROM tool_categories WHERE key = 'gerenciamento'), 'graficos-desempenho', 'Gráficos de Desempenho', 'Visualização de métricas e KPIs', '📊', '/pages/tools/graficos-desempenho.html', 2),
((SELECT id FROM tool_categories WHERE key = 'gerenciamento'), 'controle-prazos', 'Controle de Prazos', 'Timeline e cronogramas', '⏱️', '/pages/tools/controle-prazos.html', 3),

-- Supervisão
((SELECT id FROM tool_categories WHERE key = 'supervisao'), 'monitoramento-equipe', 'Monitoramento de Equipe', 'Acompanhar atividades da equipe', '👀', '/pages/tools/monitoramento-equipe.html', 1),
((SELECT id FROM tool_categories WHERE key = 'supervisao'), 'aprovacoes', 'Sistema de Aprovações', 'Aprovar ou rejeitar solicitações', '✓', '/pages/tools/aprovacoes.html', 2),

-- Operacional
((SELECT id FROM tool_categories WHERE key = 'operacional'), 'registro-atividades', 'Registro de Atividades', 'Registrar atividades diárias', '📝', '/pages/tools/registro-atividades.html', 1),
((SELECT id FROM tool_categories WHERE key = 'operacional'), 'checklist-tarefas', 'Checklist de Tarefas', 'Tarefas operacionais do dia a dia', '☑️', '/pages/tools/checklist-tarefas.html', 2);

-- ============================================================
-- 5. PERMISSÕES E ROLES
-- ============================================================

-- Roles/Perfis de acesso
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id, name)
);

CREATE INDEX idx_roles_org ON roles(organization_id);

-- Permissões específicas do sistema
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_permissions_key ON permissions(key);
CREATE INDEX idx_permissions_category ON permissions(category);

-- Dados iniciais de permissões
INSERT INTO permissions (key, name, description, category) VALUES
('can_access_dev', 'Acesso à Área do Desenvolvedor', 'Permissão para acessar ferramentas de desenvolvimento', 'system'),
('can_manage_users', 'Gerenciar Usuários', 'Criar, editar e excluir usuários', 'admin'),
('can_manage_roles', 'Gerenciar Roles', 'Criar e editar perfis de acesso', 'admin'),
('can_manage_organization', 'Gerenciar Organização', 'Configurar dados da organização', 'admin'),
('can_view_all_data', 'Visualizar Todos os Dados', 'Ver dados de todos os setores', 'data'),
('can_export_data', 'Exportar Dados', 'Exportar relatórios e dados', 'data');

-- Relacionamento: Role possui Permissões
CREATE TABLE role_permissions (
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id)
);

-- Relacionamento: Role possui acesso a Categorias de Ferramentas
CREATE TABLE role_tool_categories (
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    tool_category_id UUID NOT NULL REFERENCES tool_categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, tool_category_id)
);

-- Relacionamento: Usuário possui Roles
CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id)
);

-- Permissões diretas do usuário (sobrescreve roles)
CREATE TABLE user_permissions (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    is_granted BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, permission_id)
);

-- Categorias de ferramentas diretas do usuário (sobrescreve roles)
CREATE TABLE user_tool_categories (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tool_category_id UUID NOT NULL REFERENCES tool_categories(id) ON DELETE CASCADE,
    is_granted BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, tool_category_id)
);

-- ============================================================
-- 6. ESTRUTURA ORGANIZACIONAL
-- ============================================================

-- Departamentos
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_departments_org ON departments(organization_id);
CREATE INDEX idx_departments_parent ON departments(parent_id);
CREATE INDEX idx_departments_manager ON departments(manager_id);

-- Setores
CREATE TABLE sectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    coordinator_id UUID REFERENCES users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sectors_org ON sectors(organization_id);
CREATE INDEX idx_sectors_dept ON sectors(department_id);

-- Equipes
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    sector_id UUID REFERENCES sectors(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    leader_id UUID REFERENCES users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_teams_org ON teams(organization_id);
CREATE INDEX idx_teams_sector ON teams(sector_id);

-- Squads (equipes ágeis)
CREATE TABLE squads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    product_owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    scrum_master_id UUID REFERENCES users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_squads_org ON squads(organization_id);

-- Membros de Equipes
CREATE TABLE team_members (
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(100),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (team_id, user_id)
);

-- Membros de Squads
CREATE TABLE squad_members (
    squad_id UUID NOT NULL REFERENCES squads(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(100),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (squad_id, user_id)
);

-- ============================================================
-- 7. AUDITORIA E LOGS
-- ============================================================

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_org ON audit_logs(organization_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- ============================================================
-- 8. VIEWS ÚTEIS
-- ============================================================

-- View: Usuários com todas suas permissões (via roles + diretas)
CREATE VIEW user_all_permissions AS
SELECT DISTINCT
    u.id AS user_id,
    u.organization_id,
    p.id AS permission_id,
    p.key AS permission_key,
    p.name AS permission_name
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN role_permissions rp ON ur.role_id = rp.role_id
LEFT JOIN permissions p ON rp.permission_id = p.id
UNION
SELECT
    up.user_id,
    u.organization_id,
    p.id AS permission_id,
    p.key AS permission_key,
    p.name AS permission_name
FROM user_permissions up
JOIN users u ON up.user_id = u.id
JOIN permissions p ON up.permission_id = p.id
WHERE up.is_granted = true;

-- View: Usuários com todas as categorias de ferramentas (via roles + diretas)
CREATE VIEW user_all_tool_categories AS
SELECT DISTINCT
    u.id AS user_id,
    u.organization_id,
    tc.id AS tool_category_id,
    tc.key AS category_key,
    tc.name AS category_name
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN role_tool_categories rtc ON ur.role_id = rtc.role_id
LEFT JOIN tool_categories tc ON rtc.tool_category_id = tc.id
WHERE tc.is_active = true
UNION
SELECT
    utc.user_id,
    u.organization_id,
    tc.id AS tool_category_id,
    tc.key AS category_key,
    tc.name AS category_name
FROM user_tool_categories utc
JOIN users u ON utc.user_id = u.id
JOIN tool_categories tc ON utc.tool_category_id = tc.id
WHERE utc.is_granted = true AND tc.is_active = true;

-- ============================================================
-- 9. FUNÇÕES ÚTEIS
-- ============================================================

-- Função: Atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tools_updated_at BEFORE UPDATE ON tools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sectors_updated_at BEFORE UPDATE ON sectors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_squads_updated_at BEFORE UPDATE ON squads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
