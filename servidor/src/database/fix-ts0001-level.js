/**
 * Script para corrigir o nível do usuário TS-0001
 * Muda de nível 1 para nível 0 (Presidente)
 */

const db = require('../config/database');

console.log('🔧 Corrigindo nível do usuário TS-0001...\n');

// Verificar nível atual
db.get('SELECT id, name, access_key, nivel, role FROM users WHERE access_key = ?', ['TS-0001'], (err, user) => {
    if (err) {
        console.error('❌ Erro ao buscar usuário:', err);
        process.exit(1);
    }

    if (!user) {
        console.error('❌ Usuário TS-0001 não encontrado!');
        process.exit(1);
    }

    console.log('📋 Dados ANTES da correção:', {
        id: user.id,
        name: user.name,
        accessKey: user.access_key,
        nivel: user.nivel,
        role: user.role
    });

    if (user.nivel === 0) {
        console.log('✅ Usuário já está no nível 0 (Presidente)');
        process.exit(0);
    }

    // Atualizar para nível 0
    db.run('UPDATE users SET nivel = 0, role = ? WHERE access_key = ?', ['Presidente', 'TS-0001'], function(err) {
        if (err) {
            console.error('❌ Erro ao atualizar usuário:', err);
            process.exit(1);
        }

        console.log(`\n✅ Usuário atualizado com sucesso! (${this.changes} registro modificado)`);

        // Verificar resultado
        db.get('SELECT id, name, access_key, nivel, role FROM users WHERE access_key = ?', ['TS-0001'], (err, updatedUser) => {
            if (err) {
                console.error('❌ Erro ao verificar atualização:', err);
                process.exit(1);
            }

            console.log('\n📋 Dados DEPOIS da correção:', {
                id: updatedUser.id,
                name: updatedUser.name,
                accessKey: updatedUser.access_key,
                nivel: updatedUser.nivel,
                role: updatedUser.role
            });

            console.log('\n✨ Correção concluída! Agora você pode fazer login com TS-0001 no dashboard de Presidentes.\n');
            process.exit(0);
        });
    });
});
