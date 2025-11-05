import Database from 'better-sqlite3';
import DatabaseService from '../database/DatabaseService';
import { IPhysicalUnit, ICreatePhysicalUnit, IUpdatePhysicalUnit, PhysicalUnitType, PhysicalUnitStatus } from '../interfaces/IPhysicalUnit';
import { v4 as uuidv4 } from 'uuid';

export class PhysicalUnitRepository {
    private db: Database.Database;

    constructor() {
        this.db = DatabaseService.getConnection();
        this.initializeTables();
    }

    private initializeTables(): void {
        const createUnitsTableSQL = `
            CREATE TABLE IF NOT EXISTS physical_units (
                id TEXT PRIMARY KEY,
                companyId TEXT NOT NULL,
                assetId TEXT,
                type TEXT NOT NULL,
                name TEXT NOT NULL,
                code TEXT,
                description TEXT,
                status TEXT NOT NULL,
                openingDate TEXT,
                closingDate TEXT,
                address TEXT NOT NULL,
                city TEXT NOT NULL,
                state TEXT NOT NULL,
                zipCode TEXT NOT NULL,
                country TEXT NOT NULL,
                latitude REAL,
                longitude REAL,
                neighborhood TEXT,
                contact TEXT,
                operatingHours TEXT,
                area REAL,
                capacity INTEGER,
                parkingSpaces INTEGER,
                hasAccessibility INTEGER DEFAULT 0,
                hasWifi INTEGER DEFAULT 0,
                hasAirConditioning INTEGER DEFAULT 0,
                hasSecuritySystem INTEGER DEFAULT 0,
                employees TEXT,
                totalEmployees INTEGER DEFAULT 0,
                managerId TEXT,
                inventory TEXT,
                totalInventoryValue REAL,
                equipment TEXT,
                monthlyRent REAL,
                monthlyUtilities REAL,
                monthlyOtherExpenses REAL,
                totalMonthlyOperatingCost REAL,
                currentGoals TEXT,
                performanceHistory TEXT,
                photos TEXT,
                notes TEXT,
                tags TEXT,
                isActive INTEGER NOT NULL DEFAULT 1,
                createdAt TEXT NOT NULL,
                updatedAt TEXT NOT NULL,
                FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE CASCADE,
                FOREIGN KEY (assetId) REFERENCES assets(id) ON DELETE SET NULL
            )
        `;

        this.db.exec(createUnitsTableSQL);

        // Criar índices
        this.db.exec(`CREATE INDEX IF NOT EXISTS idx_physical_units_companyId ON physical_units(companyId)`);
        this.db.exec(`CREATE INDEX IF NOT EXISTS idx_physical_units_type ON physical_units(type)`);
        this.db.exec(`CREATE INDEX IF NOT EXISTS idx_physical_units_status ON physical_units(status)`);
        this.db.exec(`CREATE INDEX IF NOT EXISTS idx_physical_units_isActive ON physical_units(isActive)`);
        this.db.exec(`CREATE INDEX IF NOT EXISTS idx_physical_units_city ON physical_units(city)`);
    }

    create(data: ICreatePhysicalUnit): IPhysicalUnit {
        const id = uuidv4();
        const now = new Date().toISOString();

        // Calcular custo operacional total
        const totalOperatingCost = (data.monthlyRent || 0) + 
                                   (data.monthlyUtilities || 0) + 
                                   (data.monthlyOtherExpenses || 0);

        const stmt = this.db.prepare(`
            INSERT INTO physical_units (
                id, companyId, assetId, type, name, code, description, status, openingDate,
                address, city, state, zipCode, country, latitude, longitude, neighborhood,
                contact, operatingHours, area, capacity, parkingSpaces, hasAccessibility,
                hasWifi, hasAirConditioning, hasSecuritySystem, totalEmployees, monthlyRent,
                monthlyUtilities, monthlyOtherExpenses, totalMonthlyOperatingCost,
                notes, tags, isActive, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            id,
            data.companyId,
            data.assetId || null,
            data.type,
            data.name,
            data.code || null,
            data.description || null,
            data.status,
            data.openingDate || null,
            data.address,
            data.city,
            data.state,
            data.zipCode,
            data.country,
            data.latitude || null,
            data.longitude || null,
            data.neighborhood || null,
            data.contact ? JSON.stringify(data.contact) : null,
            data.operatingHours ? JSON.stringify(data.operatingHours) : null,
            data.area || null,
            data.capacity || null,
            data.parkingSpaces || null,
            data.hasAccessibility ? 1 : 0,
            data.hasWifi ? 1 : 0,
            data.hasAirConditioning ? 1 : 0,
            data.hasSecuritySystem ? 1 : 0,
            0, // totalEmployees inicia em 0
            data.monthlyRent || null,
            data.monthlyUtilities || null,
            data.monthlyOtherExpenses || null,
            totalOperatingCost,
            data.notes || null,
            data.tags ? JSON.stringify(data.tags) : null,
            data.isActive !== undefined ? (data.isActive ? 1 : 0) : 1,
            now,
            now
        );

        return this.findById(id)!;
    }

    findById(id: string): IPhysicalUnit | undefined {
        const stmt = this.db.prepare('SELECT * FROM physical_units WHERE id = ?');
        const row = stmt.get(id);
        return row ? this.mapRowToUnit(row) : undefined;
    }

    findAll(): IPhysicalUnit[] {
        const stmt = this.db.prepare('SELECT * FROM physical_units ORDER BY createdAt DESC');
        const rows = stmt.all();
        return rows.map(row => this.mapRowToUnit(row));
    }

    findByCompanyId(companyId: string): IPhysicalUnit[] {
        const stmt = this.db.prepare('SELECT * FROM physical_units WHERE companyId = ? ORDER BY name');
        const rows = stmt.all(companyId);
        return rows.map(row => this.mapRowToUnit(row));
    }

    findByType(type: PhysicalUnitType, companyId?: string): IPhysicalUnit[] {
        let sql = 'SELECT * FROM physical_units WHERE type = ?';
        const params: any[] = [type];

        if (companyId) {
            sql += ' AND companyId = ?';
            params.push(companyId);
        }

        sql += ' ORDER BY name';

        const stmt = this.db.prepare(sql);
        const rows = stmt.all(...params);
        return rows.map(row => this.mapRowToUnit(row));
    }

    findByCity(city: string, companyId?: string): IPhysicalUnit[] {
        let sql = 'SELECT * FROM physical_units WHERE city = ?';
        const params: any[] = [city];

        if (companyId) {
            sql += ' AND companyId = ?';
            params.push(companyId);
        }

        sql += ' ORDER BY name';

        const stmt = this.db.prepare(sql);
        const rows = stmt.all(...params);
        return rows.map(row => this.mapRowToUnit(row));
    }

    update(id: string, data: IUpdatePhysicalUnit): IPhysicalUnit {
        const existing = this.findById(id);
        if (!existing) {
            throw new Error('Unidade não encontrada');
        }

        const now = new Date().toISOString();
        const updates: string[] = [];
        const values: any[] = [];

        // Lista de campos simples
        const simpleFields = [
            'type', 'name', 'code', 'description', 'status', 'openingDate', 'closingDate',
            'address', 'city', 'state', 'zipCode', 'country', 'latitude', 'longitude',
            'neighborhood', 'area', 'capacity', 'parkingSpaces', 'managerId',
            'totalInventoryValue', 'monthlyRent', 'monthlyUtilities', 'monthlyOtherExpenses',
            'notes'
        ];

        simpleFields.forEach(field => {
            if (data[field as keyof IUpdatePhysicalUnit] !== undefined) {
                updates.push(`${field} = ?`);
                values.push(data[field as keyof IUpdatePhysicalUnit]);
            }
        });

        // Campos booleanos
        const boolFields = ['hasAccessibility', 'hasWifi', 'hasAirConditioning', 'hasSecuritySystem', 'isActive'];
        boolFields.forEach(field => {
            if (data[field as keyof IUpdatePhysicalUnit] !== undefined) {
                updates.push(`${field} = ?`);
                values.push(data[field as keyof IUpdatePhysicalUnit] ? 1 : 0);
            }
        });

        // Campos JSON
        if (data.contact !== undefined) {
            updates.push('contact = ?');
            values.push(JSON.stringify(data.contact));
        }
        if (data.operatingHours !== undefined) {
            updates.push('operatingHours = ?');
            values.push(JSON.stringify(data.operatingHours));
        }
        if (data.tags !== undefined) {
            updates.push('tags = ?');
            values.push(JSON.stringify(data.tags));
        }

        // Recalcular custo operacional total se algum custo mudou
        if (data.monthlyRent !== undefined || data.monthlyUtilities !== undefined || data.monthlyOtherExpenses !== undefined) {
            const totalOperatingCost = (data.monthlyRent ?? existing.monthlyRent ?? 0) + 
                                       (data.monthlyUtilities ?? existing.monthlyUtilities ?? 0) + 
                                       (data.monthlyOtherExpenses ?? existing.monthlyOtherExpenses ?? 0);
            updates.push('totalMonthlyOperatingCost = ?');
            values.push(totalOperatingCost);
        }

        if (updates.length === 0) {
            return existing;
        }

        updates.push('updatedAt = ?');
        values.push(now);
        values.push(id);

        const sql = `UPDATE physical_units SET ${updates.join(', ')} WHERE id = ?`;
        const stmt = this.db.prepare(sql);
        stmt.run(...values);

        return this.findById(id)!;
    }

    delete(id: string): void {
        const stmt = this.db.prepare('DELETE FROM physical_units WHERE id = ?');
        stmt.run(id);
    }

    // Métodos auxiliares para gerenciar funcionários
    addEmployee(unitId: string, employee: any): IPhysicalUnit {
        const unit = this.findById(unitId);
        if (!unit) throw new Error('Unidade não encontrada');

        const employees = unit.employees || [];
        employees.push({
            id: uuidv4(),
            ...employee,
            hireDate: employee.hireDate || new Date().toISOString()
        });

        const stmt = this.db.prepare('UPDATE physical_units SET employees = ?, totalEmployees = ?, updatedAt = ? WHERE id = ?');
        stmt.run(JSON.stringify(employees), employees.length, new Date().toISOString(), unitId);

        return this.findById(unitId)!;
    }

    removeEmployee(unitId: string, employeeId: string): IPhysicalUnit {
        const unit = this.findById(unitId);
        if (!unit) throw new Error('Unidade não encontrada');

        const employees = (unit.employees || []).filter(emp => emp.id !== employeeId);

        const stmt = this.db.prepare('UPDATE physical_units SET employees = ?, totalEmployees = ?, updatedAt = ? WHERE id = ?');
        stmt.run(JSON.stringify(employees), employees.length, new Date().toISOString(), unitId);

        return this.findById(unitId)!;
    }

    private mapRowToUnit(row: any): IPhysicalUnit {
        return {
            id: row.id,
            companyId: row.companyId,
            assetId: row.assetId,
            type: row.type,
            name: row.name,
            code: row.code,
            description: row.description,
            status: row.status,
            openingDate: row.openingDate,
            closingDate: row.closingDate,
            address: row.address,
            city: row.city,
            state: row.state,
            zipCode: row.zipCode,
            country: row.country,
            latitude: row.latitude,
            longitude: row.longitude,
            neighborhood: row.neighborhood,
            contact: row.contact ? JSON.parse(row.contact) : undefined,
            operatingHours: row.operatingHours ? JSON.parse(row.operatingHours) : undefined,
            area: row.area,
            capacity: row.capacity,
            parkingSpaces: row.parkingSpaces,
            hasAccessibility: row.hasAccessibility === 1,
            hasWifi: row.hasWifi === 1,
            hasAirConditioning: row.hasAirConditioning === 1,
            hasSecuritySystem: row.hasSecuritySystem === 1,
            employees: row.employees ? JSON.parse(row.employees) : undefined,
            totalEmployees: row.totalEmployees,
            managerId: row.managerId,
            inventory: row.inventory ? JSON.parse(row.inventory) : undefined,
            totalInventoryValue: row.totalInventoryValue,
            equipment: row.equipment ? JSON.parse(row.equipment) : undefined,
            monthlyRent: row.monthlyRent,
            monthlyUtilities: row.monthlyUtilities,
            monthlyOtherExpenses: row.monthlyOtherExpenses,
            totalMonthlyOperatingCost: row.totalMonthlyOperatingCost,
            currentGoals: row.currentGoals ? JSON.parse(row.currentGoals) : undefined,
            performanceHistory: row.performanceHistory ? JSON.parse(row.performanceHistory) : undefined,
            photos: row.photos ? JSON.parse(row.photos) : undefined,
            notes: row.notes,
            tags: row.tags ? JSON.parse(row.tags) : undefined,
            isActive: row.isActive === 1,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt
        };
    }
}
