const bcrypt = require("bcrypt");
const saltRounds = Number(process.env.SALT_ROUNDS);
const {setUser}=require("../utils/generateToken")
const { User } = require("../models/user");

function handleHomePage(req, res) {
    const message=req.query.msg||null;
  res.render("homepage", { message});
}

function handleLoginPage(req, res) {
  res.render("login", { message: null });
}

function handleGetSignUpPage(req, res) {
  res.render("signup", { message: null });
}

async function handlePostSignUpPage(req, res) {
  // console.log(req);
  const { name, email, role, password } = req.body;

  bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) {
      console.log("error",err);
      return res.render("signup", { message: "Some Error During SIGNUP" });
    }
    bcrypt.hash(password, salt, async function (err, hash) {
      if (err) {
        console.log("error",err);
        return res.render("signup", {
          message: "Some Error During Password and Salt Creating",
        });
      }
      const result = await User.create({
        name: name,
        email: email,
        role: role,
        password: hash,
        salt: salt,
      });
      console.log("Result:", result);
      return res.redirect("/login");
    });
  });
}

async function handlePostLogin(req, res) {
  const { email, password } = req.body;
  console.log(email, password);
  if (!email || !password) {
    console.log("no email or password ");
    return res.render("login", { message: "NO EMAIL OR PASSWORD" });
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    console.log("no user with such email");
    return res.render("signup", { message: "NO USER With Such email" });
  }

  bcrypt.compare(password, user.password, function (err, result) {
    if (result == true) {
        const token=setUser(user);
        res.cookie("token",token,{
            httpOnly:true,
            secure:false,
        })
      console.log(`user found ${user}`);
      return res.render("dashboard", { message: null,token:token,user});
    } else {
      console.log("wrong password");
      return res.render("login", { message: "WRONG PASSWORD" });
    }

    if (err) {
      console.log(`SomeErrorOccuredDuringPassWordMacthing. ERROR: ${err}`);
      return res.render("login", {
        message: "some error occured in password matching BCRYPT",
      });
    }
  });
}

module.exports = {
  handleHomePage,
  handleLoginPage,
  handleGetSignUpPage,
  handlePostSignUpPage,
  handlePostLogin,
};
