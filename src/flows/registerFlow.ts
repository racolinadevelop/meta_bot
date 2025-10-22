import { addKeyword, EVENTS } from "@builderbot/bot";
import spreadSheets from "~/services/spreadSheets";

const registerFlow = addKeyword(EVENTS.ACTION)
    .addAnswer(`Hola, podemos comenzar con el registro?`, { capture: true, buttons: [{ body: "Si, porfavor!" }, { body: "No, gracias!" }] },
        async (ctx, ctxFn) => {
            if (ctx.body === "No, gracias!") {
                return ctxFn.endFlow("El registro fue cancelado, puedes volver si deseas para registrate, solo vuelve a escribirle al bot")
            } else if (ctx.body === "Si, porfavor!") {
                await ctxFn.flowDynamic("Perfecto, a continuacion voy a hacerte algunas preguntas")
            } else {
                return ctxFn.fallBack("Tienes que elegir algunas de las opciones!")
            }

        })
    .addAnswer(`Primero cual es tu nombre?`, { capture: true },
        async (ctx, ctxFn) => {
            await ctxFn.flowDynamic("Perfecto " + ctx.body + "!👍")
            await ctxFn.state.update({ "name": ctx.body })
        })
    .addAnswer(`Ahora, cual es tu email?`, { capture: true },
        async (ctx, ctxFn) => {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(ctx.body)) {
                return ctxFn.fallBack("Por favor, ingresa un correo electrónico válido. 📧");
            }
            const state = ctxFn.state.getMyState();
            await spreadSheets.createUser(ctx.from, state.name, ctx.body);
            await ctxFn.flowDynamic("Excelente! Tus datos ya fueron cargados, ya podés comenzar a utilizar el bot.");
        })


export { registerFlow };