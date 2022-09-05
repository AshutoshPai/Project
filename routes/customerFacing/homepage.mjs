import { Router } from "express";
import NewsModel from "../../models/news.mjs";
import SportsNewsModel from "../../models/sportsNews.mjs";
import ConatctUsModel from "../../models/contactUs.mjs";

const router = Router();

router.get(["/", "/home"], async (req, res) => {

    const news = await NewsModel.find().sort({ published: -1 }).limit(3);
    res.render("customerFacing/homepage.ejs", { news })
})

router.get("/sports", async (req, res) => {

    const sportsNews = await SportsNewsModel.find().sort({ published: -1 }).limit(3);
    res.render("customerFacing/sports.ejs", { sportsNews })
})

router.get("/aboutUs", async (req, res) => {
    res.render("customerFacing/aboutUs.ejs")
})

router.get("/contactUs", async (req, res) => {
    res.render("customerFacing/contactUs.ejs")
})

router.post("/contactUs", async (req, res)=>{
    try {
        const { body } = req;
        const contactUsDetails = new ConatctUsModel(body);
        await contactUsDetails.save();
        res.render("customerFacing/querySubmittedPage.ejs");
    } catch (error) {
        console.log(error);
        res.status(500)
    }
})

export default router;