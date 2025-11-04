import Database from 'better-sqlite3';
import DatabaseService from '../database/DatabaseService';
import { IProduct, ICreateProduct, IUpdateProduct } from '../interfaces/IProduct';
import { v4 as uuidv4 } from 'uuid';

export class ProductRepository {
    private db: Database.Database;

    constructor() {
        this.db = DatabaseService.getConnection();
        this.initializeTable();
    }

    private initializeTable(): void {
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS products (
                id TEXT PRIMARY KEY,
                companyId TEXT NOT NULL,
                name TEXT NOT NULL,
                description TEXT,
                code TEXT,
                barcode TEXT,
                qrcode TEXT,
                category TEXT NOT NULL,
                tags TEXT,
                price REAL NOT NULL,
                status TEXT NOT NULL,
                images TEXT,
                createdAt TEXT NOT NULL,
                updatedAt TEXT NOT NULL,
                FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE CASCADE
            )
        `;

        this.db.exec(createTableSQL);

        // Create indexes for better performance
        this.db.exec(`CREATE INDEX IF NOT EXISTS idx_products_companyId ON products(companyId)`);
        this.db.exec(`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)`);
        this.db.exec(`CREATE INDEX IF NOT EXISTS idx_products_status ON products(status)`);
        this.db.exec(`CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode)`);
    }

    create(companyId: string, data: ICreateProduct): IProduct {
        const id = uuidv4();
        const now = new Date().toISOString();

        const stmt = this.db.prepare(`
            INSERT INTO products (
                id, companyId, name, description, code, barcode, qrcode,
                category, tags, price, status, images,
                createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            id,
            companyId,
            data.name,
            data.description || null,
            data.code || null,
            data.barcode || null,
            data.qrcode || null,
            data.category,
            data.tags ? JSON.stringify(data.tags) : null,
            data.price,
            data.status,
            data.images ? JSON.stringify(data.images) : null,
            now,
            now
        );

        return this.findById(companyId, id)!;
    }

    findById(companyId: string, id: string): IProduct | null {
        const stmt = this.db.prepare(`
            SELECT * FROM products 
            WHERE id = ? AND companyId = ?
        `);

        const row = stmt.get(id, companyId) as any;
        return row ? this.mapRowToProduct(row) : null;
    }

    findAll(companyId: string): IProduct[] {
        const stmt = this.db.prepare(`
            SELECT * FROM products 
            WHERE companyId = ?
            ORDER BY name ASC
        `);

        const rows = stmt.all(companyId) as any[];
        return rows.map(row => this.mapRowToProduct(row));
    }

    findByCategory(companyId: string, category: string): IProduct[] {
        const stmt = this.db.prepare(`
            SELECT * FROM products 
            WHERE companyId = ? AND category = ?
            ORDER BY name ASC
        `);

        const rows = stmt.all(companyId, category) as any[];
        return rows.map(row => this.mapRowToProduct(row));
    }

    findByStatus(companyId: string, status: string): IProduct[] {
        const stmt = this.db.prepare(`
            SELECT * FROM products 
            WHERE companyId = ? AND status = ?
            ORDER BY name ASC
        `);

        const rows = stmt.all(companyId, status) as any[];
        return rows.map(row => this.mapRowToProduct(row));
    }

    findLowStock(companyId: string): IProduct[] {
        // Este método não é mais relevante, mas mantemos para compatibilidade
        return [];
    }

    findByBarcode(companyId: string, barcode: string): IProduct | null {
        const stmt = this.db.prepare(`
            SELECT * FROM products 
            WHERE companyId = ? AND barcode = ?
        `);

        const row = stmt.get(companyId, barcode) as any;
        return row ? this.mapRowToProduct(row) : null;
    }

    update(companyId: string, id: string, data: IUpdateProduct): IProduct | null {
        const product = this.findById(companyId, id);
        if (!product) return null;

        const updates: string[] = [];
        const values: any[] = [];

        if (data.name !== undefined) {
            updates.push('name = ?');
            values.push(data.name);
        }
        if (data.description !== undefined) {
            updates.push('description = ?');
            values.push(data.description);
        }
        if (data.code !== undefined) {
            updates.push('code = ?');
            values.push(data.code);
        }
        if (data.barcode !== undefined) {
            updates.push('barcode = ?');
            values.push(data.barcode);
        }
        if (data.qrcode !== undefined) {
            updates.push('qrcode = ?');
            values.push(data.qrcode);
        }
        if (data.category !== undefined) {
            updates.push('category = ?');
            values.push(data.category);
        }
        if (data.tags !== undefined) {
            updates.push('tags = ?');
            values.push(JSON.stringify(data.tags));
        }
        if (data.price !== undefined) {
            updates.push('price = ?');
            values.push(data.price);
        }
        if (data.status !== undefined) {
            updates.push('status = ?');
            values.push(data.status);
        }
        if (data.images !== undefined) {
            updates.push('images = ?');
            values.push(JSON.stringify(data.images));
        }

        updates.push('updatedAt = ?');
        values.push(new Date().toISOString());

        values.push(id, companyId);

        const stmt = this.db.prepare(`
            UPDATE products 
            SET ${updates.join(', ')}
            WHERE id = ? AND companyId = ?
        `);

        stmt.run(...values);
        return this.findById(companyId, id);
    }

    delete(companyId: string, id: string): boolean {
        const stmt = this.db.prepare(`
            DELETE FROM products 
            WHERE id = ? AND companyId = ?
        `);

        const result = stmt.run(id, companyId);
        return result.changes > 0;
    }

    private mapRowToProduct(row: any): IProduct {
        return {
            id: row.id,
            companyId: row.companyId,
            name: row.name,
            description: row.description,
            code: row.code,
            barcode: row.barcode,
            qrcode: row.qrcode,
            category: row.category,
            tags: row.tags ? JSON.parse(row.tags) : [],
            price: row.price,
            status: row.status,
            images: row.images ? JSON.parse(row.images) : [],
            createdAt: new Date(row.createdAt),
            updatedAt: new Date(row.updatedAt)
        };
    }
}
