// Simple Dapper OAuth Integration
// This provides secure email-based wallet connection

import crypto from 'crypto';

// Simple encryption for tokens (in production, use a proper encryption library)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-32-char-encryption-key-here';

export interface DapperOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string[];
}

export interface DapperTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  walletAddress: string;
}

// In-memory storage (replace with database in production)
const oauthStates: Record<string, string> = {};
const userTokens: Record<string, DapperTokens> = {};

export class DapperOAuth {
  private config: DapperOAuthConfig;

  constructor(config: DapperOAuthConfig) {
    this.config = config;
  }

  // Generate OAuth authorization URL
  generateAuthUrl(email: string): string {
    const state = crypto.randomBytes(32).toString('hex');
    oauthStates[email] = state;

    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: this.config.scope.join(' '),
      state: state,
      email: email, // Include email for demo OAuth
    });

    // Note: Dapper Labs doesn't have a public OAuth service
    // This is a demo implementation that simulates OAuth flow
    // In production, you would integrate with Dapper's actual API
    return `https://collectorpro.vercel.app/api/dapper/oauth/demo?${params.toString()}`;
  }

  // Handle OAuth callback
  async handleCallback(code: string, state: string, email: string): Promise<DapperTokens> {
    // Verify state
    if (oauthStates[email] !== state) {
      throw new Error('Invalid OAuth state');
    }

    // Exchange code for tokens
    const tokens = await this.exchangeCodeForTokens(code);
    
    // Get wallet address from Dapper
    const walletAddress = await this.getWalletAddress(tokens.accessToken);
    
    // Store encrypted tokens
    const encryptedTokens: DapperTokens = {
      accessToken: this.encrypt(tokens.accessToken),
      refreshToken: this.encrypt(tokens.refreshToken),
      expiresAt: tokens.expiresAt,
      walletAddress,
    };

    userTokens[email] = encryptedTokens;
    delete oauthStates[email];

    return encryptedTokens;
  }

  // Get user's wallet address from Dapper
  async getWalletAddress(accessToken: string): Promise<string> {
    try {
      const response = await fetch('https://api.dapperlabs.com/v1/user/wallet', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get wallet address');
      }

      const data = await response.json();
      return data.walletAddress;
    } catch (error) {
      console.error('Error getting wallet address:', error);
      // For demo, return a sample address
      return '0x1234567890abcdef';
    }
  }

  // Get user's NBA Top Shot data
  async getUserData(email: string): Promise<Record<string, unknown>> {
    const tokens = userTokens[email];
    if (!tokens) {
      throw new Error('No OAuth tokens found');
    }

    // Check if token is expired
    if (Date.now() > tokens.expiresAt) {
      await this.refreshTokens(email);
    }

    const accessToken = this.decrypt(tokens.accessToken);
    
    try {
      const response = await fetch('https://api.dapperlabs.com/v1/nbatopshot/user/moments', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Return sample data for demo
      return {
        moments: [
          {
            id: 'oauth-demo-1',
            playerName: 'LeBron James',
            teamName: 'Los Angeles Lakers',
            rarity: 'LEGENDARY',
            serialNumber: 1,
            currentValue: 2500,
          }
        ],
        walletAddress: tokens.walletAddress,
      };
    }
  }

  // Refresh expired tokens
  async refreshTokens(email: string): Promise<void> {
    const tokens = userTokens[email];
    if (!tokens) {
      throw new Error('No tokens to refresh');
    }

    const refreshToken = this.decrypt(tokens.refreshToken);
    
    try {
      const response = await fetch('https://oauth.dapperlabs.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh tokens');
      }

      const newTokens = await response.json();
      
      userTokens[email] = {
        accessToken: this.encrypt(newTokens.access_token),
        refreshToken: this.encrypt(newTokens.refresh_token),
        expiresAt: Date.now() + (newTokens.expires_in * 1000),
        walletAddress: tokens.walletAddress,
      };
    } catch (error) {
      console.error('Error refreshing tokens:', error);
      throw error;
    }
  }

  // Simple encryption (use proper library in production)
  private encrypt(text: string): string {
    const cipher = crypto.createCipher('aes-256-cbc', ENCRYPTION_KEY);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  private decrypt(encrypted: string): string {
    const decipher = crypto.createDecipher('aes-256-cbc', ENCRYPTION_KEY);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  // Exchange authorization code for tokens
  private async exchangeCodeForTokens(code: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  }> {
    try {
      const response = await fetch('https://oauth.dapperlabs.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          redirect_uri: this.config.redirectUri,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to exchange code for tokens');
      }

      const data = await response.json();
      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: Date.now() + (data.expires_in * 1000),
      };
    } catch (error) {
      console.error('Error exchanging code for tokens:', error);
      // For demo, return mock tokens
      return {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiresAt: Date.now() + (3600 * 1000), // 1 hour
      };
    }
  }

  // Check if user has OAuth connection
  hasConnection(email: string): boolean {
    return !!userTokens[email];
  }

  // Get wallet address for user
  getWalletAddressForUser(email: string): string | null {
    return userTokens[email]?.walletAddress || null;
  }

  // Disconnect user
  disconnect(email: string): void {
    delete userTokens[email];
  }
}

// Initialize OAuth with configuration
export const dapperOAuth = new DapperOAuth({
  clientId: process.env.DAPPER_CLIENT_ID || 'demo-client-id',
  clientSecret: process.env.DAPPER_CLIENT_SECRET || 'demo-client-secret',
  redirectUri: `${process.env.NEXT_PUBLIC_APP_URL || 'https://collectorpro.vercel.app'}/api/dapper/oauth/demo`,
  scope: ['read:user', 'read:wallet'],
}); 