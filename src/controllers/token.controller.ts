import { Request, Response } from 'express';
import { generateStaticToken } from '../utils/jwt';

export const getToken = (req: Request, res: Response): void => {
  const clientSecret = req.headers['x-client-secret'];
  
  if (clientSecret !== process.env.CLIENT_SECRET_1) {
    res.status(403).json({ 
      success: false,
      message: 'Invalid client secret' 
    });
    return;
  }

  const token = generateStaticToken();
  
  res.json({
    success: true,
    token,
    expiresIn: '7d',
    type: 'Bearer'
  });
};