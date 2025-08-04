
const router = require('express').Router();
const loginController = require('../controllers/loginController');

/* GET home page. */
router.get('/', loginController.showLoginPage);

router.post('/', loginController.login);

module.exports = router;