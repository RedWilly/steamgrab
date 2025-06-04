# Steam Game Scraper

A TypeScript library for fetching game information from the Steam store. This library provides easy-to-use functions for searching games by name and retrieving detailed game information by Steam App ID.

## Features

- Search for games by name and get multiple results
- Fetch detailed game information using Steam App ID
- TypeScript support with full type definitions
- Modern async/await API
- Error handling with custom error types
- Compatible with Node.js 16+ and modern browsers

## Installation

```bash
npm install steam-game-scraper
# or
yarn add steam-game-scraper
```

This package is distributed as TypeScript source files rather than compiled JavaScript, which provides several benefits:

- Better type information directly from the source
- Easier debugging with source maps
- Ability to adapt the code to your TypeScript configuration

Note that you'll need TypeScript ≥4.5.0 in your project to use this package.

## Usage

### Searching for games

```typescript
import { Steam } from 'steam-game-scraper';

async function searchGames() {
  try {
    // Get up to 10 games matching "Portal"
    const games = await Steam.getGames('Portal');
    
    console.log(`Found ${games.length} games:`);
    games.forEach(game => {
      console.log(`${game.title} (${game.appid}) - ${game.price}`);
    });
  } catch (error) {
    if (error instanceof Steam.SteamScraperError) {
      console.error('Steam scraper error:', error.message);
    } else {
      console.error('Error:', error);
    }
  }
}

searchGames();
```

### Getting game details by App ID

```typescript
import { Steam } from 'steam-game-scraper';

async function getGameDetails(appId: number) {
  try {
    const game = await Steam.getGameInfoById(appId);
    
    if (game) {
      console.log(`Title: ${game.title}`);
      console.log(`Release Date: ${game.release}`);
      console.log(`Price: ${game.price}`);
      console.log(`Image URL: ${game.image}`);
    } else {
      console.log(`No game found with AppID: ${appId}`);
    }
  } catch (error) {
    if (error instanceof Steam.SteamScraperError) {
      console.error('Steam API error:', error.message);
    } else {
      console.error('Error:', error);
    }
  }
}

// Get details for Portal 2 (App ID: 620)
getGameDetails(620);
```

## API Reference

### `getGames(query: string, limit?: number): Promise<GameInfo[]>`

Searches for games by name and returns an array of game information.

- `query`: The game name to search for
- `limit`: Maximum number of results to return (default: 10)

### `getFirstGameInfo(query: string): Promise<GameInfo | null>`

Fetches the first game information result by searching for a game name.

- `query`: The game name to search for

**Note**: This function is deprecated. Use `getGames(query, 1)` instead.

### `getGameInfoById(appId: string | number): Promise<GameInfo | null>`

Fetches game information directly using the Steam API with a game ID.

- `appId`: The Steam app ID of the game

### `GameInfo` Interface

```typescript
interface GameInfo {
  title: string;
  release: string;
  price: string;
  image: string | undefined;
  appid: number | undefined;
  rating?: string;
  reviewCount?: number;
}
```

## Development

```bash
# Clone the repository
git clone https://github.com/yourusername/steam-game-scraper.git
cd steam-game-scraper

# Install dependencies
npm install

# Build the library
npm run build

# Run tests
npm test
```

## License

MIT
