
// Importações principais: React, helpers de autenticação, chamadas de API e estilos
import React, { useState, useEffect } from 'react';
import ModalCadastro from '../apis/cadastro';
import ModalLogin from '../apis/login';
import './style/portal.css';

// Componente principal da página de entrada
export default function Entrada() {
    // Define o título da página ao carregar
    useEffect(() => {
        document.title = 'Ascenda - Eleve sua Gestão';
    }, []);

    const [modalCadastroOpen, setModalCadastroOpen] = useState(false);
    const [modalLoginOpen, setModalLoginOpen] = useState(false);


    // Renderização da página de entrada
    return (
        <div className="landing">
            {/* Cabeçalho com logo e navegação */}
            <header className="landing-header">
                <div className="container">
                    <nav className="landing-nav">
                        <div className="landing-logo">
                            <div className="landing-logo-icon">🔥</div>
                            <span>Ascenda</span>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Seções com background unificado e bolhas decorativas */}
            <div className="main-bg-section">
                <div className="decorative-bubbles">
                    <div className="decorative-bubble bubble1"></div>
                    <div className="decorative-bubble bubble2"></div>
                    <div className="decorative-bubble bubble3"></div>
                    <div className="decorative-bubble bubble4"></div>
                    <div className="decorative-bubble bubble5"></div>
                    <div className="decorative-bubble bubble6"></div>
                    <div className="decorative-bubble bubble7"></div>
                    <div className="decorative-bubble bubble8"></div>
                    <div className="decorative-bubble bubble9"></div>
                    <div className="decorative-bubble bubble10"></div>
                </div>
                <section className="hero">
                    <div className="container">
                        <div className="hero-content">
                            <h1 className="hero-title">Eleve sua Gestão ao Próximo Nível</h1>
                            <p className="hero-subtitle">Acenda a chama do crescimento com ferramentas inteligentes para cada nível da sua organização</p>
                            <div className="hero-cta">
                                    <button id="btn-acessar" className="btn-primary-flame" onClick={() => setModalLoginOpen(true)}><span>Acessar a Plataforma</span></button>
                                    <button id="btn-cadastrar" className="btn-secondary-flame" onClick={() => setModalCadastroOpen(true)}><span>Cadastrar Empresa</span></button>
                                    {/* Modal de cadastro */}
                                    <ModalCadastro open={modalCadastroOpen} onClose={() => setModalCadastroOpen(false)} />
                                    {/* Modal de login */}
                                    <ModalLogin open={modalLoginOpen} onClose={() => setModalLoginOpen(false)} />
                            </div>
                        </div>
                    </div>
                </section>
                <section className="features-section" id="features">
                    <div className="container">
                        <h2 className="section-title">Ferramentas que Iluminam o Caminho</h2>
                        <p className="section-subtitle">Da liderança à operação, cada nível tem as ferramentas certas para brilhar</p>
                        <div className="features-grid">
                            {/* Cards de funcionalidades */}
                            <div className="feature-card"><div className="feature-icon">🎯</div><h3 className="feature-title">Liderança Estratégica</h3><p className="feature-description">Dashboards executivos e planejamento estratégico para decisões que transformam</p></div>
                            <div className="feature-card"><div className="feature-icon">📊</div><h3 className="feature-title">Gestão Inteligente</h3><p className="feature-description">KPIs, indicadores e compliance em tempo real para governança eficaz</p></div>
                            <div className="feature-card"><div className="feature-icon">⚡</div><h3 className="feature-title">Execução Ágil</h3><p className="feature-description">Ferramentas operacionais que mantêm a energia fluindo em toda organização</p></div>
                            <div className="feature-card"><div className="feature-icon">👥</div><h3 className="feature-title">Colaboração Fluida</h3><p className="feature-description">Coordenação de equipes e projetos com comunicação transparente</p></div>
                            <div className="feature-card"><div className="feature-icon">💰</div><h3 className="feature-title">Controle Financeiro</h3><p className="feature-description">Gestão completa de finanças, orçamentos e recursos com clareza total</p></div>
                            <div className="feature-card"><div className="feature-icon">🎓</div><h3 className="feature-title">Desenvolvimento Contínuo</h3><p className="feature-description">Capacitação e evolução constante para manter o time sempre aceso</p></div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Footer Profissional */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-section footer-brand">
                            <div className="footer-logo">
                                <span className="footer-logo-icon">🔥</span>
                                <h3 className="footer-logo-text">Ascenda</h3>
                            </div>
                            <p className="footer-tagline">Elevando sua gestão ao próximo nível</p>
                            <div className="footer-social">
                                <a href="#" className="social-link" aria-label="LinkedIn">
                                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                    </svg>
                                </a>
                                <a href="#" className="social-link" aria-label="Twitter">
                                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                                    </svg>
                                </a>
                                <a href="#" className="social-link" aria-label="Instagram">
                                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <div className="footer-section">
                            <h4 className="footer-title">Plataforma</h4>
                            <ul className="footer-links">
                                <li><a href="#features">Funcionalidades</a></li>
                                <li><a href="#niveis">Níveis de Gestão</a></li>
                                <li><a href="#ferramentas">Ferramentas</a></li>
                                <li><a href="#integracoes">Integrações</a></li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h4 className="footer-title">Recursos</h4>
                            <ul className="footer-links">
                                <li><a href="#documentacao">Documentação</a></li>
                                <li><a href="#blog">Blog</a></li>
                                <li><a href="#tutoriais">Tutoriais</a></li>
                                <li><a href="#suporte">Suporte</a></li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h4 className="footer-title">Empresa</h4>
                            <ul className="footer-links">
                                <li><a href="#sobre">Sobre Nós</a></li>
                                <li><a href="#contato">Contato</a></li>
                                <li><a href="#carreiras">Carreiras</a></li>
                                <li><a href="#parceiros">Parceiros</a></li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h4 className="footer-title">Legal</h4>
                            <ul className="footer-links">
                                <li><a href="#privacidade">Política de Privacidade</a></li>
                                <li><a href="#termos">Termos de Uso</a></li>
                                <li><a href="#cookies">Política de Cookies</a></li>
                                <li><a href="#lgpd">LGPD</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p className="footer-copyright">
                            © 2025 Ascenda. Todos os direitos reservados.
                        </p>
                        <div className="footer-bottom-links">
                            <a href="#ajuda">Central de Ajuda</a>
                            <span className="separator">•</span>
                            <a href="#status">Status da Plataforma</a>
                            <span className="separator">•</span>
                            <a href="desenvolvedor/pages/login.html">🔐 Área do Desenvolvedor</a>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
}
 
