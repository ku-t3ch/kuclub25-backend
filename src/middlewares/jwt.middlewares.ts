import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '../utils/jwt';

export interface AuthRequest extends Request {
  client?: JWTPayload;
}

export const authenticateClient = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    res.status(401).json({ 
      success: false,
      message: 'Access token required' 
    });
    return;
  }

  try {
    const decoded = verifyToken(token);
    req.client = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(403).json({ 
      success: false,
      message: 'Invalid or expired token' 
    });
  }
};

export const publicAccess = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  // Optional: Add token if provided, but don't require it
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token) {
    try {
      const decoded = verifyToken(token);
      req.client = decoded;
    } catch (error) {
      // Ignore token errors for public endpoints
      console.warn('Invalid token provided for public endpoint:', error);
    }
  }
  
  next();
};