/**
 * Sistema de Permissões Granulares
 * 
 * Define o que cada nível hierárquico pode VER e FAZER na plataforma.
 * Mantém UI consistente mas bloqueia ações não permitidas.
 */

const PERMISSIONS = {
    // Nível 0 - Presidentes/C-Level
    0: {
        view: {
            dashboard: true,
            kpis_executivos: true,
            estrutura_completa: true,
            todos_usuarios: true,
            relatorios_financeiros: true,
            relatorios_operacionais: true,
            squads_chapters: true,
            aprovacoes: true,
            logs_auditoria: true
        },
        actions: {
            // Aprovações
            aprovar_orcamentos: true,
            aprovar_contratacoes_executivas: true,
            aprovar_investimentos: true,
            aprovar_mudancas_estruturais: true,
            
            // Comunicação
            enviar_comunicados_gerais: true,
            criar_metas_corporativas: true,
            
            // Visualização apenas (não pode editar diretamente)
            criar_usuarios: false,
            editar_usuarios: false,
            deletar_usuarios: false,
            criar_squads: false,
            editar_estrutura: false,
            
            // Relatórios
            exportar_relatorios: true,
            agendar_relatorios: true
        }
    },

    // Nível 1 - Administradores Gerais
    1: {
        view: {
            dashboard: true,
            kpis_executivos: true,
            estrutura_completa: true,
            todos_usuarios: true,
            relatorios_financeiros: true,
            relatorios_operacionais: true,
            squads_chapters: true,
            aprovacoes: true,
            logs_auditoria: true,
            configuracoes_empresa: true
        },
        actions: {
            // CRUD Completo
            criar_usuarios: true,
            editar_usuarios: true,
            deletar_usuarios: true,
            criar_squads: true,
            editar_squads: true,
            deletar_squads: true,
            criar_chapters: true,
            editar_chapters: true,
            deletar_chapters: true,
            
            // Estrutura
            editar_estrutura: true,
            configurar_templates: true,
            
            // Aprovações
            aprovar_solicitacoes_niveis_inferiores: true,
            
            // Relatórios
            exportar_relatorios: true,
            agendar_relatorios: true,
            
            // Empresa
            editar_dados_empresa: true,
            gerenciar_modulos: true
        }
    },

    // Nível 2 - Diretores Executivos
    2: {
        view: {
            dashboard: true,
            kpis_setor: true,
            estrutura_setor: true,
            usuarios_setor: true,
            relatorios_setor: true,
            squads_setor: true,
            aprovacoes_setor: true
        },
        actions: {
            // Usuários do setor
            criar_usuarios: true,  // Apenas níveis 3-7
            editar_usuarios: true, // Apenas do seu setor
            deletar_usuarios: false,
            
            // Squads
            criar_squads: true,
            editar_squads: true, // Apenas do seu setor
            deletar_squads: false,
            
            // Aprovações
            aprovar_orcamentos_setor: true,
            aprovar_contratacoes_nivel_3_7: true,
            
            // Relatórios
            exportar_relatorios: true,
            agendar_relatorios: false
        }
    },

    // Nível 3 - Gerentes
    3: {
        view: {
            dashboard: true,
            kpis_departamento: true,
            estrutura_departamento: true,
            usuarios_departamento: true,
            squads_departamento: true,
            tarefas_equipe: true
        },
        actions: {
            // Usuários
            criar_usuarios: true,  // Apenas níveis 4-7
            editar_usuarios: true, // Apenas do departamento
            deletar_usuarios: false,
            
            // Gestão
            alocar_recursos: true,
            definir_metas_departamento: true,
            criar_tarefas: true,
            
            // Aprovações
            aprovar_solicitacoes_equipe: true,
            
            // Relatórios
            exportar_relatorios: true,
            agendar_relatorios: false
        }
    },

    // Nível 4 - Coordenadores
    4: {
        view: {
            dashboard: true,
            projetos_coordenacao: true,
            usuarios_projetos: true,
            tarefas_projetos: true,
            recursos_projetos: true
        },
        actions: {
            criar_usuarios: false,
            editar_usuarios: false,
            deletar_usuarios: false,
            
            // Projetos
            criar_projetos: true,
            editar_projetos: true,
            alocar_recursos_projetos: true,
            
            // Tarefas
            criar_tarefas: true,
            atribuir_tarefas: true,
            acompanhar_progresso: true,
            
            // Relatórios
            exportar_relatorios: true,
            agendar_relatorios: false
        }
    },

    // Nível 5 - Supervisores
    5: {
        view: {
            dashboard: true,
            equipe_direta: true,
            tarefas_equipe: true,
            performance_equipe: true
        },
        actions: {
            criar_usuarios: false,
            editar_usuarios: false,
            deletar_usuarios: false,
            
            // Supervisão
            atribuir_tarefas: true,
            avaliar_performance: true,
            aprovar_timesheet: true,
            
            // Relatórios
            exportar_relatorios: false,
            agendar_relatorios: false
        }
    },

    // Nível 6 - Especialistas
    6: {
        view: {
            dashboard: true,
            projetos_atribuidos: true,
            tarefas_pessoais: true,
            recursos_especializacao: true
        },
        actions: {
            criar_usuarios: false,
            editar_usuarios: false,
            deletar_usuarios: false,
            
            // Trabalho
            executar_tarefas: true,
            atualizar_progresso: true,
            solicitar_recursos: true,
            
            // Relatórios
            exportar_relatorios: false,
            agendar_relatorios: false
        }
    },

    // Nível 7 - Operacional
    7: {
        view: {
            dashboard: true,
            tarefas_pessoais: true,
            checklist_operacional: true
        },
        actions: {
            criar_usuarios: false,
            editar_usuarios: false,
            deletar_usuarios: false,
            
            // Operações
            executar_tarefas: true,
            atualizar_status: true,
            registrar_atividades: true,
            
            // Relatórios
            exportar_relatorios: false,
            agendar_relatorios: false
        }
    }
};

/**
 * Verifica se usuário tem permissão para visualizar
 */
function canView(nivel, permission) {
    const userPermissions = PERMISSIONS[nivel];
    if (!userPermissions) return false;
    return userPermissions.view[permission] === true;
}

/**
 * Verifica se usuário tem permissão para executar ação
 */
function canDo(nivel, action) {
    const userPermissions = PERMISSIONS[nivel];
    if (!userPermissions) return false;
    return userPermissions.actions[action] === true;
}

/**
 * Obtém todas as permissões de um nível
 */
function getPermissions(nivel) {
    return PERMISSIONS[nivel] || { view: {}, actions: {} };
}

/**
 * Verifica múltiplas permissões de uma vez
 */
function hasPermissions(nivel, permissionsArray) {
    return permissionsArray.every(perm => {
        if (perm.startsWith('view_')) {
            return canView(nivel, perm.replace('view_', ''));
        }
        return canDo(nivel, perm);
    });
}

// Exportar para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PERMISSIONS,
        canView,
        canDo,
        getPermissions,
        hasPermissions
    };
}
