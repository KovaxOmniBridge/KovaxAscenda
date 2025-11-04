import Database from 'better-sqlite3';
import DatabaseService from '../database/DatabaseService';
import { ICompanySite, ICreateCompanySite, IUpdateCompanySite } from '../interfaces/ICompanySite';
import { v4 as uuidv4 } from 'uuid';

export class CompanySiteRepository {
    private db: Database.Database;

    constructor() {
        this.db = DatabaseService.getConnection();
        this.initializeTables();
    }

    private initializeTables(): void {
        // Table for site configurations
        const createSiteTableSQL = `
            CREATE TABLE IF NOT EXISTS company_sites (
                id TEXT PRIMARY KEY,
                companyId TEXT UNIQUE NOT NULL,
                editorType TEXT NOT NULL DEFAULT 'simple',
                theme TEXT NOT NULL DEFAULT 'blue',
                primaryColor TEXT,
                secondaryColor TEXT,
                accentColor TEXT,
                heroGradient TEXT NOT NULL DEFAULT 'hero-gradient-1',
                layout TEXT NOT NULL DEFAULT 'modern',
                font TEXT NOT NULL DEFAULT 'modern',
                logo TEXT,
                banner TEXT,
                favicon TEXT,
                heroTitle TEXT,
                heroDescription TEXT,
                aboutText TEXT,
                customCSS TEXT,
                customLayout TEXT,
                socialLinks TEXT,
                sections TEXT,
                slug TEXT UNIQUE,
                isActive INTEGER NOT NULL DEFAULT 1,
                createdAt TEXT NOT NULL,
                updatedAt TEXT NOT NULL,
                FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE CASCADE
            )
        `;

        this.db.exec(createSiteTableSQL);

        // Create indexes
        this.db.exec(`CREATE INDEX IF NOT EXISTS idx_company_sites_companyId ON company_sites(companyId)`);
        this.db.exec(`CREATE INDEX IF NOT EXISTS idx_company_sites_slug ON company_sites(slug)`);
        this.db.exec(`CREATE INDEX IF NOT EXISTS idx_company_sites_isActive ON company_sites(isActive)`);
    }

    create(companyId: string, data: ICreateCompanySite): ICompanySite {
        const id = uuidv4();
        const now = new Date().toISOString();

        // Default sections
        const defaultSections = [
            { id: 'hero', name: 'Hero', visible: true, order: 1 },
            { id: 'products', name: 'Produtos', visible: true, order: 2 },
            { id: 'services', name: 'Serviços', visible: true, order: 3 },
            { id: 'about', name: 'Sobre', visible: true, order: 4 },
            { id: 'contact', name: 'Contato', visible: true, order: 5 }
        ];

        const stmt = this.db.prepare(`
            INSERT INTO company_sites (
                id, companyId, editorType, theme, primaryColor, secondaryColor, accentColor,
                heroGradient, layout, font, logo, banner, favicon,
                heroTitle, heroDescription, aboutText, customCSS, customLayout,
                socialLinks, sections, slug, isActive, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            id,
            companyId,
            data.editorType || 'simple',
            data.theme || 'blue',
            data.primaryColor || null,
            data.secondaryColor || null,
            data.accentColor || null,
            data.heroGradient || 'hero-gradient-1',
            data.layout || 'modern',
            data.font || 'modern',
            data.logo || null,
            data.banner || null,
            data.favicon || null,
            data.heroTitle || null,
            data.heroDescription || null,
            data.aboutText || null,
            data.customCSS || null,
            data.customLayout || null,
            data.socialLinks ? JSON.stringify(data.socialLinks) : null,
            data.sections ? JSON.stringify(data.sections) : JSON.stringify(defaultSections),
            data.slug || null,
            data.isActive !== undefined ? (data.isActive ? 1 : 0) : 1,
            now,
            now
        );

        return this.findByCompanyId(companyId)!;
    }

    findByCompanyId(companyId: string): ICompanySite | null {
        const stmt = this.db.prepare(`
            SELECT * FROM company_sites 
            WHERE companyId = ?
        `);

        const row = stmt.get(companyId) as any;
        return row ? this.mapRowToSite(row) : null;
    }

    findBySlug(slug: string): ICompanySite | null {
        const stmt = this.db.prepare(`
            SELECT * FROM company_sites 
            WHERE slug = ? AND isActive = 1
        `);

        const row = stmt.get(slug) as any;
        return row ? this.mapRowToSite(row) : null;
    }

    findAll(): ICompanySite[] {
        const stmt = this.db.prepare(`
            SELECT * FROM company_sites 
            WHERE isActive = 1
            ORDER BY createdAt DESC
        `);

        const rows = stmt.all() as any[];
        return rows.map(row => this.mapRowToSite(row));
    }

    update(companyId: string, data: IUpdateCompanySite): ICompanySite {
        const existing = this.findByCompanyId(companyId);
        
        if (!existing) {
            throw new Error('Configurações do site não encontradas');
        }

        const now = new Date().toISOString();

        const updates: string[] = [];
        const values: any[] = [];

        if (data.theme !== undefined) {
            updates.push('theme = ?');
            values.push(data.theme);
        }
        if (data.primaryColor !== undefined) {
            updates.push('primaryColor = ?');
            values.push(data.primaryColor);
        }
        if (data.secondaryColor !== undefined) {
            updates.push('secondaryColor = ?');
            values.push(data.secondaryColor);
        }
        if (data.accentColor !== undefined) {
            updates.push('accentColor = ?');
            values.push(data.accentColor);
        }
        if (data.editorType !== undefined) {
            updates.push('editorType = ?');
            values.push(data.editorType);
        }
        if (data.heroGradient !== undefined) {
            updates.push('heroGradient = ?');
            values.push(data.heroGradient);
        }
        if (data.layout !== undefined) {
            updates.push('layout = ?');
            values.push(data.layout);
        }
        if (data.font !== undefined) {
            updates.push('font = ?');
            values.push(data.font);
        }
        if (data.logo !== undefined) {
            updates.push('logo = ?');
            values.push(data.logo);
        }
        if (data.banner !== undefined) {
            updates.push('banner = ?');
            values.push(data.banner);
        }
        if (data.favicon !== undefined) {
            updates.push('favicon = ?');
            values.push(data.favicon);
        }
        if (data.heroTitle !== undefined) {
            updates.push('heroTitle = ?');
            values.push(data.heroTitle);
        }
        if (data.heroDescription !== undefined) {
            updates.push('heroDescription = ?');
            values.push(data.heroDescription);
        }
        if (data.aboutText !== undefined) {
            updates.push('aboutText = ?');
            values.push(data.aboutText);
        }
        if (data.customCSS !== undefined) {
            updates.push('customCSS = ?');
            values.push(data.customCSS);
        }
        if (data.customLayout !== undefined) {
            updates.push('customLayout = ?');
            values.push(data.customLayout);
        }
        if (data.socialLinks !== undefined) {
            updates.push('socialLinks = ?');
            values.push(JSON.stringify(data.socialLinks));
        }
        if (data.sections !== undefined) {
            updates.push('sections = ?');
            values.push(JSON.stringify(data.sections));
        }
        if (data.slug !== undefined) {
            updates.push('slug = ?');
            values.push(data.slug);
        }
        if (data.isActive !== undefined) {
            updates.push('isActive = ?');
            values.push(data.isActive ? 1 : 0);
        }

        if (updates.length === 0) {
            return existing;
        }

        updates.push('updatedAt = ?');
        values.push(now);
        values.push(companyId);

        const sql = `UPDATE company_sites SET ${updates.join(', ')} WHERE companyId = ?`;
        const stmt = this.db.prepare(sql);
        stmt.run(...values);

        return this.findByCompanyId(companyId)!;
    }

    delete(companyId: string): void {
        const stmt = this.db.prepare(`DELETE FROM company_sites WHERE companyId = ?`);
        stmt.run(companyId);
    }

    private mapRowToSite(row: any): ICompanySite {
        return {
            id: row.id,
            companyId: row.companyId,
            editorType: row.editorType || 'simple',
            theme: row.theme,
            primaryColor: row.primaryColor,
            secondaryColor: row.secondaryColor,
            accentColor: row.accentColor,
            heroGradient: row.heroGradient,
            layout: row.layout,
            font: row.font,
            logo: row.logo,
            banner: row.banner,
            favicon: row.favicon,
            heroTitle: row.heroTitle,
            heroDescription: row.heroDescription,
            aboutText: row.aboutText,
            customCSS: row.customCSS,
            customLayout: row.customLayout,
            socialLinks: row.socialLinks ? JSON.parse(row.socialLinks) : undefined,
            sections: row.sections ? JSON.parse(row.sections) : undefined,
            slug: row.slug,
            isActive: row.isActive === 1,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt
        };
    }
}
