/**
 * Migração: Adicionar Sistema Multi-Role
 * 
 * Esta migração adiciona suporte para múltiplos papéis (roles) por usuário.
 * Permite que um usuário acesse diferentes interfaces conforme necessário.
 * 
 * Novos campos:
 * - additional_roles: JSON array com níveis extras [1, 3, 5]
 * - can_switch_roles: Boolean indicando se pode trocar de papel
 */

const db = require('../../config/database');

function runMigration() {
    return new Promise((resolve, reject) => {
        console.log('🔄 Iniciando migração: Sistema Multi-Role...');

        db.serialize(() => {
            // Verificar se os campos já existem
            db.all("PRAGMA table_info(users)", [], (err, columns) => {
                if (err) {
                    console.error('❌ Erro ao verificar estrutura da tabela:', err);
                    reject(err);
                    return;
                }

                const hasAdditionalRoles = columns.some(col => col.name === 'additional_roles');
                const hasCanSwitch = columns.some(col => col.name === 'can_switch_roles');

                if (hasAdditionalRoles && hasCanSwitch) {
                    console.log('✅ Campos já existem. Migração não necessária.');
                    resolve();
                    return;
                }

                // Adicionar campos se não existirem
                const migrations = [];

                if (!hasAdditionalRoles) {
                    migrations.push(
                        new Promise((res, rej) => {
                            db.run(
                                `ALTER TABLE users ADD COLUMN additional_roles TEXT`,
                                [],
                                (err) => {
                                    if (err) {
                                        console.error('❌ Erro ao adicionar additional_roles:', err);
                                        rej(err);
                                    } else {
                                        console.log('✅ Campo additional_roles adicionado');
                                        res();
                                    }
                                }
                            );
                        })
                    );
                }

                if (!hasCanSwitch) {
                    migrations.push(
                        new Promise((res, rej) => {
                            db.run(
                                `ALTER TABLE users ADD COLUMN can_switch_roles INTEGER DEFAULT 0`,
                                [],
                                (err) => {
                                    if (err) {
                                        console.error('❌ Erro ao adicionar can_switch_roles:', err);
                                        rej(err);
                                    } else {
                                        console.log('✅ Campo can_switch_roles adicionado');
                                        res();
                                    }
                                }
                            );
                        })
                    );
                }

                // Executar todas as migrações
                Promise.all(migrations)
                    .then(() => {
                        console.log('✅ Migração concluída com sucesso!');
                        console.log('\n📋 Próximos passos:');
                        console.log('1. Atualizar usuários que precisam de múltiplos papéis');
                        console.log('2. Adicionar role-switcher-component.js nos dashboards');
                        console.log('3. Testar fluxo de login e troca de papéis');
                        resolve();
                    })
                    .catch(reject);
            });
        });
    });
}

// Executar migração se for chamado diretamente
if (require.main === module) {
    runMigration()
        .then(() => {
            console.log('\n✅ Processo finalizado!');
            process.exit(0);
        })
        .catch((err) => {
            console.error('\n❌ Erro na migração:', err);
            process.exit(1);
        });
}

module.exports = { runMigration };
