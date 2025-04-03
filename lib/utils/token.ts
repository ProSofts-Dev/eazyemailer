import { encode } from "next-auth/jwt";

export async function generateApiToken(userId: string): Promise<string> {
    // Create token payload
    const tokenData = {
      id: userId,
      type: 'api_key',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60), // 1 year expiry
    };
  
    // Generate JWT token
    const token = await encode({
      token: tokenData,
      secret: process.env.NEXTAUTH_SECRET || '',
    });
  
    // Return formatted API token
    return `${token}`;
}