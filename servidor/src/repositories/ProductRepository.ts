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
                code TEXT,
                category TEXT NOT NULL,
                description TEXT,
                price REAL NOT NULL,
                cost REAL,
                stock INTEGER NOT NULL,
                minStock INTEGER,
                unit TEXT NOT NULL,
                status TEXT NOT NULL,
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
    }

    create(companyId: string, data: ICreateProduct): IProduct {
        const id = uuidv4();
        const now = new Date().toISOString();

        const stmt = this.db.prepare(`
            INSERT INTO products (
                id, companyId, name, code, category, description,
                price, cost, stock, minStock, unit, status,
                createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            id,
            companyId,
            data.name,
            data.code || null,
            data.category,
            data.description || null,
            data.price,
            data.cost || null,
            data.stock,
            data.minStock || null,
            data.unit,
            data.status,
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
        const stmt = this.db.prepare(`
            SELECT * FROM products 
            WHERE companyId = ? AND stock <= minStock
            ORDER BY stock ASC
        `);

        const rows = stmt.all(companyId) as any[];
        return rows.map(row => this.mapRowToProduct(row));
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
        if (data.cost !== undefined) {
            updates.push('cost = ?');
            values.push(data.cost);
        }
        if (data.stock !== undefined) {
            updates.push('stock = ?');
            values.push(data.stock);
        }
        if (data.minStock !== undefined) {
            updates.push('minStock = ?');
            values.push(data.minStock);
        }
        if (data.unit !== undefined) {
            updates.push('unit = ?');
            values.push(data.unit);
        }
        if (data.status !== undefined) {
            updates.push('status = ?');
            values.push(data.status);
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
            code: row.code,
            category: row.category,
            description: row.description,
            price: row.price,
            cost: row.cost,
            stock: row.stock,
            minStock: row.minStock,
            unit: row.unit,
            status: row.status,
            createdAt: new Date(row.createdAt),
            updatedAt: new Date(row.updatedAt)
        };
    }
}
