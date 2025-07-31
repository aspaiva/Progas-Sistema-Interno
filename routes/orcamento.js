const express = require('express');
const router = express.Router();
const controller = require('../controllers/orcamentoController');

router.get('/', controller.getSolicitacoesOrcamentos); 

module.exports = router;