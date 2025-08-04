const express = require('express');
const router = express.Router();
const controller = require('../controllers/usersController');
const db = require('../data/dbUsers');
const { ObjectId } = require('mongodb');

/* GET users listing. */
router.get('/', async (req, res, next) => {
  // db.findAllUsersCallbackWay((err, users) => {
  //   if (err) {
  //     console.error('Error fetching users:', err);
  //     return next(err);
  //   }
  //   console.clear();
  //   console.log('Users fetched successfully:', users);
  //   // Render the index view with the fetched users
  //   // Assuming you want to pass the users as 'data' to the view
  //   res.render('index', { title: 'Express', data: users });
  // });

  const currentPage = parseInt(req.query.page || 1);
  const pageSize = parseInt(req.query.pagesize || 3);
  const countItems = await db.getCount();

  console.log(`page: ${currentPage}, size: ${pageSize}, count: ${countItems}`);

  db.findAllUsersPromiseWay(currentPage, pageSize)
    .then(users => {
      // console.clear();
      // console.log('Users fetched successfully:', users);
      // Render the index view with the fetched users
      return res.render('users', { title: 'Lista de usuários', data: users, countItems: countItems, page: currentPage, pageSize });
    })
    .catch(err => {
      console.error('Error fetching users:', err);
      next(err); // Pass the error to the error handler
    });
});

// Chama tela de Cadastro
router.get('/new', (req, res) => {
  if (req.query.error)
    return res.render('usersNew', { title: 'Cadastrar usuário', data: req.body, message: error });
  else
    return res.render('usersNew', { title: 'Cadastrar usuário', data: {} });
});

//Chama tela de edição
router.get('/edit/:id', (req, res) => {
  const userId = ObjectId.createFromHexString(req.params.id); // Assuming the user ID is passed as a query parameter

  console.log('Fetching user for edit:', userId);
  if (!ObjectId.isValid(userId)) {
    return res.status(400).send('Invalid user ID');
  }

  db.findUserByID(userId.toString())
    .then(user => {
      if (!user) {
        return res.status(404).send('User not found');
      }
      console.log("userbyId: ", user);
      res.render('usersEdit', { title: 'Edição de usuário', data: user }); // Render the edit user form with user data
    })
    .catch(err => {
      console.error('Error fetching user:', err);
      res.status(500).send('Error fetching user');
    });
});

// Efetua cadastro do usuario
router.post('/', (req, res) => {
  const user = req.body; // Assuming body-parser middleware is used

  // Validate user data here if necessary
  if (!user.name || !user.email) {
    res.redirect('/new?error=Nome e email são obrigatórios'); // Redirect to the new user page with an error query parameter
    return;
  }

  if (!user.password) {
    res.redirect("/new?error='Senha inválida'");
  }

  db.insertUser(user)
    .then(result => {
      console.log('User inserted successfully:', result);
      return res.redirect('/users'); // Redirect to the home page after insertion
    })
    .catch(err => {
      console.error('Error inserting user:', err);
      return res.status(500).send('Error inserting user');
    });
});

// Faz o update do usuario
router.post('/edit/:id', (req, res) => {
  //o id já vem com o objeto e também como parametro. Isso pode ser confuso

  console.clear();
  console.log("post /users/edit/");

  const userId = ObjectId.createFromHexString(req.params.id);
  const userData = req.body; // Assuming body-parser middleware is used

  console.log("update user to:", userData);

  db.updateUser(userId, userData)
    .then(result => {
      console.log('User updated successfully:', result);
      return res.redirect('/users'); // Redirect to the home page after update
    })
    .catch(err => {
      console.error('Error updating user:', err);
      return res.status(500).send('Error updating user');
    });
});

router.post('/delete/:id', (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.deleteUser(req.params.id)
      .then(result => res.redirect("/users"))
      .catch(error => res.render('error', { message: 'Erro ao excluir', title: 'Erro no sistema', error }));
  }
});

module.exports = router;
