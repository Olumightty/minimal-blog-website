import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../DB/schemas';
import nodemailer from 'nodemailer';

var transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for 587
  auth: {
    user: "ayoolaolumide98@gmail.com",
    pass: "ffgtgkvgifjsyvxx"
  },
  tls: {
    rejectUnauthorized: false
  }
});


export const sendVerificationEmail = async (email: string) => {
  const otp = Math.floor(1000 + Math.random() * 9000).toString(); //randomly generate 4 digit otp
  try {
    const otpToken = jwt.sign({ otp }, process.env.JWT_SECRET as string, {
      expiresIn: '5m',
    });
    if (!otpToken) throw new Error('Could not generate token');
    const addToken = await User.updateOne(
      { email },
      { $set: { verificationToken: otpToken } }
    );
    if (!addToken) throw new Error('Could not insert token to user');
    console.log(otp); //send otp to email

    const info = await transport.sendMail({
      from: '"Ayoola Olumide" <ayoolaolumide98@gmail.com>',
      to: email,
      subject: "Reset Password",
      html: `<h1>${otp}</button></h1>`, // HTML body
    });

    console.log("OTP Message sent:", info.messageId);
    return true;
  } catch (error) {
    return error ? false : false;
  }
};

export const getOTPTime = async (email: string) => {
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');
    const validOtp = jwt.verify(
      user.verificationToken!,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    if (!validOtp) throw new Error('This OTP is not valid anymore');
    return validOtp.exp! - Math.floor(Date.now() / 1000);
  } catch (error) {
    return error ? false : false;
  }
};


export const sendPasswordResetEmail = async (email: string) => {
  const otp = Math.floor(1000 + Math.random() * 9000).toString(); //randomly generate 4 digit otp
  try {
    const otpToken = jwt.sign({ otp, email }, process.env.JWT_SECRET as string, {
      expiresIn: '5h',
    });
    if (!otpToken) throw new Error('Could not generate token');
    const addToken = await User.updateOne(
      { email },
      { $set: { resetToken: otpToken } }
    );
    if (!addToken) throw new Error('Could not insert reset token to user');
    const resetURL = `${process.env.SERVER_URL}/reset-password?token=${otpToken}`; //send otp to email




    const info = await transport.sendMail({
      from: '"Ayoola Olumide" <ayoolaolumide98@gmail.com>',
      to: email,
      subject: "Reset Password",
      html: `<a href="${resetURL}"><button>Rest Password</button></a>`, // HTML body
    });
  
    console.log("Reset Message sent:", info.messageId);
    return {otpToken};
  } catch (error) {
    // console.log(error);
    return error ? false : false;
  }
};
