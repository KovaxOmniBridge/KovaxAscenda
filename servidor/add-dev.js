/**
 * Criar desenvolvedor inicial
 */
const bcrypt = require('bcryptjs');
const db = require('./src/config/database');

const devData = {
    name: 'Admin Dev',
    email: 'admin@ascenda.dev',
    password: 'dev123',
    role: 'admin'
};

console.log('👨‍💻 Criando desenvolvedor...\n');

const hash = bcrypt.hashSync(devData.password, 10);

db.run(
    'INSERT INTO dev_users (name, email, password, role, created_at) VALUES (?, ?, ?, ?, datetime("now"))',
    [devData.name, devData.email, hash, devData.role],
    function(err) {
        if (err) {
            if (err.message.includes('UNIQUE')) {
                console.log('⚠️  Desenvolvedor já existe!');
                console.log('\n🔐 Credenciais:');
                console.log(`   Email: ${devData.email}`);
                console.log(`   Senha: ${devData.password}`);
            } else {
                console.error('❌ Erro:', err.message);
            }
        } else {
            console.log('✅ Desenvolvedor criado com sucesso!');
            console.log(`   ID: ${this.lastID}`);
            console.log('\n🔐 Credenciais de acesso:');
            console.log(`   URL: http://localhost:3000/desenvolvedor/dev-login.html`);
            console.log(`   Email: ${devData.email}`);
            console.log(`   Senha: ${devData.password}`);
        }
        db.close();
        process.exit(0);
    }
);
