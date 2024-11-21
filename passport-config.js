







const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserbyEmial, getUserbyId) {
    const authenticateUser = async (email, password, done) => {
        const user = getUserbyEmial(email)
        if (user == null) {
            return done(null, false, { message: "No user found with that email" })
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: "Incorrect Password" })
            }
        } catch (error) {
            return done(error)

        }
    }
    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserbyId(id))
    })
}

module.exports = initialize