const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const { isLoggedIn , isAuthor,validateCampground} = require('../middleware');
const campgrounds = require('../controllers/campgrounds');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');


router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));
    
router.route('/new')
    .get(isLoggedIn, campgrounds.renderNewForm);


router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));    



router.route('/:id/edit')
    .get(isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm)); 






module.exports = router;