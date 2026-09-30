import { parseAndValidateTripJSON } from "./tripNormalizer";

const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

export const generateTrip = async (prompt) => {
  if (!apiKey) {
    throw new Error(
      "Missing OpenRouter API key. Add VITE_OPENROUTER_API_KEY to your .env file."
    );
  }

  try {
    console.log("Generating trip with OpenRouter...");

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
          "X-Title": "AI Trip Planner",
        },
        body: JSON.stringify({
          model: "openrouter/free",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          response_format: {
            type: "json_object",
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter API Error:", data);

      throw new Error(
        data?.error?.message ||
          `OpenRouter request failed with status ${response.status}`
      );
    }

    const rawOutputText = data?.choices?.[0]?.message?.content;

    if (!rawOutputText) {
      throw new Error("OpenRouter returned an empty response.");
    }

    console.log("OpenRouter response received.");

    return parseAndValidateTripJSON(rawOutputText);

  } catch (error) {
    console.error("OpenRouter Generation Error:", error);

    const message = error?.message || "";

    if (
      message.includes("429") ||
      message.toLowerCase().includes("rate limit")
    ) {
      throw new Error(
        "Free AI limit reached. Please wait and try again later."
      );
    }

    if (
      message.includes("503") ||
      message.toLowerCase().includes("unavailable")
    ) {
      throw new Error(
        "The free AI model is temporarily unavailable. Please try again."
      );
    }

    throw new Error(
      message || "Failed to generate travel plan."
    );
  }
};