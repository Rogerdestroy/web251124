import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateTeachingAssistance = async (prompt: string, contextData: string) => {
  if (!apiKey) {
    return "請先設定 API KEY 才能使用 AI 助理功能。";
  }

  try {
    const model = 'gemini-2.5-flash';
    const systemInstruction = `
      你是一位友善、博學且非常注重安全的生活科技(Living Technology) AI 小助教。
      你的任務是協助高中生解決專題製作遇到的困難、提供靈感、並指導他們正確使用工具與設備。
      
      請遵循以下原則：
      1. 安全第一：這是最高指導原則。若學生詢問危險操作（如雷切、電鋸、鑽床），務必先強調安全規範與防護裝備（如護目鏡、綁頭髮）。
      2. 引導思考：不要直接給答案（尤其在程式作業或設計思考上），而是提供思路、範例或除錯方向，培養他們的解決問題能力。
      3. 鼓勵嘗試：生活科技重視「做中學」，鼓勵學生動手實作、不怕失敗。
      4. 語氣：親切、活潑、像一位很有經驗的學長姐或熱心的助教，使用繁體中文(台灣用語)。
      
      目前的工坊環境與庫存：
      ${contextData}
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "抱歉，我現在無法產生回答，請稍後再試。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 服務暫時無法使用，請檢查網路連線或 API Key。";
  }
};