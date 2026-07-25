// Load Google Generative AI from CDN for browser compatibility
const { GoogleGenerativeAI } = window.googleGenerativeAI || {};

// Initialize the Google Generative AI
// Note: This uses Firebase API key from google-services.json
// For web deployment, you may need to get a Google AI Studio API key
const API_KEY = 'AIzaSyBDEt76s-rBLb77pXDFra_ioO4ySeha_Yg'; // Firebase API key from APK

// Telegram WebApp integration
let tg = window.Telegram.WebApp;
if (tg) {
    tg.ready();
    tg.expand();
    console.log('Telegram WebApp initialized');
}

// Load Google Generative AI SDK dynamically
let genAI;
async function initializeAI() {
    try {
        const module = await import('https://esm.sh/@google/generative-ai@0.21.0');
        genAI = new module.GoogleGenerativeAI(API_KEY);
        console.log('AI initialized');
    } catch (error) {
        console.error('Failed to initialize AI:', error);
        showError('Failed to initialize AI. Please check your connection.');
    }
}

// State management
let selectedImageIndex = 0;
let selectedImageData = null;

// DOM elements
const imageItems = document.querySelectorAll('.image-item');
const promptInput = document.getElementById('promptInput');
const goButton = document.getElementById('goButton');
const resultText = document.getElementById('resultText');
const loadingIndicator = document.getElementById('loadingIndicator');

// Image data
const images = [
    { src: 'assets/images/baked_goods_1.jpg', description: 'Cupcake' },
    { src: 'assets/images/baked_goods_2.jpg', description: 'Cookies' },
    { src: 'assets/images/baked_goods_3.jpg', description: 'Cake' }
];

// Initialize image selection
function initializeImageSelection() {
    imageItems.forEach((item, index) => {
        item.addEventListener('click', () => selectImage(index));
    });
    
    // Select first image by default
    selectImage(0);
}

function selectImage(index) {
    // Remove selected class from all images
    imageItems.forEach(item => item.classList.remove('selected'));
    
    // Add selected class to clicked image
    imageItems[index].classList.add('selected');
    
    selectedImageIndex = index;
    
    // Load the image data
    loadImageData(index);
}

async function loadImageData(index) {
    try {
        const response = await fetch(images[index].src);
        const blob = await response.blob();
        selectedImageData = blob;
    } catch (error) {
        console.error('Error loading image:', error);
        showError('Failed to load image. Please try again.');
    }
}

// Initialize prompt input
function initializePromptInput() {
    promptInput.addEventListener('input', () => {
        goButton.disabled = promptInput.value.trim() === '';
    });
    
    // Enable button if there's initial text
    goButton.disabled = promptInput.value.trim() === '';
}

// Initialize go button
function initializeGoButton() {
    goButton.addEventListener('click', handleGoClick);
}

async function handleGoClick() {
    const prompt = promptInput.value.trim();
    
    if (!prompt) {
        showError('Please enter a prompt');
        return;
    }
    
    if (!selectedImageData) {
        showError('Please select an image');
        return;
    }
    
    await analyzeImage(prompt, selectedImageData);
}

async function analyzeImage(prompt, imageData) {
    // Show loading state
    loadingIndicator.classList.remove('hidden');
    resultText.classList.add('hidden');
    goButton.disabled = true;
    
    try {
        // Convert image to base64
        const base64Data = await convertToBase64(imageData);
        
        // Get the generative model
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        // Prepare the image part
        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType: imageData.type || 'image/jpeg'
            }
        };
        
        // Generate content
        const result = await model.generateContent([imagePart, prompt]);
        const response = await result.response;
        const text = response.text();
        
        // Display result
        showResult(text);
        
    } catch (error) {
        console.error('Error analyzing image:', error);
        showError(error.message || 'Failed to analyze image. Please check your API key and try again.');
    } finally {
        // Hide loading state
        loadingIndicator.classList.add('hidden');
        goButton.disabled = false;
    }
}

function convertToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

function showResult(text) {
    resultText.textContent = text;
    resultText.classList.remove('error');
    resultText.classList.remove('hidden');
}

function showError(message) {
    resultText.textContent = `Error: ${message}`;
    resultText.classList.add('error');
    resultText.classList.remove('hidden');
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initializeImageSelection();
    initializePromptInput();
    initializeGoButton();
    
    // Initialize AI
    initializeAI();
    
    // Pre-load first image
    loadImageData(0);
});
