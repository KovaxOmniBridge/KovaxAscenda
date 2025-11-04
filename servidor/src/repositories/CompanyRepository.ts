import { ICompany, IAddress, IContact, IPartner } from '../interfaces';
import DatabaseService from '../database/DatabaseService';
import { randomUUID } from 'crypto';

// Interface para o repositório
export interface ICompanyRepository {
    findAll(): Promise<ICompany[]>;
    findById(id: string): Promise<ICompany | null>;
    findByCnpj(cnpj: string): Promise<ICompany | null>;
    create(company: Omit<ICompany, 'id' | 'createdAt' | 'updatedAt'>): Promise<ICompany>;
    update(id: string, company: Partial<ICompany>): Promise<ICompany | null>;
    delete(id: string): Promise<boolean>;
}

// Implementação com SQLite
class CompanyRepository implements ICompanyRepository {
    private db = DatabaseService.getConnection();

    private rowToCompany(row: any): ICompany {
        const company: ICompany = {
            id: row.id,
            cnpj: row.cnpj,
            razaoSocial: row.razaoSocial,
            nomeFantasia: row.nomeFantasia,
            porte: row.porte,
            regimeTributario: row.regimeTributario,
            situacaoCadastral: row.situacaoCadastral,
            dataAbertura: row.dataAbertura ? new Date(row.dataAbertura) : undefined,
            endereco: {
                cep: row.endereco_cep,
                logradouro: row.endereco_logradouro,
                numero: row.endereco_numero,
                complemento: row.endereco_complemento,
                bairro: row.endereco_bairro,
                cidade: row.endereco_cidade,
                estado: row.endereco_estado,
                pais: row.endereco_pais
            },
            createdAt: new Date(row.createdAt),
            updatedAt: new Date(row.updatedAt)
        };

        // Buscar contatos
        const contacts = this.db.prepare('SELECT * FROM contacts WHERE companyId = ?').all(row.id);
        if (contacts && contacts.length > 0) {
            company.contatos = contacts.map((c: any) => ({
                tipo: c.tipo,
                valor: c.valor,
                principal: c.principal === 1
            }));
        }

        // Buscar sócios
        const partners = this.db.prepare('SELECT * FROM partners WHERE companyId = ?').all(row.id);
        if (partners && partners.length > 0) {
            company.socios = partners.map((p: any) => ({
                nome: p.nome,
                cpf: p.cpf,
                qualificacao: p.qualificacao,
                dataEntrada: new Date(p.dataEntrada)
            }));
        }

        return company;
    }

    async findAll(): Promise<ICompany[]> {
        const rows = this.db.prepare('SELECT * FROM companies ORDER BY nomeFantasia').all();
        return rows.map(row => this.rowToCompany(row));
    }

    async findById(id: string): Promise<ICompany | null> {
        const row = this.db.prepare('SELECT * FROM companies WHERE id = ?').get(id);
        return row ? this.rowToCompany(row) : null;
    }

    async findByCnpj(cnpj: string): Promise<ICompany | null> {
        const row = this.db.prepare('SELECT * FROM companies WHERE cnpj = ?').get(cnpj);
        return row ? this.rowToCompany(row) : null;
    }

    async create(companyData: Omit<ICompany, 'id' | 'createdAt' | 'updatedAt'>): Promise<ICompany> {
        const id = randomUUID();
        const now = new Date().toISOString();

        const insert = this.db.prepare(`
            INSERT INTO companies (
                id, cnpj, razaoSocial, nomeFantasia, porte, regimeTributario, situacaoCadastral,
                dataAbertura, endereco_cep, endereco_logradouro, endereco_numero, endereco_complemento,
                endereco_bairro, endereco_cidade, endereco_estado, endereco_pais, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        insert.run(
            id,
            companyData.cnpj,
            companyData.razaoSocial,
            companyData.nomeFantasia,
            companyData.porte,
            companyData.regimeTributario,
            companyData.situacaoCadastral,
            companyData.dataAbertura ? companyData.dataAbertura.toISOString() : null,
            companyData.endereco.cep,
            companyData.endereco.logradouro,
            companyData.endereco.numero,
            companyData.endereco.complemento,
            companyData.endereco.bairro,
            companyData.endereco.cidade,
            companyData.endereco.estado,
            companyData.endereco.pais,
            now,
            now
        );

        // Inserir contatos se existirem
        if (companyData.contatos && companyData.contatos.length > 0) {
            const insertContact = this.db.prepare(`
                INSERT INTO contacts (id, tipo, valor, principal, companyId, createdAt)
                VALUES (?, ?, ?, ?, ?, ?)
            `);

            for (const contact of companyData.contatos) {
                insertContact.run(
                    randomUUID(),
                    contact.tipo,
                    contact.valor,
                    contact.principal ? 1 : 0,
                    id,
                    now
                );
            }
        }

        // Inserir sócios se existirem
        if (companyData.socios && companyData.socios.length > 0) {
            const insertPartner = this.db.prepare(`
                INSERT INTO partners (id, nome, cpf, qualificacao, dataEntrada, companyId, createdAt)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `);

            for (const partner of companyData.socios) {
                insertPartner.run(
                    randomUUID(),
                    partner.nome,
                    partner.cpf,
                    partner.qualificacao,
                    partner.dataEntrada.toISOString(),
                    id,
                    now
                );
            }
        }

        return (await this.findById(id))!;
    }

    async update(id: string, companyData: Partial<ICompany>): Promise<ICompany | null> {
        const existing = await this.findById(id);
        if (!existing) return null;

        const now = new Date().toISOString();
        const fields: string[] = [];
        const values: any[] = [];

        if (companyData.cnpj !== undefined) {
            fields.push('cnpj = ?');
            values.push(companyData.cnpj);
        }
        if (companyData.razaoSocial !== undefined) {
            fields.push('razaoSocial = ?');
            values.push(companyData.razaoSocial);
        }
        if (companyData.nomeFantasia !== undefined) {
            fields.push('nomeFantasia = ?');
            values.push(companyData.nomeFantasia);
        }
        if (companyData.porte !== undefined) {
            fields.push('porte = ?');
            values.push(companyData.porte);
        }
        if (companyData.regimeTributario !== undefined) {
            fields.push('regimeTributario = ?');
            values.push(companyData.regimeTributario);
        }
        if (companyData.situacaoCadastral !== undefined) {
            fields.push('situacaoCadastral = ?');
            values.push(companyData.situacaoCadastral);
        }
        if (companyData.dataAbertura !== undefined) {
            fields.push('dataAbertura = ?');
            values.push(companyData.dataAbertura?.toISOString());
        }

        // Atualizar endereço se fornecido
        if (companyData.endereco) {
            if (companyData.endereco.cep !== undefined) {
                fields.push('endereco_cep = ?');
                values.push(companyData.endereco.cep);
            }
            if (companyData.endereco.logradouro !== undefined) {
                fields.push('endereco_logradouro = ?');
                values.push(companyData.endereco.logradouro);
            }
            if (companyData.endereco.numero !== undefined) {
                fields.push('endereco_numero = ?');
                values.push(companyData.endereco.numero);
            }
            if (companyData.endereco.complemento !== undefined) {
                fields.push('endereco_complemento = ?');
                values.push(companyData.endereco.complemento);
            }
            if (companyData.endereco.bairro !== undefined) {
                fields.push('endereco_bairro = ?');
                values.push(companyData.endereco.bairro);
            }
            if (companyData.endereco.cidade !== undefined) {
                fields.push('endereco_cidade = ?');
                values.push(companyData.endereco.cidade);
            }
            if (companyData.endereco.estado !== undefined) {
                fields.push('endereco_estado = ?');
                values.push(companyData.endereco.estado);
            }
            if (companyData.endereco.pais !== undefined) {
                fields.push('endereco_pais = ?');
                values.push(companyData.endereco.pais);
            }
        }

        fields.push('updatedAt = ?');
        values.push(now);
        values.push(id);

        if (fields.length > 1) { // > 1 porque sempre tem updatedAt
            const update = this.db.prepare(`
                UPDATE companies SET ${fields.join(', ')} WHERE id = ?
            `);
            update.run(...values);
        }

        return await this.findById(id);
    }

    async delete(id: string): Promise<boolean> {
        const result = this.db.prepare('DELETE FROM companies WHERE id = ?').run(id);
        return result.changes > 0;
    }
}

export default new CompanyRepository();
