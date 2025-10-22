import { addKeyword, EVENTS } from "@builderbot/bot"
import { faqFlow } from "./faqFlow"
import spreadSheets from "~/services/spreadSheets"
import { registerFlow } from "./registerFlow"
import { menuFlow } from "./menuFlow"
import { DetectIntention } from "./intentionFlow"

const welcomeFlow = addKeyword(EVENTS.WELCOME)
    .addAction(async (ctx, ctxFn) => {
        const isUser = await spreadSheets.userExists(ctx.from)
        if(!isUser){
            return ctxFn.gotoFlow(registerFlow)
        }else{
            ctxFn.gotoFlow(DetectIntention)
        }
        // return ctxFn.gotoFlow(faqFlow)
    })


export { welcomeFlow }