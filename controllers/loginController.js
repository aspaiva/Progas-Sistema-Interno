const db = require('../data/dbUsers');
const bcrypt = require('bcryptjs');
const nodemailer = require('../mail');

function showLoginPage(req, res) {
    res.render('login', { title: 'Autenticação de usuário', message: "Informe os dados e tente a sorte", email: req.user.email, user: req.user  });
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

    if (!email) {
        return res.render('forgot', { title: 'Recuperar Senha', message: "Informe seu email para recuperar a senha" });
    }

    const user = await db.findUserByEmail(email);
    if (!user) {
        return res.render('forgot', { title: 'Recuperar Senha', message: "Usuário não encontrado." });
    }

    const novaSenha = Math.random().toString(36).slice(-8);
    user.password = novaSenha; // hashing should be done in the database function
    await db.updateUser(user._id, user);

    nodemailer.sendMail(user.email,
        'Progás - Recuperação de Senha',
        `<p>Progás Soluções e Engenharia</p>
        <p>Sua nova senha é: <strong>${novaSenha}</strong></p>
        <p>Use esta senha para acessar o sistema e, em seguida, altere-a imediatamente.</p>`
    ).then(() => {
        console.log('Email sent successfully');
        res.render('login', { title: 'Autenticação de usuário', message: "Instruções para recuperação de senha enviadas para o seu email." });
    }).catch(err => {
        console.error('Error sending email:', err);
        res.render('forgot', { title: 'Recuperar senha', message: "Não foi possível enviar o email.\n" + err.message });
    }).finally(() => {
        nodemailer.close(); // Close the transporter after sending the email
    });

}

module.exports = {
    login,
    showLoginPage,
    forgotPassword
}   