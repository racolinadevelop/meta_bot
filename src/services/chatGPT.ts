import OpenAI from "openai";

class chatGPT {
    private static apiKey: string;
    private openAI: OpenAI;

    constructor(apiKey: any) {
        chatGPT.apiKey = apiKey;
        this.openAI = new OpenAI({
            apiKey: chatGPT.apiKey,
        });
    }

    async chat(prompt: string, messages: any[]): Promise<string> {
        try {
            const completion = await this.openAI.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: prompt },
                    ...messages,
                ],
            });
            const answer = completion.choices[0].message?.content || "No response";
            return answer; 

        } catch (err) {
            console.log("Error al conectar con OpenaAi:", err);
            return "Error";
        }
    }
}
export default chatGPT;