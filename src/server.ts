import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./DB/mongoclient";
import { migratePosts } from "./DB/migrate";
import { Post, PostSchema } from "./DB/schemas";
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { slugify, stripHtml } from "./lib/helpers";
import { InferSchemaType } from "mongoose";
import multer from 'multer';
import path from "path";
import { uploadImage } from "./lib/cloudinary";
import fs from 'fs';
import { newArticleSchema } from "./lib/zod";
import { getOTPTime, sendVerificationEmail } from "./lib/mailing";
import session from 'express-session';
import connectMongo from 'connect-mongo';
import { isSignedIn } from "./routes/middlewares";
import { Auth } from "./controllers/AuthControllers";
import { userRouter } from "./routes/userRoute";
import { Article } from "./controllers/ArticleController";
import { articleRouter } from "./routes/articleRoute";


declare module 'express-session' {
    interface SessionData{
        user: {
            name: string;
            email: string;
            role: 'user' | 'admin';
            verified: boolean;
            avatar: string;
        }
    }
}

const window = new JSDOM('').window;
export const DOMPurify = createDOMPurify(window);

dotenv.config();
export const app = express();

app.use(express.static("public"));
app.use(bodyParser.json()); //ejsures application/json type body is parsed
app.use(bodyParser.urlencoded({ extended: true}));
app.use(morgan('dev'))
app.use(session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 12, //12 hours
        httpOnly: true
    },
    store: connectMongo.create({
        mongoUrl: process.env.MONGO_URL as string
    })

}))




app.set("view engine", "ejs");

app.get("/signup", (req, res) => {
    res.render("signUp");
})

app.get("/logout", (req, res) => {
    req.session.destroy(function(err) {res.redirect("/signin");});
    
})

app.get("/signin", (req, res) => {
    res.render("signIn");
})

app.post("/signin", Auth.SignIn)

app.post("/signup", Auth.SignUp)

app.get("/validate-email", async (req, res) => {
     const timeLeft = await getOTPTime(req.session.user!.email);
    res.render("validate-email", {timeLeft: timeLeft as number | 0});
})

app.get("/resend-otp", async (req, res) => {
    const response = sendVerificationEmail(req.session.user!.email)
    if(!response) throw new Error('Could not send email');
    res.status(201).json({message: "Email successfully sent", sent: true});
})

app.post("/validate-email", Auth.ValidateEmail)

app.get("/", async(req, res) => {
    try {
        const posts = await Post.find().limit(3).sort({created_at: -1});
        const countByCategory = await Post.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    category: { $first: '$category' }
                }
            }
        ]);   
        if(!posts){
            res.render("home", {recentPosts: [], countByCategory: []});
        }
        else{
            res.render("home", {recentPosts: posts, countByCategory: countByCategory});
        }
    } catch (error) {
        res.render("404")
        throw new Error(`Could not fetch the article ${error}`);
    }
    
})

app.get("/user/avatar", (req, res) => {
    // res.json({avatar: req.session.user!.avatar})
    const avatar = req.session.user!.avatar
    const name = req.session.user!.name
    res.json({avatar, name})
})


// app.get("/migrate", (req, res) => {
//     migratePosts();
//     res.send("done");
// })

app.use('/article', articleRouter)
app.use('/user', isSignedIn, userRouter)
app.listen(process.env.PORT, () => {
    connectDB()
    console.log("server is running")
});