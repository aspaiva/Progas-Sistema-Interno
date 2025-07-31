const db = require('../data/dbOrcamentos');
const DEFAULT_PAGE_SIZE = 5;

async function getSolicitacoesOrcamentos(req, res, next) {
    const currentPage = parseInt(req.query.page || 1);
    const pageSize = parseInt(req.query.pagesize || DEFAULT_PAGE_SIZE);
    const countItems = await db.getCount();

    db.getSolicitacoesOrcamentos(currentPage, pageSize)
        .then(data => {
            console.log("Controller OK", data);
            return res.render('orcamento', { title: 'Orçamento', data: data, page: currentPage, pageSize, countItems });
        })
        .catch(error => {
            console.error(error);
            return error;
        });
}

module.exports = {
    getSolicitacoesOrcamentos,
    DEFAULT_PAGE_SIZE
}