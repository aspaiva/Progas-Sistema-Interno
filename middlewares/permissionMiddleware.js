module.exports = (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log("Usuário autenticado:", req.user);

        const url = req.originalUrl;

        if ((url.includes('/users') && parseInt(req.user.role) === 9) ||
            (url.includes('/orcamento') && parseInt(req.user.role) > 0)) {
            // User is authenticated, proceed to the next middleware or route handler
            return next();
        }

        // return res.render('error' , {
        //     message: 'Você não tem permissão para acessar esta página.',
        //     title: 'Acesso Negado',
        //     error: { status: 403, stack: 'Você não tem permissão para acessar esta página.' }
        // });

    }

    // User is not authenticated, redirect to login page
    res.render('login', { message: 'Autentique-se para acessar a página desejada' });
}