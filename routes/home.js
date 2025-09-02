const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', { title: 'Progás', user: req.user });
});

router.get('/home', (req, res, next) => {
    res.render('index', { title: 'Progás', user: req.user });
});

module.exports = router;