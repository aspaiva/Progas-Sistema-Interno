const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const db = require('../data/dbUsers');
const { Passport } = require('passport');

module.exports = (passport) => {

    passport.serializeUser((user, done) => {
        done(null, user._id);
    })

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await db.findUserByID(id);
            done(null, user);   
        } catch (error) {
            done(error, null);  
        }
    })

    passport.use(
        new localStrategy({
            usernameField: 'email',
            passwordField: 'password'
        }, async (email, password, done) => {
            try {
                // Check if user exists
                const user = await db.findUserByEmail(email);
                if (!user) {
                    return done(null, false, { message: 'No user found with that email.' });
                }
                // Check password
                const isMatch = bcrypt.compareSync(password, user.password);
                if (!isMatch) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                // If everything is ok, return user
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        })
    );
}