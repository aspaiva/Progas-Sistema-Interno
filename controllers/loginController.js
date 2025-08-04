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

module.exports = {
    login,
    showLoginPage
}   