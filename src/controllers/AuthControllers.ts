import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { Profile, User } from '../DB/schemas';
import { loginSchema, newUserSchema } from '../lib/zod';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { sendPasswordResetEmail, sendVerificationEmail } from '../lib/mailing';
import { token } from 'morgan';
import { z } from 'zod';
import { DOMPurify } from '../server';

class AuthController {
  SignIn = async (req: Request, res: Response) => {
    const user = req.body;
    const validateUserInput = loginSchema.safeParse(user);
    if (!validateUserInput.success)
      throw new Error(validateUserInput.error.message);
    else {
      try {
        const user = await User.findOne({
          email: validateUserInput.data.email,
        });
        if (!user) throw new Error('User doees not exists');
        if (!user.password)
          throw new Error('User was not created with Email/Password');
        const isValidPassword = await bcrypt.compare(
          validateUserInput.data.password,
          user.password!
        );
        if (!isValidPassword) throw new Error('Invalid Password');
        req.session.user = {
          name: user.name,
          email: user.email,
          role: user.role,
          verified: user.verified,
          avatar: user.avatar!,
        };
        res
          .status(201)
          .json({ message: 'successfully signed in', authenticated: true });
      } catch (error) {
        res.status(400).json({
          message: `Failed to sign in ${error}`,
          authenticated: false,
        });
      }
    }
  };

  SignUp = async (req: Request, res: Response) => {
    const user = req.body;
    const validateUserInput = newUserSchema.safeParse(user);
    if (!validateUserInput.success)
      throw new Error(validateUserInput.error.message);
    else {
      try {
        const user = await User.findOne({
          email: validateUserInput.data.email,
        });
        if (user) throw new Error('User already exists');
        const hashPassword = await bcrypt.hash(
          validateUserInput.data.password,
          Number(process.env.SALT_ROUNDS)
        );
        if (!hashPassword) throw new Error('Could not hash password');
        const newUser = new User({
          name:
            validateUserInput.data.firstName +
            ' ' +
            validateUserInput.data.lastName,
          password: hashPassword,
          email: validateUserInput.data.email,
        });
        await newUser.save();
        const randomDigits = Math.floor(Math.random() * 1000);
        const newProfile = new Profile({
          user_id: newUser._id,
          username: validateUserInput.data.firstName + randomDigits,
          avatar: newUser.avatar!,
        });
        // console.log(newProfile)
        await newProfile.save();
        // console.log(resp)
        req.session.user = {
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          verified: newUser.verified,
          avatar: newUser.avatar!,
        };
        
        res
          .status(201)
          .json({ message: 'account successfully created', created: true });
      } catch (error) {
        // console.log(error)
        throw new Error(`Failed to create user ${error}`);
      }
    }
  };

  ValidateEmail = async (req: Request, res: Response) => {
    const otp = req.body.otp.trim() as string;
    try {
      const user = await User.findOne({ email: req.session.user!.email });
      if (!user) throw new Error('User not found');
      const validOtp = jwt.verify(
        user.verificationToken!,
        process.env.JWT_SECRET as string
      ) as JwtPayload;
      if (!validOtp) throw new Error('This OTP is not valid anymore');
      if (validOtp.otp != otp) throw new Error('Wrong OTP');
      const updateUser = await User.updateOne(
        { email: req.session.user!.email },
        { $set: { verified: true } }
      );
      if (!updateUser.acknowledged)
        throw new Error('Could not update verification status');
      req.session.user = {
        name: user.name,
        email: user.email,
        role: user.role,
        verified: true,
        avatar: user.avatar!,
      };
      res
        .status(201)
        .json({ message: 'Email successfully verified', verified: true });
    } catch (error) {
      throw new Error(`Failed to verify email ${error}`);
    }
  };

  VerifyEmail = async (req: Request, res: Response) => {
    try {
      const response = sendVerificationEmail(req.session.user!.email);
      if (!response) throw new Error('Could not send email');
      res.status(201).json({ message: 'Email successfully sent', status: true });
    } catch (error) {
      throw new Error(`Failed to send email ${error}`);
    }
    
  };

  ForgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    const validateEmail = z.string().email().transform((email) => DOMPurify.sanitize(email));
    const va = validateEmail.safeParse(email);

    try {
      if(!va) {
        res.status(400).json({ message: 'Invalid Email', status: false});
        return
      }
      const user = await User.findOne({ email });
      if(!user) {
        res.status(400).json({ message: 'Email does not exist', status: false});
        return
      }
      const response = await sendPasswordResetEmail(req.body.email);
      if (!response) throw new Error('Could not send email');
      res.status(201).json({ message: 'Email successfully sent', status: true, token: response.otpToken });
    } catch (error) {
      res.status(400).json({error, status: false});
      throw new Error(`Failed to send email ${error}`);
    }
  };

  ResetPassword = async (req: Request, res: Response) => {
    const { oldPassword, newPassword, confirmPassword, resetToken } = req.body;
    try {
      const verifyToken = jwt.verify(resetToken as string, process.env.JWT_SECRET as string) as JwtPayload;
      if (!verifyToken) throw new Error('Invalid token');
      const user = await User.findOne({ email: verifyToken.email });
      if (!user) throw new Error('Invalid token');
      const comparePassword = await bcrypt.compare(oldPassword, user.password);
      if (!comparePassword) throw new Error('Invalid password');
      if (newPassword !== confirmPassword) throw new Error('Passwords do not match');
      const hashPassword = await bcrypt.hash(newPassword, Number(process.env.SALT_ROUNDS));
      if (!hashPassword) throw new Error('Could not hash password');
      const updatePassword = await User.updateOne( 
        { email: user.email },
        { $set: { password: hashPassword, resetToken: null } }
      );
      if (!updatePassword.acknowledged)
        throw new Error('Could not update password');
      res.status(201).json({ message: 'Password successfully updated', status: true });
    } catch (error) {
      res.status(400).json({error, status: false});
      throw new Error(`Failed to update password ${error}`);
    }
  };
}

export const Auth = new AuthController();
