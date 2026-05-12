import { GoogleGenAI } from "@google/genai";

// For deployment verification, we are temporarily hardcoding the key.
const apiKey = "AIzaSyDgv4q5Gu8_UF01El5Y92I0n-iGGAWoohc";
export const ai = new GoogleGenAI({ apiKey });

export const MODELS = {
  flash: "gemini-3-flash-preview",
  pro: "gemini-3.1-pro-preview",
  image: "gemini-2.5-flash-image"
};
