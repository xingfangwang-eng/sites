# NeverExplain Web

A Next.js application with a Chrome extension for context management and recall in ChatGPT/Claude.

## Features

- **Dashboard**: List all saved contexts
- **Markdown Editor**: Create and save new contexts
- **Chrome Extension**: Recall contexts in ChatGPT/Claude with `/recall-xxx` syntax
- **API Endpoints**: Save and retrieve contexts

## Setup

### Web App

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Generate Prisma client**:
   ```bash
   npx prisma generate
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Access the app**:
   - Dashboard: http://localhost:3000
   - Editor: http://localhost:3000/editor

### Chrome Extension

1. **Build the extension**:
   ```bash
   # Using PowerShell
   Compress-Archive -Path extension/* -DestinationPath extension.zip -Force
   ```

2. **Load the extension in Chrome**:
   - Open Chrome and go to `chrome://extensions`
   - Enable **Developer mode** (toggle in the top right)
   - Click **Load unpacked** and select the `extension` folder
   - Or, click **Load unpacked** and select the `extension.zip` file

3. **Configure the extension**:
   - Click on the NeverExplain extension icon in the Chrome toolbar
   - Enter the Web App Base URL (e.g., http://localhost:3000)
   - Click **Save**

## Usage

### Creating Contexts

1. Go to the Editor page (http://localhost:3000/editor)
2. Enter a title and content for your context
3. Click **Save Context**
4. A unique hook will be generated (e.g., `recall-happy-cat`)

### Using Contexts in ChatGPT/Claude

1. In the ChatGPT or Claude chat interface
2. Type `/recall-` followed by the hook name (e.g., `/recall-happy-cat`)
3. Press **Space** or **Enter**
4. The extension will automatically replace the `/recall-xxx` with the context content

### Copying Hooks

1. Go to the Dashboard page (http://localhost:3000)
2. Click on any hook name to copy it to your clipboard
3. A notification will confirm the copy

## API Endpoints

- **POST /api/context**: Create a new context
  - Body: `{"title": "...", "content": "..."}`
  - Returns: Created context with hook

- **GET /api/context?hook={name}**: Get context by hook
  - Returns: Plain text content
  - Supports CORS

- **GET /api/contexts**: Get all contexts
  - Returns: Array of contexts

## Security

The API includes a simple API Key validation mechanism. In production, set the `API_KEY` environment variable. In development, API Key validation is skipped.

## Technologies

- Next.js 16.2.2 with App Router
- Tailwind CSS
- Shadcn UI
- Prisma ORM with SQLite
- Chrome Extension (Manifest V3)

## License

MIT
