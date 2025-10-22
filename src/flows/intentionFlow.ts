import { createFlowRouting } from "@builderbot-plugins/langchain";
import { EVENTS } from "@builderbot/bot";
import path from "path";
import fs from "fs";
import { menuFlow } from "./menuFlow";
import { faqFlow } from "./faqFlow";

const Prompt_DETECTED = path.join(
    process.cwd(),
    "assets/prompts",
    "prompt_detection.txt"
);

const promptDetected = fs.readFileSync(Prompt_DETECTED, "utf8");

export const DetectIntention = createFlowRouting
    .setKeyword(EVENTS.ACTION)
    .setIntentions({
        intentions: ["MENU_OPCIONES", "FAQ", "NO_DETECTED"],
        description: promptDetected,
    })
    .setAIModel({
        modelName: "openai" as any,
        args: {
            modelName: "gpt-4o-mini",
            apikey: process.env.OPENAI_API_KEY,
        },
    })
    .create({
        afterEnd(flow) {
            return flow.addAction(async (ctx, { state, endFlow, gotoFlow }) => {
                try {
                    console.log("INTENCION DETECT ", await state.get("intention"));

                    if ((await state.get("intention")) === "NO_DETECTED") {
                        return endFlow("Tu mensaje está fuera de contexto");
                    }

                    if ((await state.get("intention")) === "MENU_OPCIONES") {
                        return gotoFlow(menuFlow);
                    }

                    if ((await state.get("intention")) === "FAQ") {
                        return gotoFlow(faqFlow);
                    }
                } catch (error) {
                    console.error("Error en DetectIntention: ", error);
                }
            });
        },
    });
