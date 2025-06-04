/**
 * Constants for the Steam scraper module
 * Contains API endpoints and other configuration values
 */

/**
 * Steam search URL for finding games by name
 * @constant
 */
export const SEARCH_URL = "http://store.steampowered.com/search/results?sort_by=_ASC&page=1&term=";

/**
 * Steam API URL for fetching detailed game information by app ID
 * @constant
 */
export const STEAM_API_URL = "https://store.steampowered.com/api/appdetails?appids=";

/**
 * Default number of search results to return
 * @constant
 */
export const DEFAULT_SEARCH_LIMIT = 10;
