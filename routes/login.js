const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('login', { title: 'Autenticação de usuário', message: "Informe os dados e tente a sorte" });
});

router.post('/', (req, res, next) => {
    const user = req.body;

    if (!user) {
        res.render('login', { title: 'Autenticação de usuário', message: "Usuário ou senha incorretos." });
    }

    res.render('index', {title: 'SIP - Sistema Interno Progás'});
})

module.exports = router;