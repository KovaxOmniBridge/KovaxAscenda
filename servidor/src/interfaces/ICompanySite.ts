// ============================================
// COMPANY SITE CONFIGURATION INTERFACE
// ============================================

export interface ISocialLinks {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
}

export interface ISection {
    id: string;
    name: string;
    visible: boolean;
    order: number;
}

export interface ICompanySite {
    id: string;
    companyId: string;
    
    // Theme & Colors
    theme: string; // 'blue', 'green', 'purple', etc.
    primaryColor?: string; // Custom hex color
    secondaryColor?: string;
    accentColor?: string;
    
    // Layout & Style
    heroGradient: string; // 'hero-gradient-1', etc.
    layout: string; // 'modern', 'classic', 'minimal'
    font: string; // 'modern', 'classic', 'playful'
    
    // Images (Base64)
    logo?: string;
    banner?: string;
    favicon?: string;
    
    // Custom Content
    heroTitle?: string;
    heroDescription?: string;
    aboutText?: string;
    
    // Advanced
    customCSS?: string;
    
    // Social & Structure
    socialLinks?: ISocialLinks;
    sections?: ISection[];
    
    // Slug
    slug?: string;
    
    // Status
    isActive: boolean;
    
    // Timestamps
    createdAt: string;
    updatedAt: string;
}

export interface ICreateCompanySite {
    theme?: string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    heroGradient?: string;
    layout?: string;
    font?: string;
    logo?: string;
    banner?: string;
    favicon?: string;
    heroTitle?: string;
    heroDescription?: string;
    aboutText?: string;
    customCSS?: string;
    socialLinks?: ISocialLinks;
    sections?: ISection[];
    slug?: string;
    isActive?: boolean;
}

export interface IUpdateCompanySite extends Partial<ICreateCompanySite> {}
