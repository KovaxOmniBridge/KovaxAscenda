import Database from 'better-sqlite3';
import * as crypto from 'crypto';
import {
    IExecutiveParticipation,
    ICreateParticipation,
    IUpdateParticipation,
    ExecutiveRole,
    ParticipationStatus
} from '../interfaces/IExecutive';

export class ExecutiveParticipationRepository {
    private db: Database.Database;

    constructor(db: Database.Database) {
        this.db = db;
        this.initializeTables();
    }

    private initializeTables(): void {
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS executive_participations (
                id TEXT PRIMARY KEY,
                executiveId TEXT NOT NULL,
                companyId TEXT NOT NULL,
                companyName TEXT NOT NULL,
                role TEXT NOT NULL,
                status TEXT NOT NULL,
                equityPercentage REAL,
                sharesOwned INTEGER,
                salary REAL,
                bonusStructure TEXT,
                startDate TEXT NOT NULL,
                endDate TEXT,
                hasFullAccess INTEGER NOT NULL DEFAULT 0,
                canViewFinancials INTEGER NOT NULL DEFAULT 0,
                canViewEmployees INTEGER NOT NULL DEFAULT 0,
                canViewAssets INTEGER NOT NULL DEFAULT 0,
                canMakeDecisions INTEGER NOT NULL DEFAULT 0,
                notes TEXT,
                createdAt TEXT NOT NULL,
                updatedAt TEXT NOT NULL,
                
                FOREIGN KEY (executiveId) REFERENCES employees(id) ON DELETE CASCADE,
                FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE CASCADE,
                UNIQUE(executiveId, companyId, role)
            );
            
            -- Índices
            CREATE INDEX IF NOT EXISTS idx_participations_executive ON executive_participations(executiveId);
            CREATE INDEX IF NOT EXISTS idx_participations_company ON executive_participations(companyId);
            CREATE INDEX IF NOT EXISTS idx_participations_status ON executive_participations(status);
            CREATE INDEX IF NOT EXISTS idx_participations_role ON executive_participations(role);
        `);
    }

    /**
     * Cria participação executiva
     */
    create(data: ICreateParticipation): IExecutiveParticipation {
        const id = crypto.randomUUID();
        const now = new Date().toISOString();

        // Busca nome da empresa
        const companyStmt = this.db.prepare('SELECT name, razaoSocial, nomeFantasia FROM companies WHERE id = ?');
        const company = companyStmt.get(data.companyId) as any;
        const companyName = company?.nomeFantasia || company?.name || 'Empresa';

        const stmt = this.db.prepare(`
            INSERT INTO executive_participations (
                id, executiveId, companyId, companyName, role, status,
                equityPercentage, sharesOwned, salary, bonusStructure,
                startDate, endDate,
                hasFullAccess, canViewFinancials, canViewEmployees, canViewAssets, canMakeDecisions,
                notes, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            id,
            data.executiveId,
            data.companyId,
            companyName,
            data.role,
            data.status,
            data.equityPercentage || null,
            data.sharesOwned || null,
            data.salary || null,
            data.bonusStructure || null,
            data.startDate,
            data.endDate || null,
            data.hasFullAccess ? 1 : 0,
            data.canViewFinancials ? 1 : 0,
            data.canViewEmployees ? 1 : 0,
            data.canViewAssets ? 1 : 0,
            data.canMakeDecisions ? 1 : 0,
            data.notes || null,
            now,
            now
        );

        const participation = this.findById(id);
        if (!participation) {
            throw new Error('Erro ao criar participação');
        }

        return participation;
    }

    /**
     * Busca participação por ID
     */
    findById(id: string): IExecutiveParticipation | null {
        const stmt = this.db.prepare('SELECT * FROM executive_participations WHERE id = ?');
        const row = stmt.get(id) as any;
        return row ? this.mapRowToParticipation(row) : null;
    }

    /**
     * Lista todas as participações
     */
    findAll(): IExecutiveParticipation[] {
        const stmt = this.db.prepare('SELECT * FROM executive_participations ORDER BY createdAt DESC');
        const rows = stmt.all() as any[];
        return rows.map(row => this.mapRowToParticipation(row));
    }

    /**
     * Lista participações de um executivo
     */
    findByExecutive(executiveId: string): IExecutiveParticipation[] {
        const stmt = this.db.prepare(`
            SELECT * FROM executive_participations 
            WHERE executiveId = ? 
            ORDER BY status ASC, startDate DESC
        `);
        const rows = stmt.all(executiveId) as any[];
        return rows.map(row => this.mapRowToParticipation(row));
    }

    /**
     * Lista participações ativas de um executivo
     */
    findActiveByExecutive(executiveId: string): IExecutiveParticipation[] {
        const stmt = this.db.prepare(`
            SELECT * FROM executive_participations 
            WHERE executiveId = ? AND status = ?
            ORDER BY startDate DESC
        `);
        const rows = stmt.all(executiveId, ParticipationStatus.ACTIVE) as any[];
        return rows.map(row => this.mapRowToParticipation(row));
    }

    /**
     * Lista participações de uma empresa
     */
    findByCompany(companyId: string): IExecutiveParticipation[] {
        const stmt = this.db.prepare(`
            SELECT * FROM executive_participations 
            WHERE companyId = ? 
            ORDER BY role ASC, startDate DESC
        `);
        const rows = stmt.all(companyId) as any[];
        return rows.map(row => this.mapRowToParticipation(row));
    }

    /**
     * Lista executivos ativos de uma empresa
     */
    findActiveByCompany(companyId: string): IExecutiveParticipation[] {
        const stmt = this.db.prepare(`
            SELECT * FROM executive_participations 
            WHERE companyId = ? AND status = ?
            ORDER BY role ASC
        `);
        const rows = stmt.all(companyId, ParticipationStatus.ACTIVE) as any[];
        return rows.map(row => this.mapRowToParticipation(row));
    }

    /**
     * Busca participações por tipo de cargo
     */
    findByRole(role: ExecutiveRole): IExecutiveParticipation[] {
        const stmt = this.db.prepare('SELECT * FROM executive_participations WHERE role = ?');
        const rows = stmt.all(role) as any[];
        return rows.map(row => this.mapRowToParticipation(row));
    }

    /**
     * Verifica se executivo tem acesso a empresa
     */
    hasAccessToCompany(executiveId: string, companyId: string): boolean {
        const stmt = this.db.prepare(`
            SELECT COUNT(*) as count 
            FROM executive_participations 
            WHERE executiveId = ? AND companyId = ? AND status = ?
        `);
        const result = stmt.get(executiveId, companyId, ParticipationStatus.ACTIVE) as any;
        return result.count > 0;
    }

    /**
     * Atualiza participação
     */
    update(id: string, data: IUpdateParticipation): IExecutiveParticipation | null {
        const current = this.findById(id);
        if (!current) return null;

        const fields: string[] = [];
        const values: any[] = [];

        // Campos simples
        const simpleFields = [
            'role', 'status', 'equityPercentage', 'sharesOwned', 'salary', 
            'bonusStructure', 'startDate', 'endDate', 'notes'
        ];

        simpleFields.forEach(field => {
            if (data[field as keyof IUpdateParticipation] !== undefined) {
                fields.push(`${field} = ?`);
                values.push(data[field as keyof IUpdateParticipation]);
            }
        });

        // Campos booleanos
        const boolFields = [
            'hasFullAccess', 'canViewFinancials', 'canViewEmployees', 
            'canViewAssets', 'canMakeDecisions'
        ];

        boolFields.forEach(field => {
            if (data[field as keyof IUpdateParticipation] !== undefined) {
                fields.push(`${field} = ?`);
                values.push(data[field as keyof IUpdateParticipation] ? 1 : 0);
            }
        });

        if (fields.length === 0) return current;

        fields.push('updatedAt = ?');
        values.push(new Date().toISOString());
        values.push(id);

        const query = `UPDATE executive_participations SET ${fields.join(', ')} WHERE id = ?`;
        const stmt = this.db.prepare(query);
        stmt.run(...values);

        return this.findById(id);
    }

    /**
     * Deleta participação
     */
    delete(id: string): boolean {
        const stmt = this.db.prepare('DELETE FROM executive_participations WHERE id = ?');
        const result = stmt.run(id);
        return result.changes > 0;
    }

    /**
     * Deleta todas as participações de um executivo
     */
    deleteByExecutive(executiveId: string): boolean {
        const stmt = this.db.prepare('DELETE FROM executive_participations WHERE executiveId = ?');
        const result = stmt.run(executiveId);
        return result.changes > 0;
    }

    /**
     * Deleta todas as participações de uma empresa
     */
    deleteByCompany(companyId: string): boolean {
        const stmt = this.db.prepare('DELETE FROM executive_participations WHERE companyId = ?');
        const result = stmt.run(companyId);
        return result.changes > 0;
    }

    /**
     * Conta empresas de um executivo
     */
    countCompaniesByExecutive(executiveId: string): number {
        const stmt = this.db.prepare(`
            SELECT COUNT(DISTINCT companyId) as count 
            FROM executive_participations 
            WHERE executiveId = ? AND status = ?
        `);
        const result = stmt.get(executiveId, ParticipationStatus.ACTIVE) as any;
        return result.count;
    }

    /**
     * Mapeia linha do banco para Participation
     */
    private mapRowToParticipation(row: any): IExecutiveParticipation {
        return {
            id: row.id,
            executiveId: row.executiveId,
            companyId: row.companyId,
            companyName: row.companyName,
            role: row.role as ExecutiveRole,
            status: row.status as ParticipationStatus,
            equityPercentage: row.equityPercentage,
            sharesOwned: row.sharesOwned,
            salary: row.salary,
            bonusStructure: row.bonusStructure,
            startDate: row.startDate,
            endDate: row.endDate,
            hasFullAccess: row.hasFullAccess === 1,
            canViewFinancials: row.canViewFinancials === 1,
            canViewEmployees: row.canViewEmployees === 1,
            canViewAssets: row.canViewAssets === 1,
            canMakeDecisions: row.canMakeDecisions === 1,
            notes: row.notes,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt
        };
    }
}
