# Extalia Tools Hub

This is the official tools hub for the Extalia Server, featuring a news system, item set generator, and server information.

## Features

- News Management System
  - Create, edit, and delete news articles
  - Tag-based filtering
  - Rich text content
  - Image support
  - Publishing controls
- Item Set Generator
- Server Statistics
- Documentation
- Responsive Design

## Prerequisites

- Node.js 18.x or later
- MySQL 8.x
- npm or yarn package manager

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd itemset-generator-next
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL="mysql://username:password@localhost:3306/web_app"
```

4. Initialize the database:
```bash
# Create the database if it doesn't exist
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS web_app;"

# Generate Prisma client and push the schema
npx prisma generate
npx prisma db push
```

5. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`.

## Database Schema

The application uses Prisma as its ORM. The main models are:

### NewsArticle
- id: String (UUID)
- title: String (VARCHAR(255))
- content: String (TEXT)
- summary: String (TEXT)
- image: String (VARCHAR(255), optional)
- author: String (VARCHAR(100))
- publishedAt: DateTime
- updatedAt: DateTime
- tags: String (TEXT, stored as JSON)
- isPublished: Boolean

## API Routes

### News Management
- GET `/api/news` - Get all published news articles
- POST `/api/news` - Create a new article
- GET `/api/news/[id]` - Get a specific article
- PUT `/api/news/[id]` - Update an article
- DELETE `/api/news/[id]` - Delete an article
- PATCH `/api/news/[id]` - Partially update an article

## Development

### Code Style
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting

### Testing
```bash
npm run test
# or
yarn test
```

### Building for Production
```bash
npm run build
# or
yarn build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
