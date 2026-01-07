import * as signalR from '@microsoft/signalr'
import { BaseURL } from '../constants/baseURL'

const URL = 'https://localhost:44363/quoteHub' ;

export class Connector {
    private connection: signalR.HubConnection
    public events: (
        onMessageReceived: (username: string, message: string) => void
    ) => void
    static instance: Connector
    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(URL,{
                skipNegotiation:true,
                transport: signalR.HttpTransportType.WebSockets
            })
            .withAutomaticReconnect()
            .build()

            //Start
        this.connection.start().catch((err) => console.log(err))

        //Event
        this.connection.on('ReceiveMessage', (username, message) => {
           alert("Called");
           // onMessageReceived(username, message)
        })
        this.events = (onMessageReceived) => {
            
        }
    }
    public newMessage = (messages: string) => {
        this.connection
            .send('newMessage', 'foo', messages)
            .then((x) => console.log('sent'))
    }
    public static getInstance(): Connector {
        if (!Connector.instance) Connector.instance = new Connector()
        return Connector.instance
    }
}