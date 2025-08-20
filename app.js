if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
};

const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Joi = require('joi');
const { campgroundSchema,reviewSchema } = require('./schemas.js');
const Review = require('./models/review');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');



mongoose.connect('mongodb://localhost:27017/camp3', {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true
    // useFindAndModify: false,

});

const Campground = require('./models/campground');


const db = mongoose.connection;

db.on("eror",console.error.bind(console, "connection error:"));
db.once("open", ()=> {
    console.log("Database connected");  
});

const app = express();
const path = require("path");
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));

app.engine('ejs', ejsMate); 

const sessionConfig  = {

    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,

    }

};
app.use(session(sessionConfig));


app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy( User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);

app.use('/campgrounds/:id/reviews', reviewRoutes);



app.get('/',(req,res)=>{
    res.render('home');
})


app.all(/(.*)/, (req, res, next) => {

    next(new ExpressError('Page Not Found', 404));

});

app.use((err, req, res, next) => {
    const { statusCode = 500} = err;
    if( !err.message) err.message = 'Something went wrong';
    res.status(statusCode).render('error',{err});
});

app.listen(3002, () => {
  console.log('Server is running on port 3000');
});
