import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import NewsModel from "../../models/news.mjs";
import UsersModel from "../../models/adminUsers.mjs";
const router = Router();

router.get(["/", "/signIn", "/logIn"], async (req, res) => {
  if (req.headers.cookie != null) {
    let nToken = req.headers.cookie.split("=");
    let jwtToken = jwt.decode(nToken[1]);
    res.redirect("/admin/newsForm")
  } else {
    res.render("admin/signIn.ejs", { registration: "true", authenticate: "true" })
  }
})

router.post("/signIn", async (req, res) => {
  try {
    const body = req.body;
    const { name, email, password } = body;

    const hashedPassword = await bcrypt.hash(password, 5);

    const newUser = new UsersModel({
      name,
      email,
      password: hashedPassword
    });

    const user = await UsersModel.findOne({ email });
    if (user == null) {
      await newUser.save().then((newUser) => {
        const token = jwt.sign({ _id: newUser._id, email: newUser.email, userName: newUser.name }, process.env.SECRET, { expiresIn: '60 days' });
        res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
        res.redirect("/admin/newsForm");
      });
    } else {
      res.render("admin/signIn.ejs", { registration: "false", authenticate: "true" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error.");
  }
});

router.post("/login", async (req, res) => {
  const { body } = req;
  const { email, password } = body;

  const user = await UsersModel.findOne({ email });
  if (user != null) {
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const token = jwt.sign({ _id: user._id, email: user.email, userName: user.name }, process.env.SECRET, {
        expiresIn: '60 days',
      });
      res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
      res.redirect("/admin/newsForm");
    } else {
      res.render("admin/signIn.ejs", { registration: "true", authenticate: "false" });
    }
  } else {
    res.render("admin/signIn.ejs", { registration: "true", authenticate: "false" });
  }
});

router.get("/newsForm", (req, res) => {
  if (req.headers.cookie != null) {
    let nToken = req.headers.cookie.split("=");
    let jwtToken = jwt.decode(nToken[1]);
    res.render("admin/newsForm.ejs", { userName: jwtToken.userName, email: jwtToken.email })
  } else {
    res.redirect("/admin/signIn")
  }
})

router.post("/newsForm", async (req, res) => {
  try {
    if (req.headers.cookie != null) {
      const { body } = req;
      const { title, content, author, banner, link, image } = body;
      const news = await NewsModel.findOne({ title });
      body.published = new Date().toDateString();
      if (news == null) {
        const newsArticle = new NewsModel(body);
        await newsArticle.save();
      } else {
        const myQuery = { title: title };
        const newValues = { $set: { title: title, content: content, published: body.published, author: author, banner: banner, link: link, image: image } }
        await NewsModel.updateOne(myQuery, newValues);
      }
      res.redirect("/admin/editNews");
    } else {
      res.render('admin/logoutPage.ejs');
    }
  } catch (error) {
    console.log(error);
    res.status(500)
  }
})

router.get("/editNews", async (req, res) => {
  if (req.headers.cookie != null) {
    let nToken = req.headers.cookie.split("=");
    let jwtToken = jwt.decode(nToken[1]);
    const news = await NewsModel.find().sort({ published: -1 });
    res.render("admin/editNews.ejs", { news, userName: jwtToken.userName, email: jwtToken.email })
  } else {
    res.render('admin/logoutPage.ejs');
  }
})

router.post("/newsEdit", async (req, res) => {
  try {
    if (req.headers.cookie != null) {
      let nToken = req.headers.cookie.split("=");
      let jwtToken = jwt.decode(nToken[1]);
      const { body } = req;
      const { title } = body;
      const news = await NewsModel.findOne({ title });
      res.render("admin/editForm.ejs", { userName: jwtToken.userName, email: jwtToken.email, news })
    } else {
      res.render('admin/logoutPage.ejs');
    }
  } catch (error) {
    console.log(error);
    res.status(500)
  }
})

router.post("/newsDelete", async (req, res) => {
  try {
    if (req.headers.cookie != null) {
      const { body } = req;
      const { title } = body;
      await NewsModel.deleteOne({ title });
      res.redirect("/admin/editNews");
    } else {
      res.render('admin/logoutPage.ejs');
    }
  } catch (error) {
    console.log(error);
    res.status(500)
  }
})

router.get('/logout', (req, res) => {
  res.clearCookie('nToken');
  return res.render('admin/logoutPage.ejs');
});

export default router;