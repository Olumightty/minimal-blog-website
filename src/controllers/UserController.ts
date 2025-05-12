import { Request, Response } from 'express';
import { getUserId, stripHtml } from '../lib/helpers';
import { Post, PostSchema, Profile, ProfileSchema, User } from '../DB/schemas';
import fs from 'fs';
import { updateArticleSchema, updateProfileSchema } from '../lib/zod';
import { uploadImage } from '../lib/cloudinary';
import { InferSchemaType } from 'mongoose';
import { DOMPurify } from '../server';

class UserController {
  UpdateProfile = async (req: Request, res: Response) => {
    const updateData = req.body;
    // console.log(updateData)
    // console.log('Hi')
    const validate = updateProfileSchema.safeParse({
      ...updateData,
      social_links: JSON.parse(updateData.social_links),
    }); //zod validation
    if (!validate.success) {
      return res
        .status(400)
        .json({ error: 'Provided Credentials may be Invalid' });
    }
    const profile: InferSchemaType<typeof ProfileSchema> = {
      username: validate.data.username,
      demographics: {
        phone: validate.data.phone,
        location: validate.data.location,
        website: validate.data.website,
        birthday: new Date(validate.data.birthdate),
        gender: validate.data.gender as undefined,
      },
      bio: {
        short: validate.data.bio,
        extended: validate.data.extendedBio,
      },
      socialLinks: [] as undefined, //initialize socialLinks as an empty array to escape the type error,
      accountRecovery: {
        recoveryEmail: validate.data.recovery_email,
      },
    };
    console.log(validate.data.social_links);
    try {
      let avatar = req.file ? await uploadImage(req.file!) : '';
      // console.log(avatar)
      if (req.file)
        fs.unlinkSync(req.file!.destination + '/' + req.file!.filename); //delete the file from the server
      const id = await getUserId(req.session.user!.email);
      if (!id) throw new Error('User not found, error has ocurred');
      if (!avatar.trim()) {
        avatar = req.session.user!.avatar; //if no new image is uploaded, use the old one
      }
      const updateUser = await User.findByIdAndUpdate(
        id,
        { avatar },
        { new: true }
      );
      if (!updateUser) throw new Error('User not found, error has ocurred');
      const updateProfile = await Profile.findOneAndUpdate(
        { user_id: id },
        { ...profile, avatar, socialLinks: validate.data.social_links },
        { new: true }
      );
      if (!updateProfile)
        throw new Error('User profile not found, error has ocurred');
      req.session.user!.avatar = avatar; //update the session user avatar
      return res
        .status(200)
        .json({ message: 'successfully updated the profile' });
    } catch (error) {
      return res
        .status(500)
        .json({ error: `Failed to update profile ${error}` });
    }
  };

  UpdateArticle = async (req: Request, res: Response) => {
    const article_id = req.params.id;
    if (stripHtml(req.body.body).trim() == '') throw new Error('Body is empty'); //remove all html tags
    const validate = updateArticleSchema.safeParse(req.body); //zod validation
    if (!validate.success) throw new Error(validate.error.message);
    else {
      try {
        const post: InferSchemaType<typeof PostSchema> = req.body;
        const imageUrl = req.file
          ? await uploadImage(req.file!)
          : validate.data.imageUrl;
        // console.log(imageUrl)
        if (req.file)
          fs.unlinkSync(req.file!.destination + '/' + req.file!.filename); //delete the file from the server
        const id = await getUserId(req.session.user!.email);
        if (!id) throw new Error('User not found, error has ocurred');
        const profile = await Profile.findOne({ user_id: id }); //link the authors profile id to the post
        if (!profile)
          throw new Error('User profile not found, error has ocurred');
        // console.log(id)
        const updatePost = await Post.findOneAndUpdate(
          { author_id: profile.id, _id: article_id },
          {
            ...post,
            body: DOMPurify.sanitize(post.body!),
            imageUrl,
            updatedAt: new Date(),
          }
        );
        if (!updatePost) throw new Error('Post not found');
        // throw new Error('Error uploading image to Cloudinary');
        res.status(201).json({
          message: 'successfully updated the article',
          slug: updatePost.slug,
          status: updatePost.status,
        });
      } catch (error) {
        throw new Error(`Failed to create article ${error}`);
      }
    }
  };
}

export const UserAction = new UserController();
