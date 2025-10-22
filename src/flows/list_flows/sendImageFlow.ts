 import { addKeyword, EVENTS } from "@builderbot/bot";

const sendImageFlow = addKeyword("GS3010972")
  .addAnswer("Te adjunto una imagen", {
    media: "./assets/menu_pizzas.png"
  });

export { sendImageFlow };