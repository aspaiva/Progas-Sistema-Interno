
const router = require('express').Router();
const loginController = require('../controllers/loginController');
const passport = require('passport');

/* GET home page. */
router.get('/', loginController.showLoginPage);  // <domain>/login

router.get('/forgot', (req, res) => {
    res.render('forgot', { title: 'Recuperar Senha', message: "Informe seu email para recuperar a senha" });
});

// router.post('/', loginController.login);
// local é uma estratégia definida no middleware de autenticação, que utiliza email e senha para autenticar o usuário, salvos no banco de dados.
// há muitas outras estratégias, como OAuth, JWT, etc.
router.post('/', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/error'
}));

router.post('/forgot', loginController.forgotPassword); // Handle forgot password logic

router.post('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) { return next(err); }
        // console.log('User to be logged out');
        req.session.destroy(err => {
            if (err) {
                // console.error('Logout error:', err);
                return res.render('login', { title: 'Autenticação de usuário', message: "Erro ao fazer logout." });
            }
            res.render('login', { title: 'Autenticação de usuário', message: "Você foi desconectado com sucesso." });
        });
    });
}); // Handle reset password logic


module.exports = router;