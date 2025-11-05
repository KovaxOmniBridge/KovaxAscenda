import Database from 'better-sqlite3';
import DatabaseService from '../database/DatabaseService';
import { IAsset, ICreateAsset, IUpdateAsset, AssetType, AssetStatus, OwnershipType } from '../interfaces/IAsset';
import { v4 as uuidv4 } from 'uuid';

export class AssetRepository {
    private db: Database.Database;

    constructor() {
        this.db = DatabaseService.getConnection();
        this.initializeTables();
    }

    private initializeTables(): void {
        const createAssetsTableSQL = `
            CREATE TABLE IF NOT EXISTS assets (
                id TEXT PRIMARY KEY,
                companyId TEXT NOT NULL,
                type TEXT NOT NULL,
                name TEXT NOT NULL,
                description TEXT,
                purchaseValue REAL,
                currentValue REAL,
                estimatedValue REAL,
                purchaseDate TEXT,
                warrantyExpiryDate TEXT,
                status TEXT NOT NULL,
                ownershipType TEXT NOT NULL,
                location TEXT,
                area REAL,
                capacity INTEGER,
                rooms INTEGER,
                floors INTEGER,
                parkingSpaces INTEGER,
                brand TEXT,
                model TEXT,
                year INTEGER,
                serialNumber TEXT,
                licensePlate TEXT,
                documents TEXT,
                photos TEXT,
                expenses TEXT,
                monthlyExpense REAL,
                notes TEXT,
                tags TEXT,
                isActive INTEGER NOT NULL DEFAULT 1,
                createdAt TEXT NOT NULL,
                updatedAt TEXT NOT NULL,
                FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE CASCADE
            )
        `;

        this.db.exec(createAssetsTableSQL);

        // Criar índices
        this.db.exec(`CREATE INDEX IF NOT EXISTS idx_assets_companyId ON assets(companyId)`);
        this.db.exec(`CREATE INDEX IF NOT EXISTS idx_assets_type ON assets(type)`);
        this.db.exec(`CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(status)`);
        this.db.exec(`CREATE INDEX IF NOT EXISTS idx_assets_isActive ON assets(isActive)`);
    }

    create(data: ICreateAsset): IAsset {
        const id = uuidv4();
        const now = new Date().toISOString();

        const stmt = this.db.prepare(`
            INSERT INTO assets (
                id, companyId, type, name, description, purchaseValue, currentValue, estimatedValue,
                purchaseDate, warrantyExpiryDate, status, ownershipType, location, area, capacity,
                rooms, floors, parkingSpaces, brand, model, year, serialNumber, licensePlate,
                documents, photos, expenses, monthlyExpense, notes, tags, isActive, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            id,
            data.companyId,
            data.type,
            data.name,
            data.description || null,
            data.purchaseValue || null,
            data.currentValue || null,
            data.estimatedValue || null,
            data.purchaseDate || null,
            data.warrantyExpiryDate || null,
            data.status,
            data.ownershipType,
            data.location ? JSON.stringify(data.location) : null,
            data.area || null,
            data.capacity || null,
            data.rooms || null,
            data.floors || null,
            data.parkingSpaces || null,
            data.brand || null,
            data.model || null,
            data.year || null,
            data.serialNumber || null,
            data.licensePlate || null,
            data.documents ? JSON.stringify(data.documents) : null,
            data.photos ? JSON.stringify(data.photos) : null,
            data.expenses ? JSON.stringify(data.expenses) : null,
            data.monthlyExpense || null,
            data.notes || null,
            data.tags ? JSON.stringify(data.tags) : null,
            data.isActive !== undefined ? (data.isActive ? 1 : 0) : 1,
            now,
            now
        );

        return this.findById(id)!;
    }

    findById(id: string): IAsset | undefined {
        const stmt = this.db.prepare('SELECT * FROM assets WHERE id = ?');
        const row = stmt.get(id);
        return row ? this.mapRowToAsset(row) : undefined;
    }

    findAll(): IAsset[] {
        const stmt = this.db.prepare('SELECT * FROM assets ORDER BY createdAt DESC');
        const rows = stmt.all();
        return rows.map(row => this.mapRowToAsset(row));
    }

    findByCompanyId(companyId: string): IAsset[] {
        const stmt = this.db.prepare('SELECT * FROM assets WHERE companyId = ? ORDER BY createdAt DESC');
        const rows = stmt.all(companyId);
        return rows.map(row => this.mapRowToAsset(row));
    }

    findByType(type: AssetType, companyId?: string): IAsset[] {
        let sql = 'SELECT * FROM assets WHERE type = ?';
        const params: any[] = [type];

        if (companyId) {
            sql += ' AND companyId = ?';
            params.push(companyId);
        }

        sql += ' ORDER BY createdAt DESC';

        const stmt = this.db.prepare(sql);
        const rows = stmt.all(...params);
        return rows.map(row => this.mapRowToAsset(row));
    }

    findByStatus(status: AssetStatus, companyId?: string): IAsset[] {
        let sql = 'SELECT * FROM assets WHERE status = ?';
        const params: any[] = [status];

        if (companyId) {
            sql += ' AND companyId = ?';
            params.push(companyId);
        }

        sql += ' ORDER BY createdAt DESC';

        const stmt = this.db.prepare(sql);
        const rows = stmt.all(...params);
        return rows.map(row => this.mapRowToAsset(row));
    }

    update(id: string, data: IUpdateAsset): IAsset {
        const existing = this.findById(id);
        if (!existing) {
            throw new Error('Ativo não encontrado');
        }

        const now = new Date().toISOString();
        const updates: string[] = [];
        const values: any[] = [];

        // Lista de campos que podem ser atualizados
        const fields = [
            'type', 'name', 'description', 'purchaseValue', 'currentValue', 'estimatedValue',
            'purchaseDate', 'warrantyExpiryDate', 'status', 'ownershipType', 'area', 'capacity',
            'rooms', 'floors', 'parkingSpaces', 'brand', 'model', 'year', 'serialNumber',
            'licensePlate', 'monthlyExpense', 'notes', 'isActive'
        ];

        fields.forEach(field => {
            if (data[field as keyof IUpdateAsset] !== undefined) {
                updates.push(`${field} = ?`);
                let value = data[field as keyof IUpdateAsset];
                if (field === 'isActive' && typeof value === 'boolean') {
                    value = value ? 1 : 0;
                }
                values.push(value);
            }
        });

        // Campos JSON
        if (data.location !== undefined) {
            updates.push('location = ?');
            values.push(JSON.stringify(data.location));
        }
        if (data.documents !== undefined) {
            updates.push('documents = ?');
            values.push(JSON.stringify(data.documents));
        }
        if (data.photos !== undefined) {
            updates.push('photos = ?');
            values.push(JSON.stringify(data.photos));
        }
        if (data.expenses !== undefined) {
            updates.push('expenses = ?');
            values.push(JSON.stringify(data.expenses));
        }
        if (data.tags !== undefined) {
            updates.push('tags = ?');
            values.push(JSON.stringify(data.tags));
        }

        if (updates.length === 0) {
            return existing;
        }

        updates.push('updatedAt = ?');
        values.push(now);
        values.push(id);

        const sql = `UPDATE assets SET ${updates.join(', ')} WHERE id = ?`;
        const stmt = this.db.prepare(sql);
        stmt.run(...values);

        return this.findById(id)!;
    }

    delete(id: string): void {
        const stmt = this.db.prepare('DELETE FROM assets WHERE id = ?');
        stmt.run(id);
    }

    private mapRowToAsset(row: any): IAsset {
        return {
            id: row.id,
            companyId: row.companyId,
            type: row.type,
            name: row.name,
            description: row.description,
            purchaseValue: row.purchaseValue,
            currentValue: row.currentValue,
            estimatedValue: row.estimatedValue,
            purchaseDate: row.purchaseDate,
            warrantyExpiryDate: row.warrantyExpiryDate,
            status: row.status,
            ownershipType: row.ownershipType,
            location: row.location ? JSON.parse(row.location) : undefined,
            area: row.area,
            capacity: row.capacity,
            rooms: row.rooms,
            floors: row.floors,
            parkingSpaces: row.parkingSpaces,
            brand: row.brand,
            model: row.model,
            year: row.year,
            serialNumber: row.serialNumber,
            licensePlate: row.licensePlate,
            documents: row.documents ? JSON.parse(row.documents) : undefined,
            photos: row.photos ? JSON.parse(row.photos) : undefined,
            expenses: row.expenses ? JSON.parse(row.expenses) : undefined,
            monthlyExpense: row.monthlyExpense,
            notes: row.notes,
            tags: row.tags ? JSON.parse(row.tags) : undefined,
            isActive: row.isActive === 1,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt
        };
    }
}
