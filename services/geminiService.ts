import { GoogleGenAI, Modality } from "@google/genai";

// Initialize Gemini Client
// API Key is guaranteed to be in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash-image';

/**
 * Generates/Edits an image based on an input image and a text prompt.
 * @param imageBase64 Base64 encoded image string (raw data, no prefix)
 * @param mimeType Mime type of the image
 * @param prompt Text instruction for the edit/generation
 * @returns Promise resolving to the base64 image data of the result
 */
export const generateEditedImage = async (
  imageBase64: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              data: imageBase64,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    // Extract the image from the response
    // The response structure for image generation usually contains inlineData in the first part
    const candidate = response.candidates?.[0];
    const part = candidate?.content?.parts?.[0];

    if (part && part.inlineData && part.inlineData.data) {
      return part.inlineData.data;
    }

    throw new Error("No image data found in the response.");
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate image.");
  }
};