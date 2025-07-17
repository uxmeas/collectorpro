// Dapper Wallet Integration for NBA Top Shot
// This connects to the Flow blockchain to get real user data

export interface DapperMoment {
  id: string;
  playId: string;
  playerName: string;
  teamName: string;
  playCategory: string;
  playType: string;
  rarity: string;
  serialNumber: number;
  totalCirculation: number;
  acquisitionPrice?: number;
  currentValue?: number;
  acquisitionDate?: string;
  momentURL: string;
  imageURL: string;
}

export interface DapperUser {
  address: string;
  moments: DapperMoment[];
  totalValue: number;
  totalMoments: number;
}

// Flow blockchain configuration
const FLOW_NETWORK = process.env.NODE_ENV === 'production' ? 'mainnet' : 'testnet';
const TOP_SHOT_CONTRACT = '0x0ea0b81b1b1850c2aa1eb0f5596e656422d7c660dfbf0fea2a87c31c3cdf5808';

// Dapper API endpoints
const DAPPER_API_BASE = 'https://api.dapperlabs.com/v1';
const TOP_SHOT_API_BASE = 'https://api.nbatopshot.com';

export class DapperService {
  private userAddress: string;

  constructor(userAddress: string) {
    this.userAddress = userAddress;
  }

  // Get user's NBA Top Shot moments
  async getUserMoments(): Promise<DapperMoment[]> {
    try {
      // This would connect to Flow blockchain to get real user data
      // For now, we'll simulate the API call structure
      
      const response = await fetch(`${TOP_SHOT_API_BASE}/users/${this.userAddress}/moments`, {
        headers: {
          'Authorization': `Bearer ${process.env.DAPPER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch moments: ${response.statusText}`);
      }

      const data = await response.json();
      return this.transformMoments(data.moments);
    } catch (error) {
      console.error('Error fetching user moments:', error);
      // For development, return sample data
      return this.getSampleMoments();
    }
  }

  // Get moment details and current market data
  async getMomentDetails(momentId: string): Promise<DapperMoment | null> {
    try {
      const response = await fetch(`${TOP_SHOT_API_BASE}/moments/${momentId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.DAPPER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch moment details: ${response.statusText}`);
      }

      const data = await response.json();
      return this.transformMoment(data);
    } catch (error) {
      console.error('Error fetching moment details:', error);
      return null;
    }
  }

  // Get current market prices for moments
  async getMarketPrices(momentIds: string[]): Promise<Record<string, number>> {
    try {
      const response = await fetch(`${TOP_SHOT_API_BASE}/market/prices`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.DAPPER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ momentIds }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch market prices: ${response.statusText}`);
      }

      const data = await response.json();
      return data.prices;
    } catch (error) {
      console.error('Error fetching market prices:', error);
      return {};
    }
  }

  // Get user's transaction history
  async getTransactionHistory(): Promise<any[]> {
    try {
      const response = await fetch(`${TOP_SHOT_API_BASE}/users/${this.userAddress}/transactions`, {
        headers: {
          'Authorization': `Bearer ${process.env.DAPPER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      return [];
    }
  }

  // Transform API data to our format
  private transformMoments(moments: any[]): DapperMoment[] {
    return moments.map(moment => this.transformMoment(moment));
  }

  private transformMoment(moment: any): DapperMoment {
    return {
      id: moment.id,
      playId: moment.playId,
      playerName: moment.playerName,
      teamName: moment.teamName,
      playCategory: moment.playCategory,
      playType: moment.playType,
      rarity: moment.rarity,
      serialNumber: moment.serialNumber,
      totalCirculation: moment.totalCirculation,
      acquisitionPrice: moment.acquisitionPrice,
      currentValue: moment.currentValue,
      acquisitionDate: moment.acquisitionDate,
      momentURL: moment.momentURL,
      imageURL: moment.imageURL,
    };
  }

  // Sample data for development
  private getSampleMoments(): DapperMoment[] {
    return [
      {
        id: 'sample-1',
        playId: 'play-1',
        playerName: 'LeBron James',
        teamName: 'Los Angeles Lakers',
        playCategory: 'Dunk',
        playType: 'Alley Oop',
        rarity: 'LEGENDARY',
        serialNumber: 1,
        totalCirculation: 100,
        acquisitionPrice: 1500,
        currentValue: 2200,
        acquisitionDate: '2023-01-15',
        momentURL: 'https://nbatopshot.com/moment/sample-1',
        imageURL: 'https://example.com/lebron-dunk.jpg',
      },
      {
        id: 'sample-2',
        playId: 'play-2',
        playerName: 'Stephen Curry',
        teamName: 'Golden State Warriors',
        playCategory: '3-Pointer',
        playType: 'Game Winner',
        rarity: 'RARE',
        serialNumber: 45,
        totalCirculation: 500,
        acquisitionPrice: 800,
        currentValue: 950,
        acquisitionDate: '2023-02-20',
        momentURL: 'https://nbatopshot.com/moment/sample-2',
        imageURL: 'https://example.com/curry-3pt.jpg',
      },
    ];
  }
}

// Flow blockchain integration
export class FlowService {
  // Connect to Flow blockchain
  async connectWallet(): Promise<string | null> {
    try {
      // This would integrate with Flow wallet (Blocto, Dapper, etc.)
      // For now, return a sample address
      return '0x1234567890abcdef';
    } catch (error) {
      console.error('Error connecting to Flow wallet:', error);
      return null;
    }
  }

  // Get user's Flow account info
  async getAccountInfo(address: string): Promise<any> {
    try {
      // This would query the Flow blockchain
      return {
        address,
        balance: '100.0',
        contracts: ['TopShot'],
      };
    } catch (error) {
      console.error('Error getting account info:', error);
      return null;
    }
  }
} 