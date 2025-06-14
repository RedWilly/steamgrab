/**
 * Search functionality for finding Steam games by name
 * Handles searching for games using the Steam store search
 */
import axios from 'axios';
import { parse } from 'node-html-parser';
import { type GameInfo, SteamScraperError } from '../types';


import { SEARCH_URL, DEFAULT_SEARCH_LIMIT } from '../constants';

/**
 * Fetches multiple game information results by searching for a game name
 * @param query - The game name to search for
 * @param limit - Maximum number of results to return (default: 10)
 * @returns Promise containing an array of game information
 * @throws {SteamScraperError} If the request fails or parsing errors occur
 * @example
 * // Get up to 10 games matching "Portal"
 * const games = await getGames("Portal");
 * console.log(games.length); // Number of games found
 */
export async function getGames(query: string, limit: number = DEFAULT_SEARCH_LIMIT): Promise<GameInfo[]> {
  const url = SEARCH_URL + encodeURIComponent(query);
  
  try {
    const response = await axios.get(url);
    const html = response.data;
    const root = parse(html);
    
    // The search results are in a different structure
    // Look for the search result rows with the class 'search_result_row'
    const results = root.querySelectorAll(".search_result_row");
    
    if (results.length === 0) {
      return [];
    }
    
    const games: GameInfo[] = [];
    
    // Process up to 'limit' results
    for (let i = 0; i < Math.min(results.length, limit); i++) {
      const result = results[i];
      
      // Skip if result is undefined
      if (!result) continue;
      
      // Extract the app ID from the data attribute or from the href
      let appId: number | undefined;
      const appidData = result.getAttribute("data-ds-appid");
      if (appidData) {
        appId = Number(appidData);
      } else {
        // Try to extract from the href attribute
        const href = result.getAttribute("href");
        if (href) {
          const match = href.match(/\/app\/(\d+)/);
          if (match && match[1]) {
            appId = Number(match[1]);
          }
        }
      }
            
      // Extract price information - handle different price formats
      const priceElement = result.querySelector(".search_price");
      let price = priceElement ? priceElement.text.trim() : '';
      
      if (!price) {
        // Try the discounted price if available
        const discountElement = result.querySelector(".search_price_discount_combined");
        price = discountElement ? discountElement.text.trim() : '';
      }
      
      // Clean up the price text
      price = price.replace(/\s+/g, ' ').trim();
      
      const titleElement = result.querySelector(".title");
      const releaseElement = result.querySelector(".search_released");
      const imageElement = result.querySelector("img");
      
      const game: GameInfo = {
        title: titleElement ? titleElement.text.trim() : '',
        release: releaseElement ? releaseElement.text.trim() : '',
        price: price || 'Price not available',
        image: imageElement ? imageElement.getAttribute('src') : undefined,
        appid: appId
      };
      
      games.push(game);
    }
    
    return games;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new SteamScraperError(`Failed to fetch game information: ${errorMessage}`, error);
  }
}

/**
 * Fetches the first game information result by searching for a game name
 * @param query - The game name to search for
 * @returns Promise containing game information or null if not found
 * @throws {SteamScraperError} If the request fails or parsing errors occur
 * @deprecated Use getGames() instead with a limit of 1
 * @example
 * // Get the first game matching "Half-Life"
 * const game = await getFirstGameInfo("Half-Life");
 * if (game) {
 *   console.log(game.title); // "Half-Life"
 * }
 */
export async function getFirstGameInfo(query: string): Promise<GameInfo | null> {
  try {
    const games = await getGames(query, 1);
    // With noUncheckedIndexedAccess enabled, games[0] could be undefined
    // so we need to handle that case explicitly
    const firstGame = games[0];
    return firstGame ?? null;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new SteamScraperError(`Failed to fetch first game: ${errorMessage}`, error);
  }
}
