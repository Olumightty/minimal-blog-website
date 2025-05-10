import { Request, Response } from 'express';
import { getUserId } from '../lib/helpers';
import { Profile, ProfileSchema, User } from '../DB/schemas';
import fs from 'fs';
import { updateProfileSchema } from '../lib/zod';
import { uploadImage } from '../lib/cloudinary';
import { InferSchemaType } from 'mongoose';

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
      const avatar = req.file ? await uploadImage(req.file!) : '';
      // console.log(avatar)
      if (req.file)
        fs.unlinkSync(req.file!.destination + '/' + req.file!.filename); //delete the file from the server
      const id = await getUserId(req.session.user!.email);
      if (!id) throw new Error('User not found, error has ocurred');
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
}

export const UserAction = new UserController();
