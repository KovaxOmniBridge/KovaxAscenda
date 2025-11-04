import Database from 'better-sqlite3';
import DatabaseService from '../database/DatabaseService';
import { IService, ICreateService, IUpdateService } from '../interfaces/IService';
import { v4 as uuidv4 } from 'uuid';

export class ServiceRepository {
    private db: Database.Database;

    constructor() {
        this.db = DatabaseService.getConnection();
        this.initializeTable();
    }

    private initializeTable(): void {
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS services (
                id TEXT PRIMARY KEY,
                companyId TEXT NOT NULL,
                name TEXT NOT NULL,
                code TEXT,
                category TEXT NOT NULL,
                description TEXT,
                price REAL NOT NULL,
                duration REAL,
                status TEXT NOT NULL,
                createdAt TEXT NOT NULL,
                updatedAt TEXT NOT NULL,
                FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE CASCADE
            )
        `;

        this.db.exec(createTableSQL);

        // Create indexes for better performance
        this.db.exec(`CREATE INDEX IF NOT EXISTS idx_services_companyId ON services(companyId)`);
        this.db.exec(`CREATE INDEX IF NOT EXISTS idx_services_category ON services(category)`);
        this.db.exec(`CREATE INDEX IF NOT EXISTS idx_services_status ON services(status)`);
    }

    create(companyId: string, data: ICreateService): IService {
        const id = uuidv4();
        const now = new Date().toISOString();

        const stmt = this.db.prepare(`
            INSERT INTO services (
                id, companyId, name, code, category, description,
                price, duration, status, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            id,
            companyId,
            data.name,
            data.code || null,
            data.category,
            data.description || null,
            data.price,
            data.duration || null,
            data.status,
            now,
            now
        );

        return this.findById(companyId, id)!;
    }

    findById(companyId: string, id: string): IService | null {
        const stmt = this.db.prepare(`
            SELECT * FROM services 
            WHERE id = ? AND companyId = ?
        `);

        const row = stmt.get(id, companyId) as any;
        return row ? this.mapRowToService(row) : null;
    }

    findAll(companyId: string): IService[] {
        const stmt = this.db.prepare(`
            SELECT * FROM services 
            WHERE companyId = ?
            ORDER BY name ASC
        `);

        const rows = stmt.all(companyId) as any[];
        return rows.map(row => this.mapRowToService(row));
    }

    findByCategory(companyId: string, category: string): IService[] {
        const stmt = this.db.prepare(`
            SELECT * FROM services 
            WHERE companyId = ? AND category = ?
            ORDER BY name ASC
        `);

        const rows = stmt.all(companyId, category) as any[];
        return rows.map(row => this.mapRowToService(row));
    }

    findByStatus(companyId: string, status: string): IService[] {
        const stmt = this.db.prepare(`
            SELECT * FROM services 
            WHERE companyId = ? AND status = ?
            ORDER BY name ASC
        `);

        const rows = stmt.all(companyId, status) as any[];
        return rows.map(row => this.mapRowToService(row));
    }

    update(companyId: string, id: string, data: IUpdateService): IService | null {
        const service = this.findById(companyId, id);
        if (!service) return null;

        const updates: string[] = [];
        const values: any[] = [];

        if (data.name !== undefined) {
            updates.push('name = ?');
            values.push(data.name);
        }
        if (data.code !== undefined) {
            updates.push('code = ?');
            values.push(data.code);
        }
        if (data.category !== undefined) {
            updates.push('category = ?');
            values.push(data.category);
        }
        if (data.description !== undefined) {
            updates.push('description = ?');
            values.push(data.description);
        }
        if (data.price !== undefined) {
            updates.push('price = ?');
            values.push(data.price);
        }
        if (data.duration !== undefined) {
            updates.push('duration = ?');
            values.push(data.duration);
        }
        if (data.status !== undefined) {
            updates.push('status = ?');
            values.push(data.status);
        }

        updates.push('updatedAt = ?');
        values.push(new Date().toISOString());

        values.push(id, companyId);

        const stmt = this.db.prepare(`
            UPDATE services 
            SET ${updates.join(', ')}
            WHERE id = ? AND companyId = ?
        `);

        stmt.run(...values);
        return this.findById(companyId, id);
    }

    delete(companyId: string, id: string): boolean {
        const stmt = this.db.prepare(`
            DELETE FROM services 
            WHERE id = ? AND companyId = ?
        `);

        const result = stmt.run(id, companyId);
        return result.changes > 0;
    }

    private mapRowToService(row: any): IService {
        return {
            id: row.id,
            companyId: row.companyId,
            name: row.name,
            code: row.code,
            category: row.category,
            description: row.description,
            price: row.price,
            duration: row.duration,
            status: row.status,
            createdAt: new Date(row.createdAt),
            updatedAt: new Date(row.updatedAt)
        };
    }
}
