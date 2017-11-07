const express = require('express');
const passport = require('passport');
const Account = require('../models/account');
const Random = require('../models/random');
const router = express.Router();

router.get('/random', (req, res) => {
    
    Random
            .find() 
            .exec()
            .then(randoms => {
                console.log(randoms)
                res.render('random', { user : req.user, me: "Nicolas", conditional: false, array: randoms });
            })
});

router.post('/random', (req, res) => {
     console.log(req.body);
     Random.create({color: req.body.color, size: req.body.size});
     res.redirect('/random');
});

router.get('/random/:id', (req, res) => {
     console.log(req.params);
     Random.remove({_id:req.params.id})
        .exec()
        .then(randoms => {
            console.log(randoms)    
            res.redirect('/random');
        });

});

router.get('/', (req, res) => {
    res.render('home');
});

router.get('/register', (req, res) => {
    res.render('register', { });
});

router.post('/register', (req, res, next) => {
    console.log(req.body);
    console.log(req.body);
    Account.register(new Account({ username : req.body.username }), req.body.password, (err, account) => {
        if (err) {
          return res.render('register', { error : err.message });
        }

        passport.authenticate('local')(req, res, () => {
            req.session.save((err) => {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        });
    });
});


router.get('/login', (req, res) => {
    res.render('login', { user : req.user, error : req.flash('error')});
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req, res, next) => {
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.get('/ping', (req, res) => {
    res.status(200).send("pong!");
});

module.exports = router;
