import { HubConnectionBuilder, LogLevel, HubConnection } from '@microsoft/signalr';
import { API_SIGNALR_ROUTE } from 'config/api-consts';

export class SignalRService {
  private rConnection: HubConnection;

  constructor() {
    this.rConnection = new HubConnectionBuilder()
      .withUrl(API_SIGNALR_ROUTE)
      .configureLogging(LogLevel.Information)
      .build();
    this.rConnection
      .start()
      .then(() => {
        // tslint:disable-next-line:no-console
        console.log(`connected`);
      })
      .catch((err) => {
        // tslint:disable-next-line:no-console
        console.log('connection error', err.message);
      });
  }

  registerChannel = (channel: string, callback: any) => {
    this.rConnection.on(channel, (data) => {
      // tslint:disable-next-line:no-console
      console.log(data);
      if (typeof callback === 'function') {
        callback(data);
      }
    });
  };

  closeConnection = () => {
    this.rConnection.stop().then(() => {
      // tslint:disable-next-line:no-console
      console.log(`connection was closed`);
    });
  };
}

const signalRService = new SignalRService();
export default signalRService;
