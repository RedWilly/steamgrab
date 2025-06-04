/**
 * Search functionality for finding Steam games by app ID
 * Handles direct API calls to Steam using app IDs
 */
import axios, { AxiosError } from 'axios';
import { type GameInfo, type SteamApiResponse, SteamScraperError } from '../types';
import { STEAM_API_URL } from '../constants';

/**
 * Fetches game information directly using the Steam API with a game ID
 * @param appId - The Steam app ID of the game
 * @returns Promise containing game information or null if not found
 * @throws {SteamScraperError} If the request fails or parsing errors occur
 * @example
 * // Get game information for Portal 2 (appId: 620)
 * const game = await getGameInfoById(620);
 * if (game) {
 *   console.log(game.title); // "Portal 2"
 * }
 */
export async function getGameInfoById(appId: string | number): Promise<GameInfo | null> {
  const url = `${STEAM_API_URL}${appId}`;
  
  try {
    const response = await axios.get<SteamApiResponse>(url);
    const data = response.data;
    const appData = data[appId.toString()];
    
    // Check if the request was successful and data exists
    if (!appData || !appData.success || !appData.data) {
      return null;
    }
    
    const gameData = appData.data;
    
    // Handle price information - check if game is available for purchase
    let priceText = '';
    if (gameData.is_free) {
      priceText = 'Free';
    } else if (gameData.price_overview?.final_formatted) {
      priceText = gameData.price_overview.final_formatted;
    } else {
      priceText = 'Not available for purchase';
    }
    
    // Ensure the image URL is properly formatted
    const imageUrl = gameData.header_image || '';
    
    const json: GameInfo = {
      title: gameData.name,
      release: gameData.release_date?.date || '',
      price: priceText,
      image: imageUrl,
      appid: Number(appId)
    };
    
    return json;
  } catch (error) {
    // Handle specific axios errors
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      throw new SteamScraperError(
        `Steam API request failed: ${axiosError.message}`,
        axiosError
      );
    }
    
    // Handle other errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new SteamScraperError(`Failed to fetch game by ID: ${errorMessage}`, error);
  }
}
