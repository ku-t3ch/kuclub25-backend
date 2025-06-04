import jwt from 'jsonwebtoken';

export interface JWTPayload {
  type: 'client';
  iat: number;
  exp: number;
}

export const generateStaticToken = (): string => {
  const payload: JWTPayload = {
    type: 'client',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
  };

  return jwt.sign(payload, process.env.JWT_SECRET || 'default-secret');
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as JWTPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Add this export for backward compatibility
export const getClientToken = generateStaticToken;