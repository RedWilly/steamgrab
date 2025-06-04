/**
 * Type definitions for the Steam scraper module
 * Contains interfaces and types used throughout the module
 */

/**
 * Interface representing basic game information
 * Contains essential details about a Steam game
 */
export interface GameInfo {
  title: string;
  release: string;
  price: string;
  image: string | undefined;
  appid: number | undefined;
}

/**
 * Interface for Steam API response structure
 * Represents the response format from the Steam API
 */
export interface SteamApiResponse {
  [appId: string]: {
    success: boolean;
    data?: {
      name: string;
      steam_appid: number;
      header_image: string;
      is_free: boolean;
      release_date?: {
        coming_soon: boolean;
        date: string;
      };
      price_overview?: {
        currency: string;
        initial: number;
        final: number;
        discount_percent: number;
        final_formatted: string;
      };
      detailed_description?: string;
      short_description?: string;
      developers?: string[];
      publishers?: string[];
      categories?: Array<{ id: number; description: string }>;
      genres?: Array<{ id: string; description: string }>;
    };
  };
}

/**
 * Custom error class for Steam API related errors
 */
export class SteamScraperError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'SteamScraperError';
  }
}
