
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { findUserByEmail } from '../user/user.service';

export const authenticateUser = async (credentials: any) => {
  const user = await findUserByEmail(credentials.email);
  if (!user) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
  if (!isPasswordValid) {
    return null;
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your_jwt_secret', {
    expiresIn: '1h',
  });

  return token;
};
