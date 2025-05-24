import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// For Vite projects:
const apiKey = import.meta.env.VITE_REACT_APP_GEMINI_API_KEY;

// For Create React App, keep using process.env but ensure the variable is prefixed with REACT_APP_ and defined in your .env file
// const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 50,
  responseMimeType: "text/plain",
};

async function run(prompt) {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const result = await chatSession.sendMessage(prompt);
  // console.log(result.response.text());
  return result.response.text();
}

export default run;
