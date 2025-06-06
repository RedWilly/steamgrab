/**
 * Test script for the modular Steam scraper
 * Demonstrates how to use the new modular structure
 */
import { Steam } from './src';

/**
 * Tests the getGames function with various search terms
 * @param searchTerm - The game name to search for
 */
async function testGetGames(searchTerm: string): Promise<void> {
  console.log(`\n=== Searching for "${searchTerm}" ===`);
  try {
    const games = await Steam.getGames(searchTerm);
    console.log(`Found ${games.length} games:`);
    
    games.forEach((game, index) => {
      console.log(`\n[${index + 1}] ${game.title}`);
      console.log(`AppID: ${game.appid}`);
      console.log(`Release: ${game.release}`);
      console.log(`Price: ${game.price}`);
    });
  } catch (error) {
    if (error instanceof Steam.SteamScraperError) {
      console.error('Steam scraper error:', error.message);
    } else {
      console.error('Error searching for games:', error);
    }
  }
}

/**
 * Tests the getGameInfoById function with a specific game ID
 * @param appId - The Steam app ID to look up
 */
async function testGetGameById(appId: number): Promise<void> {
  console.log(`\n=== Getting game info for AppID: ${appId} ===`);
  try {
    const game = await Steam.getGameInfoById(appId);
    if (game) {
      console.log(`Title: ${game.title}`);
      console.log(`Release: ${game.release}`);
      console.log(`Price: ${game.price}`);
      console.log(`Image URL: ${game.image}`);
    } else {
      console.log(`No game found with AppID: ${appId}`);
    }
  } catch (error) {
    if (error instanceof Steam.SteamScraperError) {
      console.error('Steam API error:', error.message);
    } else {
      console.error('Error getting game by ID:', error);
    }
  }
}

/**
 * Main function to run all tests
 */
async function runTests(): Promise<void> {
  // Test searching for multiple games
  await testGetGames('Portal');
  
  // Test getting a specific game by ID (Portal 2 = 620)
  await testGetGameById(1991820);//Drunken_FC

  
  // Test the deprecated but still functional getFirstGameInfo
  console.log('\n=== Testing deprecated getFirstGameInfo ===');
  try {
    const firstGame = await Steam.getFirstGameInfo('Half-Life');
    if (firstGame) {
      console.log(`First game: ${firstGame.title} (${firstGame.appid})`);
    } else {
      console.log('No games found');
    }
  } catch (error) {
    if (error instanceof Steam.SteamScraperError) {
      console.error('Steam scraper error:', error.message);
    } else {
      console.error('Error with getFirstGameInfo:', error);
    }
  }
}

// Run all the tests
runTests().catch(console.error);
