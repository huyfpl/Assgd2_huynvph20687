
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/user");
var quanao = require("../models/quanao");

const bodyParser = require("body-parser");

var request = require('request');

// // parse requests of content-type - application/json
router.use(bodyParser.json());

const parser = bodyParser.urlencoded({ extended: true });

router.use(parser);

// Create new user
router.post('/signup', async function (req, res) {
    if (!req.body.hovaten ||!req.body.anhdaidien ||!req.body.username || !req.body.password) {
        return res.render('api/signup',{ success: false, msg: 'nhập đầy đủ nhé bạn!' });
    } else {
        var newUser = new User({
            hovaten: req.body.hovaten,
            anhdaidien: req.body.anhdaidien,
            username: req.body.username,
            password: req.body.password
        });
        // save the user
        await newUser.save();

        res.redirect('/');
    }
});

router.get('/signup', (req, res) => {
    res.render('signup', {
    });
});

// Login

router.post("/signin", async function (req, res) {
    console.log(req.body);

    let user = await User.findOne({ username: req.body.username });

    console.log("huy nè",user);

    if (!user) {
        res
            .status(401)
            .render('signin',{ success: false, msg: "Tên người dùng ko tồn tại nha!" });
    } else {
        // check if password matches
        user.comparePassword(req.body.password, function (err, isMatch) {
            if (isMatch && !err) {
                // if user is found and password is right create a token
                var token = jwt.sign(user.toJSON(), config.secret);
                // return the information including token as JSON
                res.cookie("jwt", token, { httpOnly: true });
                res.redirect("/");
            } else {
                res
                    .status(401)
                    .render('signin',{
                        success: false,
                        msg: "Hình như sai pass r bạn ơi!",
                    });
            }
        });
    }
});
router.get('/signin', (req, res) => {
    res.render('signin', {
    });
});

// Get List quanao
router.get('/quanao', passport.authenticate('jwt', { session: false }), async function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        let quanaos = await quanao.find();

        return res.json(quanaos);
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized.' });
    }
});
// tìm quần áo 
router.get('/search_quanao', passport.authenticate('jwt', { session: false }), async function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        let name = req.query.name; // extract the 'name' query parameter
        let regex = new RegExp(name, 'i'); // create a case-insensitive regular expression
        let quanaos = await quanao.find({ tenquanao: { $regex: regex } }); // filter quanao collection by name using the regular expression

        return res.json(quanaos);
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized.' });
    }
});
// xóa quần áo 
router.get('/xoa_quanao/:id', passport.authenticate('jwt', { session: false }), async function (req, res) {
    var token = getToken(req.headers);
    console.log("chạy xóa qua đây")
    if (token) {
        try {
            let quanaos = await quanao.findByIdAndDelete(req.params.id);
            res.redirect("http://localhost:3000/quanao")
            // return res.json(quanaos);
            console.log("chạy xóa qua đây nữa")

           
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server error' });
        }
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized.' });
    }
});

router.post("/quanao", passport.authenticate("jwt", { session: false }), function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        console.log(req.body);
        var newquanao = new quanao({
            tenquanao: req.body.tenquanao,
            soluong: req.body.soluong,
            price: req.body.price,
            image: req.body.image,
        });

        newquanao
            .save()
            .then(() => res.redirect("/quanao"))
            .catch((err) => res.json({ success: false, msg: "Save quanao failed." }));
    } else {
        return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
}
);

// home
router.get('/', (req, res) => {
    res.render('home', {
    });
});



getToken = function (headers) {
    if (headers && headers.authorization) {
        console.log(headers.authorization);
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

module.exports = router;
