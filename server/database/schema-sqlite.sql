-- =====================================================
-- SCHEMA SQLITE - ASCENDA PLATFORM
-- =====================================================
-- Versão adaptada do PostgreSQL para SQLite
-- =====================================================

-- Limpar tabelas se existirem (ordem correta devido a FKs)
DROP TABLE IF EXISTS tools;
DROP TABLE IF EXISTS tool_categories;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS developers;
DROP TABLE IF EXISTS organizations;

-- =====================================================
-- TABELA: organizations
-- =====================================================
CREATE TABLE organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_organizations_slug ON organizations(slug);

-- =====================================================
-- TABELA: developers
-- =====================================================
CREATE TABLE developers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'developer',
  permissions TEXT DEFAULT '{}',
  is_active INTEGER DEFAULT 1,
  last_login_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_developers_email ON developers(email);
CREATE INDEX idx_developers_active ON developers(is_active);

-- =====================================================
-- TABELA: users
-- =====================================================
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  is_active INTEGER DEFAULT 1,
  last_login_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  UNIQUE(organization_id, email)
);

CREATE INDEX idx_users_organization ON users(organization_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active);

-- =====================================================
-- TABELA: tool_categories
-- =====================================================
CREATE TABLE tool_categories (
  id TEXT PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_tool_categories_key ON tool_categories(key);
CREATE INDEX idx_tool_categories_order ON tool_categories(display_order);

-- =====================================================
-- TABELA: tools
-- =====================================================
CREATE TABLE tools (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  url TEXT,
  is_active INTEGER DEFAULT 1,
  display_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (category_id) REFERENCES tool_categories(id) ON DELETE CASCADE
);

CREATE INDEX idx_tools_category ON tools(category_id);
CREATE INDEX idx_tools_active ON tools(is_active);
CREATE INDEX idx_tools_order ON tools(display_order);

-- =====================================================
-- TRIGGERS PARA UPDATED_AT
-- =====================================================

-- Organizations
CREATE TRIGGER update_organizations_timestamp 
AFTER UPDATE ON organizations
BEGIN
  UPDATE organizations SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- Developers
CREATE TRIGGER update_developers_timestamp 
AFTER UPDATE ON developers
BEGIN
  UPDATE developers SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- Users
CREATE TRIGGER update_users_timestamp 
AFTER UPDATE ON users
BEGIN
  UPDATE users SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- Tool Categories
CREATE TRIGGER update_tool_categories_timestamp 
AFTER UPDATE ON tool_categories
BEGIN
  UPDATE tool_categories SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- Tools
CREATE TRIGGER update_tools_timestamp 
AFTER UPDATE ON tools
BEGIN
  UPDATE tools SET updated_at = datetime('now') WHERE id = NEW.id;
END;
