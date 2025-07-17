import jwt from 'jsonwebtoken';
import { cookies } fromnext/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export interface User[object Object]
  email: string;
  createdAt: string;
}

export async function getCurrentUser(): Promise<User | null> {
  try [object Object] const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    
    if (!token) {
      return null;
    }
    
    const decoded = jwt.verify(token, JWT_SECRET) as User;
    return decoded;
  } catch (error)[object Object]
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

export function verifyToken(token: string): User | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as User;
    return decoded;
  } catch (error)[object Object]
    return null;
  }
} 