# AI Web Memory

AI Web Memory is an AI-powered Chrome extension that allows users to save webpages, organize them into collections, search through saved content using semantic search, and interact with their knowledge base through a Retrieval-Augmented Generation (RAG) assistant.

Instead of bookmarking pages and forgetting about them, AI Web Memory turns saved content into a searchable, conversational memory layer.

---

## Features

### Save Webpages

Capture and store webpage content directly from the browser.

- Save page title
- Save page URL
- Extract page content automatically
- Store content in a cloud database

### Collections

Organize saved memories into custom collections.

Examples:

- System Design
- Interview Preparation
- Machine Learning
- Web Development

### Keyword Search

Quickly find memories using traditional text search.

### Semantic Search

Powered by Gemini Embeddings and PostgreSQL pgvector.

Find relevant content even when exact keywords are not present.

**Example**

Search:

```text
caching strategies
```

Can retrieve content containing:

```text
redis
performance optimization
cache invalidation
```

### AI Assistant

Chat with your saved knowledge.

Examples:

```text
What have I saved about React?
```

```text
Summarize everything I know about system design.
```

```text
What are the notes I saved regarding caching?
```

The assistant uses Retrieval-Augmented Generation (RAG) to answer questions using your saved memories.

### Cloud Deployment

- Backend deployed on Render
- Database hosted on Neon
- Accessible from anywhere

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Chrome Extension APIs

### Backend

- Node.js
- Express.js
- Prisma ORM

### Database

- PostgreSQL (Neon)
- pgvector

### AI

- Gemini Embeddings API
- Groq LLM API

### Deployment

- Render
- Neon

---

## System Architecture

```text
Chrome Extension
        │
        ▼
Content Extraction
        │
        ▼
Render Backend (Express)
        │
        ▼
Neon PostgreSQL + pgvector
        │
        ▼
Gemini Embeddings
        │
        ▼
Vector Similarity Search
        │
        ▼
Groq RAG Assistant
```

---

## Screenshots

### Extension Popup

<p align="center">
  <img src="screenshots/popup.png" width="900">
</p>

---

### Memories Dashboard

<p align="center">
  <img src="screenshots/dashboard.png" width="900">
</p>

---

### Collections

<p align="center">
  <img src="screenshots/collections.png" width="900">
</p>

---

### Semantic Search

<p align="center">
  <img src="screenshots/search.png" width="900">
</p>

---

### AI Assistant

<p align="center">
  <img src="screenshots/chat.png" width="900">
</p>

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/gitswati-27/memory-layer-extension.git
```

---

## Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
To get access, ping me at swatik2706@gmail.com
```

Run Prisma migrations:

```bash
npx prisma migrate deploy
```

Start the backend:

```bash
npm run dev
```

---

## Extension Setup

Return to the extension root directory:

```bash
cd ..
cd extension
```

Install dependencies:

```bash
npm install
```

Build the extension:

```bash
npm run build
```

---

## Loading the Extension in Chrome

### Step 1

Open:

```text
chrome://extensions
```

### Step 2

Enable:

```text
Developer Mode
```

### Step 3

Click:

```text
Load Unpacked
```

### Step 4

Select the generated:

```text
dist
```

folder.

### Step 5

Pin the extension to the Chrome toolbar.

The extension is now ready to use.

---

## Using the Extension

### Save a Page

1. Open any webpage.
2. Click the extension icon.
3. Select a collection.
4. Click **Save Current Page**.

---

### Search Memories

1. Open **View All Memories**.
2. Use the search bar to search saved content.

---

### Chat With Your Knowledge Base

1. Open **View All Memories**.
2. Click the AI Assistant button.
3. Ask questions about your saved content.

---

## Deployment
The backend is deployed on Render.
The database is hosted on Neon PostgreSQL.

### AI Services

- Gemini Embeddings API
- Groq LLM API

---

## Future Enhancements

- Chrome Web Store Release
- User Authentication
- Shared Collections
- AI Memory Summaries
- Advanced Source Citations
- Cross-Device Synchronization
- Browser History Integration

---

## Project Highlights

- Built a production-ready Chrome Extension
- Implemented semantic search using vector embeddings
- Integrated Retrieval-Augmented Generation (RAG)
- Designed a scalable full-stack architecture
- Deployed backend infrastructure to the cloud

---

## Author

**Swati**

Computer Science and Engineering Student

Built as a personal project exploring browser extensions, vector databases, semantic search, and modern AI application architecture.
