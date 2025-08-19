const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Joi = require('joi');
const { campgroundSchema,reviewSchema } = require('./schemas.js');
const Review = require('./models/review');

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

mongoose.connect('mongodb://localhost:27017/camp3', {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true

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


app.engine('ejs', ejsMate); 

app.use('/campgrounds', campgrounds);

app.use('/campgrounds/:id/reviews', reviews);


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

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
