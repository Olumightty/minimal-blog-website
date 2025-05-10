import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../DB/schemas';

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
