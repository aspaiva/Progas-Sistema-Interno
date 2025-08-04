const db = require('../data/dbUsers');
const bcrypt = require('bcryptjs');

function showLoginPage(req, res) {
    res.render('login', { title: 'Autenticação de usuário', message: "Informe os dados e tente a sorte", email: null });
};

async function login(req, res, next) {
    const login = req.body;
    console.log('Login attempt:', login.email, login.password);

    if (!login.email || !login.password) {
        return res.render('login', { title: 'Autenticação de usuário', message: "Usuário ou senha incorretos." });
    }

    const user = await db.findUserByEmail(login.email);
    console.log('User found:', user);

    if (!user.email || !user.password) {
        console.error('User not found:', login.email);
        return res.render('login', { title: 'Autenticação de usuário', message: "Usuário ou senha incorretos.", email: login.email });
    }

    console.log('User found:', user);
    if (bcrypt.compareSync(login.password, user.password))
        return res.render('index', { title: "Sistema Progás" });
    else
        return res.render('login', { title: 'Autenticação de usuário', message: "Usuário ou senha incorretos.", email: login.email });
}

async function forgotPassword(req, res) {
    const email = req.body.email;
    console.log('Forgot password request for:', email);

    if (!email) {
        return res.render('forgot', { title: 'Recuperar Senha', message: "Informe seu email para recuperar a senha" });
    }

    const user = await db.findUserByEmail(email);
    if (!user) {
        return res.render('forgot', { title: 'Recuperar Senha', message: "Usuário não encontrado." });
    }

    const novaSenha = Math.random().toString(36).slice(-8);
    console.log('Generated new password:', novaSenha);
    //user.password = bcrypt.hashSync(novaSenha, 12);
    user.password = novaSenha; // hashing should be done in the database function
    await db.updateUser(user._id, user);
    console.log('User password updated:', user);
    
    // Logic to send reset password email would go here
    console.log('Reset password email sent to:', email);
    res.render('login', { title: 'Autenticação de usuário', message: "Instruções para recuperação de senha enviadas para o seu email." });
}

module.exports = {
    login,
    showLoginPage,
    forgotPassword
}   