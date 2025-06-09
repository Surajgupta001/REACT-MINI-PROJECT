// API configuration for Hugging Face Inference API
const HF_API_TOKEN =
  import.meta.env.VITE_HF_API_TOKEN || "YOUR_HF_API_TOKEN_FALLBACK";
// Replace with your desired Hugging Face model ID
const MODEL_ID = "stabilityai/stable-diffusion-xl-base-1.0";
const HF_API_URL = `https://api-inference.huggingface.co/models/${MODEL_ID}`;

/**
 * Generates an image from a text prompt using the Hugging Face Inference API.
 * @param {string} prompt - The text prompt to generate an image from.
 * @returns {Promise<string>} A promise that resolves with an Object URL of the generated image.
 * @throws {Error} If the API request fails or the response is invalid.
 */
export const generateImageFromApi = async (prompt) => {
  if (!prompt || !prompt.trim()) {
    throw new Error("Prompt cannot be empty.");
  }

  if (HF_API_TOKEN === "YOUR_HF_API_TOKEN_FALLBACK") {
    console.warn(
      "Using fallback Hugging Face API token. Please set VITE_HF_API_TOKEN in your .env file for the app to work correctly."
    );
    // Consider throwing an error here for a real application.
  }

  try {
    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    if (!response.ok) {
      // Hugging Face might return 503 if the model is loading
      if (response.status === 503) {
        const errorData = await response.json();
        console.warn(
          "Model is loading on Hugging Face, please try again shortly.",
          errorData
        );
        throw new Error(
          `Model is loading (503): ${
            errorData.error || "Please try again in a few moments."
          } Estimated time: ${errorData.estimated_time || "N/A"}`
        );
      }
      // Handle other errors
      let errorText;
      try {
        // Try to parse as JSON first, as HF often returns JSON errors
        const errorData = await response.json();
        errorText =
          errorData.error ||
          `API request failed with status ${response.status}`;
      } catch {
        // Removed unused e
        // If not JSON, get text
        errorText =
          (await response.text()) ||
          `API request failed with status ${response.status} ${response.statusText}`;
      }
      console.error("Hugging Face API Error:", errorText);
      throw new Error(errorText);
    }

    // The response from Hugging Face image models is typically the image blob directly
    const imageBlob = await response.blob();
    if (imageBlob.type && imageBlob.type.startsWith("image/")) {
      return URL.createObjectURL(imageBlob);
    } else {
      // This case might happen if the response is not an image, e.g., an unexpected JSON error not caught above
      console.error(
        "Received non-image data from Hugging Face API:",
        imageBlob
      );
      throw new Error(
        "Received non-image data from API. Expected an image blob."
      );
    }
  } catch (err) {
    console.error("Error in generateImageFromApi (Hugging Face):", err);
    throw err; // Re-throw to be caught by the calling function in Context.jsx
  }
};

// Note: When using Object URLs (URL.createObjectURL()), it's good practice to revoke them
// when they are no longer needed to free up memory, e.g., in a useEffect cleanup
// in the ImageDisplay component or when a new image is generated.
// For simplicity, this example doesn't explicitly manage revocation beyond browser's default behavior.
