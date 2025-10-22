import { createFlow } from "@builderbot/bot";
import { welcomeFlow } from "./welcomeFLow";
import { faqFlow } from "./faqFlow";
import { registerFlow } from "./registerFlow";
import { menuFlow } from "./menuFlow";
import { sendImageFlow } from "./list_flows/sendImageFlow";
import { sendPdfFlow } from "./list_flows/sendPdfFlow";
import { sendVoiceFlow } from "./list_flows/sendVoiceFlow";
import { DetectIntention } from "./intentionFlow";


export default createFlow([
    welcomeFlow,
    faqFlow,
    registerFlow,
    menuFlow,
    sendImageFlow,
    sendPdfFlow,
    sendVoiceFlow,
    DetectIntention
]);