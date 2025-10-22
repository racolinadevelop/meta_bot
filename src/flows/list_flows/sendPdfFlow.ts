import { addKeyword, EVENTS } from "@builderbot/bot";

const sendPdfFlow = addKeyword("GS3010973")
  .addAnswer("Te adjunto un PDF", {
    media: "./assets/Menu_Pizzas_Tracatraca.pdf"
  });

export { sendPdfFlow };