var express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
var axios = require("axios");
var router = express.Router();
router.use(bodyParser.json());
router.use(cookieParser());
var jwt = require('jsonwebtoken');
var config = require('../config/database');
const user = require("../models/user");
var quanao = require("../models/quanao");
router.get("/quanao", (req, res, next) => {
  const token = req.cookies.jwt;
  console.log(`jwt ${token}`);
  console.log("huy token:" + token)
  if (token) {
    jwt.verify(token, config.secret, (err, decodedToken) => {
      console.log(typeof jwt);
      if (err) {
        console.log("lỗi", err.message);
        res.redirect('api/signin');
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect('/api/signin');
  }
}, async function (req, res) {
  console.log("chạy vô đây nè")
  const token = req.cookies.jwt;

  try {
    const response = await axios.get("http://localhost:3000/api/quanao", {
      headers: { Authorization: `jwt ${token}` },
    });
    const data = response.data;
    res.render("quanao", {
      Title: "quanao",
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
});


router.get('/add', async function (req, res) {
  const token = req.cookies.jwt;
  res.render("add", { Title: "Thêm Quần Áo", token })
})
router.get('/timquanao', async function (req, res) {
  const token = req.cookies.jwt;

  try {
    const query = req.query.query;
    const response = await axios.get(`http://localhost:3000/api/search_quanao?name=${query}`, {
      headers: { Authorization: `jwt ${token}` },
    });
    const data = response.data;
    res.render("quanao", {
      Title: "Tìm quần áo",
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
});
router.get('/xoaquanao/:id', async function (req, res) {
  const token = req.cookies.jwt;
  const quanaoId = req.params.id;
  console.log("lỗi xóa", quanaoId)
  try {
    const response = await axios.get(`http://localhost:3000/api/xoa_quanao/${quanaoId}`, {
      headers: { Authorization: `jwt ${token}` },
    });
    console.log(" xóa data");
    const data = response.data;
    console.log(" xóa data",data);
    res.redirect("/quanao");
  } catch (error) {
    console.log("lỗi xóa huy", error);
  }
});

router.get("/", function (req, res, next) {
  const token = req.cookies.jwt;
  console.log("huy token", token)
  if (token) {
    jwt.verify(token, config.secret, async (err, decodedToken) => {
      if (err) {
        console.log("lỗi", err)
        res.locals.user = null;
        next();
      } else {
        console.log("decodedToken:", decodedToken);
        let userObj = await user.findById(decodedToken._id);

        res.locals.user = userObj;
        const userName = userObj.hovaten;
        console.log("huy 17", userName)
        console.log("user: " + userObj);
        res.render("home", {
          layout: "main",
          user: userName,

        });
      }
    });
  } else {
    res.locals.user = null;

    next();
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie('jwt');
  res.redirect('/');
});



module.exports = router;

