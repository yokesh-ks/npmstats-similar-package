# NPM Similar Packages API

A Cloudflare Worker API that finds similar npm packages based on natural language processing and categorization. This service analyzes package descriptions, keywords, and metadata to suggest alternative packages within the same category.

## Features

- **Natural Language Processing**: Uses NLP techniques to categorize packages based on descriptions and keywords
- **Multiple Data Sources**: Combines data from npm registry, bundlephobia, and npms.io for comprehensive package analysis
- **Fast Response Times**: Built on Cloudflare Workers for global edge deployment
- **CORS Enabled**: Ready for web applications with proper CORS headers
- **Caching**: Includes cache headers for optimal performance

## API Endpoints

### Health Check
```
GET /
GET /health
```
Returns basic service information.

**Response:**
```json
{
  "status": "ok",
  "message": "NPM Similar Packages API"
}
```

### Get Similar Packages
```
GET /similar/:packageName
```
Finds and returns similar packages for the given npm package.

**Parameters:**
- `packageName` (string): The name of the npm package to find similar packages for

**Response:**
```json
[
  {
    "name": "similar-package-name",
    "version": "1.2.3",
    "description": "Package description",
    "score": {
      "final": 0.85,
      "detail": {
        "quality": 0.34,
        "popularity": 0.34,
        "maintenance": 0.17
      }
    },
    "stats": [
      {
        "label": "Weekly Downloads",
        "value": 125000
      },
      {
        "label": "Bundle Size",
        "value": "45.2kB"
      },
      {
        "label": "GitHub Stars",
        "value": 2500
      },
      {
        "label": "Last Release",
        "value": 1640995200000
      }
    ]
  }
]
```

## Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd npmstats-similar-package
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start development server:**
```bash
npm run dev
```

The development server will start on `http://localhost:8787`.

## Deployment

1. **Login to Cloudflare:**
```bash
npx wrangler auth login
```

2. **Deploy to Cloudflare Workers:**
```bash
npm run deploy
```

## Development

### Project Structure

```
src/
├── index.js              # Main Cloudflare Worker entry point
├── constants/
│   └── fixtures.js       # Package categories and similar package mappings
├── fetcher/
│   ├── index.js          # HTTP utility functions
│   ├── npm-api.js        # NPM registry API client
│   ├── bundlephobia-api.js # Bundle size API client
│   └── npmio-api.js      # NPMS.io API client
└── helpers/
    ├── get-category.js   # NLP-based package categorization
    └── stripe-markdown.js # Markdown processing utilities
```

### Key Dependencies

- **natural**: Natural language processing library for text analysis
- **flatten**: Utility for flattening nested arrays
- **remark**: Markdown processor for cleaning package descriptions
- **strip-markdown**: Removes markdown formatting from text

### Configuration

The service is configured via `wrangler.toml`:

```toml
name = "npmstats-similar-package"
main = "src/index.js"
compatibility_date = "2024-12-30"
compatibility_flags = ["nodejs_compat"]

[observability]
enabled = true
```

## Usage Examples

### JavaScript/Node.js

```javascript
// Fetch similar packages for lodash
const response = await fetch('https://your-worker-url/similar/lodash');
const similarPackages = await response.json();

console.log(similarPackages);
```

### cURL

```bash
# Health check
curl https://your-worker-url/health

# Get similar packages
curl https://your-worker-url/similar/express
```

### Browser

```javascript
fetch('https://your-worker-url/similar/react')
  .then(response => response.json())
  .then(data => {
    console.log('Similar packages:', data);
  });
```

## Package Categories

The service categorizes packages into various domains including:

- **UI Libraries**: React, Vue, Angular components
- **Build Tools**: Webpack, Rollup, Vite configurations
- **Testing**: Jest, Mocha, Cypress frameworks
- **State Management**: Redux, MobX, Zustand
- **HTTP Clients**: Axios, Fetch wrappers
- **Date/Time**: Moment, Day.js, date-fns
- **And many more...**

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## API Rate Limits

- Respect the rate limits of the underlying APIs (npm registry, bundlephobia, npms.io)
- The service includes caching headers to reduce API calls
- Consider implementing additional caching for production use

## Support

For issues and questions:
- Open an issue on GitHub
- Check the Cloudflare Workers documentation
- Review the API documentation for data sources
