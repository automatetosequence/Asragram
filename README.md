# Asragram Web - Baking with Gemini AI

Web version of the Asragram APK application for Telegram bot deployment on Railway.

## Features

- Image gallery with 3 baked goods images (cupcake, cookies, cake)
- AI-powered image analysis using Google Gemini AI
- Beautiful, responsive UI with modern design
- Real-time loading states and error handling
- **Telegram Bot integration with WebApp support**
- **Webhook for real-time Telegram updates**
- **Works inside Telegram as a Mini App**

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Google AI API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Open `app.js` and replace `YOUR_GOOGLE_AI_API_KEY` with your actual API key

```javascript
const API_KEY = 'your-actual-api-key-here';
```

### 3. Run Locally

```bash
npm start
```

The app will be available at `http://localhost:3000`

## Railway Deployment

### Option 1: Deploy via Railway CLI

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login to Railway:
```bash
railway login
```

3. Initialize project:
```bash
cd d:\Asragram\web
railway init
```

4. Deploy:
```bash
railway up
```

5. Set environment variable:
```bash
railway variables set GOOGLE_AI_API_KEY=AIzaSyBDEt76s-rBLb77pXDFra_ioO4ySeha_Yg
```

### Option 2: Deploy via Railway Web Interface

1. Go to [railway.app](https://railway.app) and login
2. Click "New Project"
3. Select "Deploy from GitHub repo" or "Deploy from CLI"
4. Connect your repository or upload files
5. Add environment variable:
   - Key: `GOOGLE_AI_API_KEY`
   - Value: `AIzaSyBDEt76s-rBLb77pXDFra_ioO4ySeha_Yg`
6. Railway will automatically detect and deploy

### Your Railway URL

Once deployed, your app will be available at:
https://asragram.up.railway.app

## Project Structure

```
web/
├── assets/
│   └── images/
│       ├── baked_goods_1.jpg
│       ├── baked_goods_2.jpg
│       └── baked_goods_3.jpg
├── index.html          # Main HTML structure
├── style.css           # Styling and responsive design
├── app.js              # JavaScript with AI integration
├── package.json        # Dependencies and scripts
└── README.md          # This file
```

## Usage

1. Select an image from the gallery by clicking on it
2. Enter a prompt (e.g., "Provide a recipe for the baked goods in the image")
3. Click "Go" to analyze the image with AI
4. View the AI-generated response

## Technology Stack

- **HTML5** - Structure
- **CSS3** - Styling with modern gradients and animations
- **JavaScript (ES6+)** - Functionality
- **Google Generative AI** - AI image analysis
- **Serve** - Static file serving for development

## Notes

- The app uses Google Gemini 1.5 Flash model for image analysis
- Images are loaded from the local assets folder
- The UI is fully responsive and works on mobile devices
- Error handling is implemented for API failures and image loading issues

## API Key Security

⚠️ **Important**: Never commit your API key to version control. Use environment variables for production deployments.

## License

MIT
