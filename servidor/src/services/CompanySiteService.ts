import { CompanySiteRepository } from '../repositories/CompanySiteRepository';
import { ICompanySite, ICreateCompanySite, IUpdateCompanySite } from '../interfaces/ICompanySite';

export class CompanySiteService {
    private siteRepository: CompanySiteRepository;

    constructor() {
        this.siteRepository = new CompanySiteRepository();
    }

    async createSite(companyId: string, data: ICreateCompanySite): Promise<ICompanySite> {
        // Validations
        if (data.slug) {
            const slugPattern = /^[a-z0-9-]+$/;
            if (!slugPattern.test(data.slug)) {
                throw new Error('Slug deve conter apenas letras minúsculas, números e hífens');
            }

            // Check if slug is unique
            const existingSlug = this.siteRepository.findBySlug(data.slug);
            if (existingSlug && existingSlug.companyId !== companyId) {
                throw new Error('Este slug já está em uso por outra empresa');
            }
        }

        // Validate colors (hex format)
        if (data.primaryColor && !this.isValidHexColor(data.primaryColor)) {
            throw new Error('Cor primária inválida. Use formato hex (#RRGGBB)');
        }
        if (data.secondaryColor && !this.isValidHexColor(data.secondaryColor)) {
            throw new Error('Cor secundária inválida. Use formato hex (#RRGGBB)');
        }
        if (data.accentColor && !this.isValidHexColor(data.accentColor)) {
            throw new Error('Cor de destaque inválida. Use formato hex (#RRGGBB)');
        }

        // Validate CSS (basic sanitization)
        if (data.customCSS) {
            data.customCSS = this.sanitizeCSS(data.customCSS);
        }

        // Check if site already exists
        const existing = this.siteRepository.findByCompanyId(companyId);
        if (existing) {
            throw new Error('Esta empresa já possui um site configurado. Use a rota de atualização.');
        }

        return this.siteRepository.create(companyId, data);
    }

    async getSiteByCompanyId(companyId: string): Promise<ICompanySite | null> {
        return this.siteRepository.findByCompanyId(companyId);
    }

    async getSiteBySlug(slug: string): Promise<ICompanySite | null> {
        return this.siteRepository.findBySlug(slug);
    }

    async getAllSites(): Promise<ICompanySite[]> {
        return this.siteRepository.findAll();
    }

    async updateSite(companyId: string, data: IUpdateCompanySite): Promise<ICompanySite> {
        // Validations
        if (data.slug) {
            const slugPattern = /^[a-z0-9-]+$/;
            if (!slugPattern.test(data.slug)) {
                throw new Error('Slug deve conter apenas letras minúsculas, números e hífens');
            }

            // Check if slug is unique
            const existingSlug = this.siteRepository.findBySlug(data.slug);
            if (existingSlug && existingSlug.companyId !== companyId) {
                throw new Error('Este slug já está em uso por outra empresa');
            }
        }

        // Validate colors
        if (data.primaryColor && !this.isValidHexColor(data.primaryColor)) {
            throw new Error('Cor primária inválida. Use formato hex (#RRGGBB)');
        }
        if (data.secondaryColor && !this.isValidHexColor(data.secondaryColor)) {
            throw new Error('Cor secundária inválida. Use formato hex (#RRGGBB)');
        }
        if (data.accentColor && !this.isValidHexColor(data.accentColor)) {
            throw new Error('Cor de destaque inválida. Use formato hex (#RRGGBB)');
        }

        // Sanitize CSS
        if (data.customCSS) {
            data.customCSS = this.sanitizeCSS(data.customCSS);
        }

        return this.siteRepository.update(companyId, data);
    }

    async deleteSite(companyId: string): Promise<void> {
        const site = this.siteRepository.findByCompanyId(companyId);
        
        if (!site) {
            throw new Error('Configurações do site não encontradas');
        }

        this.siteRepository.delete(companyId);
    }

    async createOrUpdate(companyId: string, data: ICreateCompanySite): Promise<ICompanySite> {
        const existing = this.siteRepository.findByCompanyId(companyId);

        if (existing) {
            return this.updateSite(companyId, data);
        } else {
            return this.createSite(companyId, data);
        }
    }

    private isValidHexColor(color: string): boolean {
        const hexPattern = /^#[0-9A-Fa-f]{6}$/;
        return hexPattern.test(color);
    }

    private sanitizeCSS(css: string): string {
        // Remove potentially dangerous CSS
        const dangerous = [
            'javascript:',
            'expression(',
            'import',
            '@import',
            'behavior:',
            '-moz-binding',
            '<script',
            '</script>'
        ];

        let sanitized = css;
        dangerous.forEach(pattern => {
            const regex = new RegExp(pattern, 'gi');
            sanitized = sanitized.replace(regex, '');
        });

        return sanitized;
    }
}
