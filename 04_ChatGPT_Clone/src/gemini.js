import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// IMPORTANT: Store your API key securely.
// Use environment variables for production.
// For Vite projects, use import.meta.env; for Create React App, use process.env
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // This model supports multimodal inputs
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  // responseMimeType: "text/plain", // Removed for multimodal
};

// Helper function to convert File object to GenerativePart
async function fileToGenerativePart(file) {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}

// Safety settings to block harmful content
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Updated runChat to accept prompt and an optional image file
export async function runChat(prompt, imageFile = null) {
  // Check if the API key is a placeholder or actually empty
  // Simplified API key check
  // --- Robust API Key Check ---
  // Log the API_KEY value and type right before the check for debugging.
  console.log(
    `[GEMINI_DEBUG] API_KEY at check point: '${API_KEY}' (Type: ${typeof API_KEY}, Length: ${
      API_KEY ? API_KEY.length : "N/A"
    })`
  );

  const GENERIC_PLACEHOLDER = "YOUR_GEMINI_API_KEY_HERE";
  let isApiKeyInvalid = false;

  if (!API_KEY || typeof API_KEY !== "string" || API_KEY.trim() === "") {
    console.warn(
      `[GEMINI_WARN] API key is missing, not a string, or empty. Value: '${API_KEY}'`
    );
    isApiKeyInvalid = true;
  } else if (API_KEY === GENERIC_PLACEHOLDER) {
    console.warn(
      `[GEMINI_WARN] API key is the generic placeholder: '${GENERIC_PLACEHOLDER}'.`
    );
    isApiKeyInvalid = true;
  }
  // Add any other specific placeholder patterns if necessary, but avoid overly broad checks.

  if (isApiKeyInvalid) {
    return "Please configure your Gemini API key in gemini.js to get live responses. This is a placeholder.";
  }
  // --- End of API Key Check ---

  try {
    const chatSession = model.startChat({
      generationConfig,
      safetySettings,
      history: [], // Start with empty history for each call
    });

    const promptParts = [];
    // Ensure prompt is a string and not empty or just whitespace
    if (typeof prompt === "string" && prompt.trim() !== "") {
      promptParts.push({ text: prompt });
    }

    if (imageFile) {
      const imagePart = await fileToGenerativePart(imageFile); // fileToGenerativePart is now used
      promptParts.push(imagePart);
    }

    if (promptParts.length === 0) {
      console.warn("Attempted to send an empty prompt (no text or image).");
      return "Please provide a text prompt or an image to send.";
    }

    const result = await chatSession.sendMessage(promptParts);
    const response = result.response;

    if (response && typeof response.text === "function") {
      // Check if text() is a function
      return response.text();
    } else if (
      response &&
      response.promptFeedback &&
      response.promptFeedback.blockReason
    ) {
      console.warn(
        "Content blocked by API:",
        response.promptFeedback.blockReason,
        response.promptFeedback
      );
      return `Response blocked due to: ${response.promptFeedback.blockReason}. Please adjust your prompt or image.`;
    } else {
      console.warn(
        "Received an empty or unexpected response from Gemini API:",
        response
      );
      return "Received an empty or unexpected response from the AI.";
    }
  } catch (error) {
    console.error("Error running chat with Gemini:", error);
    if (error.response && error.response.promptFeedback) {
      console.error("Prompt Feedback:", error.response.promptFeedback);
    }
    // Check for specific API key error messages
    if (
      error.message &&
      (error.message.includes("API key not valid") ||
        error.message.includes("API_KEY_INVALID"))
    ) {
      return "Error: The provided API key is not valid. Please check your API key in gemini.js.";
    }
    if (
      error.message &&
      error.message.includes("parts field must be populated")
    ) {
      return "Error: Input is empty. Please provide a text prompt or an image.";
    }
    return "Sorry, I encountered an error trying to connect to the AI. Please check the console for details.";
  }
}
