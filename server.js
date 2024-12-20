





if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}



const express = require('express')
const bcrypt = require('bcrypt');
const passport = require('passport')

const initializePassport = require('./passport-config');
const flash = require('express-flash');
const session = require('express-session');
const methoOverride = require('method-override')

const app = express();
initializePassport(
    passport ,
     email=> users.find(user=>user.email === email),
     id=> users.find(user=>user.id === id )
)

app.use(express.json());

app.set('view-engine' , 'ejs')
app.use(express.urlencoded({extended:false}))
app.use(flash())
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave : false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(methoOverride('_method'))

const users = [];

app.get('/', checkAuthenticated, (req , res)=>{
    res.render('index.ejs', {name : req.user.name})
})

app.post('/login' ,checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash:true
}))

app.get('/login',checkNotAuthenticated, (req , res)=>{
    res.render('login.ejs')
})

app.get('/register',checkNotAuthenticated,(req , res)=>{
    res.render('register.ejs')
})


app.post('/register' , checkNotAuthenticated, async (req , res)=> {
    try {
        const hashedPass = await bcrypt.hash(req.body.password, 10);
        // console.log('Hashed Password:', hashedPass);

        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPass
        })
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
})


function checkAuthenticated(req , res , next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}


app.delete('/logout', (req, res, next) => {
    req.logOut((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/login');
    });
  });

function checkNotAuthenticated(req , res , next){
    if(req.isAuthenticated()){
      return  res.redirect('/')
    }
    next()
}

app.listen(3000,()=>{
    console.log("Server running....")
})