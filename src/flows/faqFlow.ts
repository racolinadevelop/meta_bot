import { addKeyword, EVENTS } from "@builderbot/bot";
import path from "path";
import fs, { stat } from "fs";
import chatGPT from "~/services/chatGPT";
import spreadSheets from "~/services/spreadSheets";
import "dotenv/config";

const pathPrompt = path.join(process.cwd(), "assets", "prompts", "prompt_chatGPT.txt");
const prompt = fs.readFileSync(pathPrompt, "utf-8");

export const faqFlow = addKeyword(EVENTS.ACTION)
    .addAction(
        async (ctx, { state, endFlow, gotoFlow }) => {
            const history = await spreadSheets.getUserConv(ctx.from)
            history.push({ role: 'user', content: ctx.body })
            try {
                console.log('Flow chatGPT')
                const AI = new chatGPT(process.env.OPENAI_API_KEY);
                const response = await AI.chat(prompt, history)
                await spreadSheets.addConverToUser(ctx.from, [{ role: 'user', content: ctx.body }, { role: 'assistant', content: response }])
                return endFlow(response);
            } catch (err) {
                console.log("Error en llamada GPT", err);
                return endFlow("Por favor, intenta de nuevo");
            }
        }
    )
