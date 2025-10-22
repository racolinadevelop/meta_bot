import { addKeyword, EVENTS } from "@builderbot/bot";

const menuFlow = addKeyword(EVENTS.ACTION)
    .addAction(async (ctx, { provider }) => {
        const list = {
            "header": {
                "type": "text",
                "text": "Menú de Opciones"
            },
            "body": {
                "text": "Te voy a dar las opciones que tengo disponibles"
            },
            "footer": {
                "text": ""
            },
            "action": {
                "button": "Opciones",
                "sections": [
                    {
                        "title": "Acciones",
                        "rows": [
                            {
                                "id": "GS3010971",
                                "title": "Audio",
                                "description": "🎧 Quiero escuchar un audio"
                            },
                            {
                                "id": "GS3010972",
                                "title": "Imagen",
                                "description": "🖼️ Quiero recibir una imagen"
                            },
                            {
                                "id": "GS3010973",
                                "title": "PDF",
                                "description": "📄 Quiero recibir un PDF"
                            }
                        ]
                    }
                ]
            }
        };

        await provider.sendList(`${ctx.from}@s.whatsapp.net`, list);
    });

export { menuFlow };
