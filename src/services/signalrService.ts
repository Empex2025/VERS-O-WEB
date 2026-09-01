import * as signalR from "@microsoft/signalr";

class SignalRService {
    private connection: signalR.HubConnection | null = null;

    public async startConnection(token: string) {
        this.connection = new signalR.HubConnectionBuilder()
            // Substitua pela URL real do seu backend
            .withUrl("https://api.suaredesocial.com/chatHub", {
                accessTokenFactory: () => token
            })
            .withAutomaticReconnect() // Reconecta automaticamente
            .configureLogging(signalR.LogLevel.Information)
            .build();

        try {
            await this.connection.start();
            console.log("SignalR: Conectado com sucesso!");
        } catch (err) {
            console.error("SignalR: Erro ao conectar: ", err);
        }
    }

    public onReceiveMessage(callback: (user: string, message: string) => void) {
        if (this.connection) {
            this.connection.on("ReceiveMessage", callback);
        }
    }

    public async sendMessage(user: string, message: string) {
        if (this.connection) {
            try {
                await this.connection.invoke("SendMessage", user, message);
            } catch (err) {
                console.error("SignalR: Erro ao enviar mensagem: ", err);
            }
        }
    }
}

export const signalrService = new SignalRService();
