backend/ai.js

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function generatePlanLLM(dest, days, budget, transportation) {
    const prompt = `
    Tolong buatkan rencana perjalanan wisata yang menarik dan realistis ke ${dest} selama ${days} hari dengan anggaran ${budget} Rupiah. Jenis transportasi utama yang akan digunakan adalah ${transportation}.
    
    Rencana perjalanan harus mencakup:
    - Aktivitas menarik untuk setiap hari.
    - Rekomendasi tempat makan yang sesuai dengan anggaran.
    - Saran transportasi lokal untuk berpindah antar tempat.
    - Perkiraan biaya untuk setiap aktivitas, makan, dan transportasi (jika memungkinkan).
    
    Output harus dalam format berikut:
    Hari ke-1:
    - Pagi: [Deskripsi aktivitas dan perkiraan biaya]
    - Siang: [Deskripsi aktivitas dan perkiraan biaya]
    - Sore: [Deskripsi aktivitas dan perkiraan biaya]
    - Malam: [Rekomendasi tempat makan dan perkiraan biaya]
    - Transportasi: [Saran transportasi dan perkiraan biaya]
    
    Hari ke-2:
    ...
    
    Total perkiraan biaya keseluruhan: [Jumlah total]
    
    Catatan Tambahan: [Informasi tambahan yang mungkin berguna, seperti tips atau hal yang perlu diperhatikan].
    `.trim();

    try {
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });
        const response = await result.response;
        const generatedText = response.candidates[0].content.parts[0].text;
        return generatedText;
    } catch (error) {
        console.error('Error generating with Gemini:', error);
        return 'Terjadi kesalahan saat membuat rencana perjalanan.';
    }
}