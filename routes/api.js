
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/user");
var Admin = require("../models/admin");
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
// admin
router.post("/signin/admin", async function (req, res) {
    console.log(req.body);

    let admin = await Admin.findOne({ username: req.body.username });

    console.log("huy nè",admin);

    if (!admin) {
        res
            .status(401)
            .render('signinadmin',{ success: false, msg: "admin ko tồn tại nha!" });
    } else {
        // check if password matches
        admin.comparePassword(req.body.password, function (err, isMatch) {
            if (isMatch && !err) {
                // if user is found and password is right create a token
                var token = jwt.sign(admin.toJSON(), config.secret);
                // return the information including token as JSON
                res.cookie("jwt", token, { httpOnly: true });
                res.redirect("/admin");
            } else {
                res
                    .status(401)
                    .render('signinadmin',{
                        success: false,
                        msg: "sai pass r bạn ơi!",
                    });
            }
        });
    }
});
router.post('/signup/admin', async function (req, res) {
    if (!req.body.hovaten ||!req.body.anhdaidien ||!req.body.username || !req.body.password) {
        return res.render('api/signup',{ success: false, msg: 'nhập đầy đủ nhé bạn!' });
    } else {
        var newAdmin = new Admin({
            hovaten: req.body.hovaten,
            anhdaidien: req.body.anhdaidien,
            username: req.body.username,
            password: req.body.password
        });
        // save the user
        await newAdmin.save();

        res.redirect('/admin');
    }
});

router.get('/signup', (req, res) => {
    res.render('signup', {
    });
});
router.get('/signin/admin', (req, res) => {
    res.render('signinadmin', {
    });
});












// Get List user
router.get('/user', passport.authenticate('jwt', { session: false }), async function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        let users = await user.find();

        return res.json(users);
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized.' });
    }
});
router.get('/search_user', passport.authenticate('jwt', { session: false }), async function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        let name = req.query.name; // extract the 'name' query parameter
        let regex = new RegExp(name, 'i'); // create a case-insensitive regular expression
        let users = await user.find({ hovaten: { $regex: regex } }); // filter quanao collection by name using the regular expression

        return res.json(users);
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized.' });
    }
});
router.get('/xoa_user/:id', passport.authenticate('jwt', { session: false }), async function (req, res) {
    var token = getToken(req.headers);
    console.log("chạy xóa qua đây")
    if (token) {
        try {
            let users = await user.findByIdAndDelete(req.params.id);
            res.redirect("/user")
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
// Get List quanao
router.get('/quanao', passport.authenticate('jwt', { session: false }), async function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        let quanaos = await quanao.find();

        return res.json(quanaos);
    } else {
        console.log('ra update r')

     
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
            res.redirect("/quanao")
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
// sửa quần áo 
const { ObjectId } = require('mongodb');
const user = require('../models/user');

router.get('/updatequanao/:id', async function (req, res) {
  const quanaoId = req.params.id;
  if (!ObjectId.isValid(quanaoId)) {
    return res.status(400).send('Invalid quanaoId');
  }

  try {
    const updatedQuanao = await quanao.findByIdAndUpdate(
      quanaoId,
      {
        tenquanao: req.body.tenquanao,
        soluong: req.body.soluong,
        price: req.body.price,
        image: req.body.image,
      },
      { new: true }
    );
    res.json(updatedQuanao);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
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
router.get('/profile', (req, res) => {
    
    res.render('profile', {
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
