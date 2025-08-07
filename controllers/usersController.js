const db = require('../data/dbUsers'); // Ensure this points to your db.js file
const { ObjectId } = require('mongodb');

/* GET users listing. */
function getAllUsers() {
  db.findAllUsersPromiseWay(1, 10)
    .then(users => {
      // console.clear();
      // console.log('Users fetched successfully:', users);
      // Render the index view with the fetched users
      res.render('users', { title: 'Lista de usuários', data: users });
    })
    .catch(err => {
      console.error('Error fetching users:', err);
      next(err); // Pass the error to the error handler
    });
}

//Chama tela de edição
function editUser(req, res) {
  const userId = ObjectId.createFromHexString(req.params.id); // Assuming the user ID is passed as a query parameter
  console.log('Fetching user for edit:', userId);
  if (!ObjectId.isValid(userId)) {
    redirect("/error", { message: "ID do usuário inválido", error: null });
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
}

// Efetua cadastro do usuario
function createUser(req, res) {
  const user = req.body; // Assuming body-parser middleware is used

  // Validate user data here if necessary
  if (!user.name || !user.email) {
    res.redirect('/new?error=Nome e email são obrigatórios'); // Redirect to the new user page with an error query parameter
    return;
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
}

// Faz o update do usuario
function updateUser(req, res) {
  //o id já vem com o objeto e também como parametro. Isso pode ser confuso
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
}

function deleteUser(req, res) {
  const userId = req.params.id;
  if (ObjectId.isValid(userId)) {
    db.deleteUser(userId)
      .then(result => {
        console.log('User deleted successfully:', result);
        return res.redirect("/users");
      })
      .catch(error => {
        console.error('Error deleting user:', error);
        res.render('error', { message: 'Erro ao excluir', title: 'Erro no sistema', error })
      });
  }
  else {
    res.render('error', { message: 'ID do usuário para excluir é inválido', title: 'Erro no sistema', error: {} });
  }
}


module.exports = {
  getAllUsers,
  editUser,
  updateUser,
  createUser,
  deleteUser
};
