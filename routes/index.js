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
const admin = require("../models/admin");
var quanao = require("../models/quanao");
const parser = bodyParser.urlencoded({ extended: true });

router.use(parser);
router.get("/quanao", (req, res, next) => {
  const token = req.cookies.jwt;
  console.log(`jwt ${token}`);
  console.log("huy token :" + token)
  if (token) {
    jwt.verify(token, config.secret, (err, decodedToken) => {
      console.log(typeof jwt);
      if (err) {
        console.log("lỗi", err.message);
        res.redirect('api/signin');
      } else {
        console.log(decodedToken);
        req.decodedToken = decodedToken; // đưa biến decodedToken vào đối tượng req
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
    let userObj = await user.findById(req.decodedToken._id); // truy cập biến decodedToken từ đối tượng req
    res.locals.user = { uyquyen: userObj.uyquyen }; // lưu trữ giá trị của uyquyen trong đối tượng res.locals
    const [userResponse, quanaoResponse] = await Promise.all([
      axios.get("http://localhost:3000/api/user", {
        headers: { Authorization: `jwt ${token}` },
      }),
      axios.get("http://localhost:3000/api/quanao", {
        headers: { Authorization: `jwt ${token}` },
      }),
    ]);
    const data = quanaoResponse.data;
    console.log(userObj.capquyen+"llllll")
    res.render("quanao", {
      Title: "quanao",
      data: data,
      capquyen:userObj.capquyen,
      them:userObj.capquyen
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/quanao/admin", (req, res, next) => {
  const token = req.cookies.jwt;
  console.log(`jwt ${token}`);
  console.log("huy token :" + token)
  if (token) {
    jwt.verify(token, config.secret, (err, decodedToken) => {
      console.log(typeof jwt);
      if (err) {
        console.log("lỗi", err.message);
        res.redirect('api/signin');
      } else {
        console.log(decodedToken);
        req.decodedToken = decodedToken;
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
    let userObj = await user.findById(req.decodedToken._id); // truy cập biến decodedToken từ đối tượng req
   
    const [userResponse, quanaoResponse] = await Promise.all([
      axios.get("http://localhost:3000/api/user", {
        headers: { Authorization: `jwt ${token}` },
      }),
      axios.get("http://localhost:3000/api/quanao", {
        headers: { Authorization: `jwt ${token}` },
      }),
    ]);
    const data = quanaoResponse.data;
   
    res.render("quanlyquanaoadmin", {
      Title: "quanlyquanaoadmin",
      data: data,
     
    });
  } catch (error) {
    console.log(error);
  }
});


router.get("/quanao/quyenuser", (req, res, next) => {
  const token = req.cookies.jwt;
  console.log(`jwt ${token}`);
  console.log("huy token :" + token)
  if (token) {
    jwt.verify(token, config.secret, (err, decodedToken) => {
      console.log(typeof jwt);
      if (err) {
        console.log("lỗi", err.message);
        res.redirect('api/signin');
      } else {
        console.log(decodedToken);
        req.decodedToken = decodedToken;
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
    let userObj = await user.findById(req.decodedToken._id); // truy cập biến decodedToken từ đối tượng req
    res.locals.user = { cap: userObj.uyquyen }; // lưu trữ giá trị của uyquyen trong đối tượng res.locals
    const [userResponse, quanaoResponse] = await Promise.all([
      axios.get("http://localhost:3000/api/user", {
        headers: { Authorization: `jwt ${token}` },
      }),
      axios.get("http://localhost:3000/api/quanao", {
        headers: { Authorization: `jwt ${token}` },
      }),
    ]);
    const data = quanaoResponse.data;
    console.log(userObj.capquyen+"llllll")
    res.render("quanao", {
      Title: "quanao",
      data: data,
      capquyen:userObj.capquyen,
      them:userObj.capquyen
    });
  } catch (error) {
    console.log(error);
  }
});


/// user
router.get("/user", (req, res, next) => {
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
  const token = req.cookies.jwt;


  try {
    const response = await axios.get("http://localhost:3000/api/user", {
      headers: { Authorization: `jwt ${token}` },
    });
    const data = response.data;
    res.render("user", {
      Title: "user",
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
});
router.get('/timuser', async function (req, res) {
  const token = req.cookies.jwt;

  try {
    const query = req.query.query;
    const response = await axios.get(`http://localhost:3000/api/search_user?name=${query}`, {
      headers: { Authorization: `jwt ${token}` },
    });
    const data = response.data;
    res.render("user", {
      Title: "Tìm user",
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
});
router.get('/xoauser/:id', async function (req, res) {
  const token = req.cookies.jwt;
  const userId = req.params.id;
  console.log("lỗi xóa", userId)
  try {
    const response = await axios.get(`http://localhost:3000/api/xoa_user/${userId}`, {
      headers: { Authorization: `jwt ${token}` },
    });
    console.log(" xóa data");
    const data = response.data;
    console.log(" xóa data",data);
    res.redirect("/user");
  } catch (error) {
    console.log("lỗi xóa huy", error);
  }
});
///

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
    res.redirect("/quanao/admin");
  } catch (error) {
    console.log("lỗi xóa huy", error);
  }
});
router.get('/quanao/:id', async function(req, res) {
  const quanaoId = req.params.id;

  try {
    const quanaos = await quanao.findById(quanaoId);
    res.render('update', { 
      object: quanaos.toJSON()
   
    });
    console.log("huy dau moi",quanaos.toJSON());
    
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
router.post('/quanao/:id', async function(req, res) {
  const quanaoId = req.params.id;

  try {
    console.log('Id: ' + quanaoId);
    console.log(req.body);
     const quanaos = await quanao.findByIdAndUpdate({_id:quanaoId}, req.body);
    res.redirect('/quanao/admin')
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
router.get("/", function (req, res, next) {
  const token = req.cookies.jwt;
  console.log("huy token hi", token)
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

// admin
router.get("/admin", function (req, res, next) {
  const token = req.cookies.jwt;
  console.log("huy token hi", token)
  if (token) {
    jwt.verify(token, config.secret, async (err, decodedToken) => {
      if (err) {
        console.log("lỗi", err)
        res.locals.admin = null;
        next();
      } else {
        console.log("decodedToken:", decodedToken);
        let userObj = await admin.findById(decodedToken._id);

        res.locals.admin = userObj;
        const userName = userObj.hovaten;
        console.log("huy 17", userName)
        console.log("admin: " + userObj);
        res.render("homeadmin", {
          layout: "main",
          tenadmin: userName,
        });
      }
    });
  } else {
    res.locals.admin = null;

    next();
  }
});
router.get("/profile", function (req, res, next) {
  const token = req.cookies.jwt;
  console.log("huy token hi", token)
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
        const anh = userObj.anhdaidien;
        const username = userObj.username;
    
        console.log("huy 17", userName)
        console.log("huy 17", anh)
        console.log("huy 17", username)
        console.log("user: " + userObj);
        res.render("profile", {
          layout: "main",
          user: userName,
          anh:anh,
          username:username,
          id:decodedToken._id
          
        });
      }
    });
  } else {
    res.locals.user = null;

    next();
  }
});
router.get('/profile/:id', async function(req, res) {
  console.log("cpaaj nhat profile")
  const quanaoId = req.params.id;

  try {
    const quanaos = await user.findById(quanaoId);
    res.render('updateuser', { 
      object: quanaos.toJSON()
   
    });
    
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
router.post('/profile/:id', async function(req, res) {
  const userId = req.params.id;

  try {
    console.log('Id: ' + userId);
    console.log(req.body);
     const quanaos = await user.findByIdAndUpdate({_id:userId}, req.body);
     console.log("cạp nhật user",quanaos )
    res.redirect('/profile')
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});





router.get("/logout", (req, res) => {
  res.clearCookie('jwt');
  res.redirect('/');
});



module.exports = router;

