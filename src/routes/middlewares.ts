import { NextFunction, Request, Response } from 'express';

export const userVerfied = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session.user!.verified) {
    if (req.url === '/validate-email') return res.redirect('/');
    next();
  } else {
    res.render('validate-email'); // a prompt to verify your email
  }
};

export const isSignedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/signin');
  }
};
