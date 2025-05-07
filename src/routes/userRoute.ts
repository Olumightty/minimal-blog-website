import express from "express";
import { getUserId } from "../lib/helpers";
import { Post, Profile } from "../DB/schemas";
import { upload } from "./articleRoute";
import { UserAction } from "../controllers/UserController";


export const userRouter =  express.Router()

userRouter.get('/profile', async(req, res) => {
    try {
        const  id = await getUserId(req.session.user!.email);
        if(!id) throw new Error('User not found');
        const profile = await Profile.findOne({user_id: id}).populate('user_id');
        if(!profile) throw new Error('User profile not found');
        res.render('user/profile', {profile})
    } catch (error) {
        throw new Error('Could not fetch the user', error);
    }
})

userRouter.patch('/profile', upload.single('avatar'), UserAction.UpdateProfile as any)


userRouter.get('/drafts', async(req, res) => {
    try {
        const  id = await getUserId(req.session.user!.email);
        if(!id) throw new Error('User not found');
        const drafts = await Post.find({author_id: id, status: 'draft'}).populate('author_id');
        res.render('user/drafts', {drafts})
    } catch (error) {
        throw new Error('Could not fetch the user', error);
    }
})