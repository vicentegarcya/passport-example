module.exports.isAuthenticated = (req, res, next) => {
    if (req.user) {
        res.locals.currentUser = req.user;
        next();
    } else {
        res.redirect('/login');
    }
};

module.exports.isActivated = (req, res, next) => {
    if (req.user.active) {
        next();
    } else {
        req.flash('flashMessage', 'Please activate your account via email');
        res.redirect('/login');
    }
}

module.exports.isNotAuthenticated = (req, res, next) => {
    if(!req.user) {
        next();
    } else if(!req.user.active){
        next();
    } else {
        res.redirect('/profile');
    }
};