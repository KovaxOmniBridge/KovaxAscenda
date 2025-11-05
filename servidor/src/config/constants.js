/**
 * Constantes da Aplicação
 * Níveis hierárquicos, status, tipos, etc.
 */

// Níveis hierárquicos (0-7)
const HIERARCHICAL_LEVELS = {
    0: 'Presidentes',
    1: 'Administradores Gerais',
    2: 'Diretores Executivos',
    3: 'Gerentes',
    4: 'Coordenadores',
    5: 'Supervisores',
    6: 'Especialistas',
    7: 'Operacional'
};

// Templates organizacionais disponíveis
const ORGANIZATION_TEMPLATES = {
    CORPORATE: 'corporate',
    STARTUP: 'startup',
    GOVERNMENT: 'government',
    NGO: 'ngo',
    CUSTOM: 'custom'
};

// Status de squads
const SQUAD_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    COMPLETED: 'completed'
};

// Tipos de squads
const SQUAD_TYPES = {
    PRODUCT: 'product',
    PROJECT: 'project',
    SUPPORT: 'support',
    INNOVATION: 'innovation'
};

// Roles em squads
const SQUAD_ROLES = {
    PRODUCT_OWNER: 'product_owner',
    SCRUM_MASTER: 'scrum_master',
    TECH_LEAD: 'tech_lead',
    MEMBER: 'member'
};

// Roles em chapters
const CHAPTER_ROLES = {
    LEAD: 'lead',
    MEMBER: 'member',
    MENTOR: 'mentor'
};

// Tamanhos de empresa
const COMPANY_SIZES = [
    '1-10',
    '11-50',
    '51-200',
    '201-500',
    '501-1000',
    '1000+'
];

// Indústrias
const INDUSTRIES = [
    'Tecnologia',
    'Finanças',
    'Saúde',
    'Educação',
    'Varejo',
    'Manufatura',
    'Serviços',
    'Outros'
];

module.exports = {
    HIERARCHICAL_LEVELS,
    ORGANIZATION_TEMPLATES,
    SQUAD_STATUS,
    SQUAD_TYPES,
    SQUAD_ROLES,
    CHAPTER_ROLES,
    COMPANY_SIZES,
    INDUSTRIES
};
