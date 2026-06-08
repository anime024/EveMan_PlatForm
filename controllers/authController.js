const bcrypt = require("bcrypt");
const saltRounds = Number(process.env.SALT_ROUNDS);
const {setUser}=require("../utils/generateToken")
const { User } = require("../models/user");

function handleHomePage(req, res) {
    const message=req.query.msg||null;
  res.render("homepage", { message});
}

function handleLoginPage(req, res) {
  let message=req.query.msg||null;
  res.render("login", { message });
}

function handleGetSignUpPage(req, res) {
  let message=req.query.msg||null;
  res.render("signup", { message });
}

async function handlePostSignUpPage(req, res) {
  // console.log(req);
  const { name, email, role, password } = req.body;

  const existingUserAny=await User.findOne({email});
  if(existingUserAny)
  {
    console.log(' USER WITH THIS EMAIL ALREADY EXIST ');
    return res.redirect('/signup?msg=User with this email already exist ');
  }

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
      return res.redirect("/login?msg=Signup Succesfull ");
    });
  });
}

async function handlePostLogin(req, res) {
  const { email, password } = req.body;
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

      if(user.role==='admin')
        return res.redirect('/admin/dashboard?msg=Login Succesfull')

      return res.render("userDashboard", { message: null,token:token,user});
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
