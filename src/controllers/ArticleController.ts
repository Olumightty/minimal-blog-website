import { Request, Response } from "express";
import { Post, PostSchema, Profile, User } from "../DB/schemas";
import { DOMPurify } from "../server";
import { getUserId, slugify, stripHtml } from "../lib/helpers";
import { InferSchemaType } from "mongoose";
import { uploadImage } from "../lib/cloudinary";
import fs from 'fs';
import { newArticleSchema } from "../lib/zod";


class ArticleController {
    NewArticle = async (req: Request, res: Response) => {
        if (stripHtml(req.body.body).trim() == '') throw new Error('Body is empty'); //remove all html tags
        const validate = newArticleSchema.safeParse(req.body); //zod validation
        if(!validate.success) throw new Error(validate.error.message);
        else{
            try {
                const post: InferSchemaType<typeof PostSchema>  = req.body;
                const imageUrl = req.file ? await uploadImage(req.file!) : '';
                // console.log(imageUrl)
                req.file && fs.unlinkSync(req.file!.destination + '/' + req.file!.filename); //delete the file from the server
                const id = await getUserId(req.session.user!.email);
                if(!id) throw new Error('User not found, error has ocurred');
                const profile = await Profile.findOne({user_id: id}) //link the authors profile id to the post
                if(!profile) throw new Error('User profile not found, error has ocurred');
                // console.log(id)
                const newPost = new Post({...post, slug: slugify(post.title!), body: DOMPurify.sanitize(post.body!), imageUrl, author_id: profile._id});
                await newPost.save();
                // throw new Error('Error uploading image to Cloudinary');
                res.status(201).json({message: "successfully created the article", slug: newPost.slug});
            } catch (error) {
                throw new Error('Failed to create article', error);
            }
            
        }
    }
}

export const Article = new ArticleController()