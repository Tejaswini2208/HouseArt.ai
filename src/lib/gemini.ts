import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY!;
export const ai = new GoogleGenAI({ apiKey });

export const MODELS = {
  flash: "gemini-3-flash-preview",
  pro: "gemini-3.1-pro-preview",
  image: "gemini-2.5-flash-image"
};
