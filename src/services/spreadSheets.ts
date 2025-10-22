// const spreadSheetId = '1Tqhr0K-kLjZm5K8L6u-M9wz4cdJRdR3x8DPM9vZU_6E'
import { google } from "googleapis";
import { sheets_v4 } from "googleapis";

class SheetManager {
    private sheets: sheets_v4.Sheets;
    private spreadsheetId: string;

    constructor(spreadsheetId: string, privateKey: string, clientEmail: string) {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                private_key: privateKey,
                client_email: clientEmail,
            },
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        this.sheets = google.sheets({ version: "v4", auth });
        this.spreadsheetId = spreadsheetId;
    }

    async userExists(number: string): Promise<boolean> {
        try {
            const result = await this.sheets.spreadsheets.values.get({
                spreadsheetId: this.spreadsheetId,
                range: 'Users!A:A',
            });

            const rows = result.data.values;
            if (rows) {
                const numbers = rows.map(row => row[0]);
                return numbers.includes(number);
            }
            return false;

        } catch (error) {
            console.log("Error al verificar si el usuario existe", error);
            return false;
        }
    }

    async createUser(number: string, name: string, mail: string): Promise<void> {
        try {
            await this.sheets.spreadsheets.values.append({
                spreadsheetId: this.spreadsheetId,
                range: 'Users!A:C',
                valueInputOption: 'RAW',
                requestBody: {
                    values: [[number, name, mail]]
                },
            });

            //Crea una pestana nueva 
            await this.sheets.spreadsheets.batchUpdate({
                spreadsheetId: this.spreadsheetId,
                requestBody: {
                    requests: [
                        {
                            addSheet: {
                                properties: {
                                    title: number,
                                },
                            },
                        },
                    ],
                },
            });
        } catch (error) {
            console.log("Error al crear usuario o nueva pestana", error);
        }
    }

    // Función para obtener las preguntas/respuestas invertidas
    async getUserConv(number: string): Promise<any[]> {
        try {
            const result = await this.sheets.spreadsheets.values.get({
                spreadsheetId: this.spreadsheetId,
                range: `${number}!A:B`, // Asumiendo que las preguntas están en A y respuestas en B
            });

            const rows = result.data.values;
            if (!rows || rows.length === 0) {
                return [];
            }

            // Tomar las últimas preguntas/respuestas (hasta un máximo de 3) y revertir el orden
            const lastConversations = rows.slice(-3).reverse();

            // Formatear las respuestas en el formato solicitado
            const formattedConversations = [];
            for (let i = 0; i < lastConversations.length; i++) {
                const [userQuestion, assistantAnswer] = lastConversations[i];
                formattedConversations.push(
                    { role: "user", content: userQuestion },
                    { role: "assistant", content: assistantAnswer }
                );
            }

            return formattedConversations;
        } catch (error) {
            console.error("Error al obtener la conversación del usuario:", error);
            return [];
        }
    }


    // Función para agregar una conversación al inicio de la pestaña del usuario
    async addConverToUser(number: string, conversation: { role: string, content: string }[]): Promise<void> {
        try {
            const question = conversation.find(c => c.role === "user")?.content;
            const answer = conversation.find(c => c.role === "assistant")?.content;
            const date = new Date().toISOString(); // Fecha en formato UTC

            if (!question || !answer) {
                throw new Error("La conversación debe contener tanto una pregunta como una respuesta.");
            }

            // Leer las filas actuales para empujarlas hacia abajo
            const sheetData = await this.sheets.spreadsheets.values.get({
                spreadsheetId: this.spreadsheetId,
                range: `${number}!A:C`,
            });

            const rows = sheetData.data.values || [];

            // Agregar la nueva conversación en la primera fila
            rows.unshift([question, answer, date]);

            // Escribir las filas de nuevo en la hoja
            await this.sheets.spreadsheets.values.update({
                spreadsheetId: this.spreadsheetId,
                range: `${number}!A:C`,
                valueInputOption: 'RAW',
                requestBody: {
                    values: rows,
                },
            });

        } catch (error) {
            console.error("Error al agregar la conversación:", error);
        }
    }


}

export default new SheetManager(

    process.env.SPREADSHEET_ID,
    process.env.PRIVATE_KEY,
    process.env.CLIENT_EMAIL

);