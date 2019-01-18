import { Injectable } from '@angular/core';
import { GuacdConfig } from './gucadconfig.model';

declare var Guacamole;
declare var CONFIG;

@Injectable()
export class GuacamoleService {
  //private tunnelUrl = GUACAMOLE_URL;
  public clients = {};
  //private tunnel;

  constructor() {
  }

  connect(token: string, config: GuacdConfig) {
    return this.initiateTunnel(token, config);
  }

  private initiateTunnel(token, config: GuacdConfig) {
    config.token = token;
    const params = this.serialize(config);
    const tunnel = new Guacamole.WebSocketTunnel(CONFIG.guacamoleTunnel);
    const client = new Guacamole.Client(tunnel);
    try{
      client.connect(params);
      return client;
    }catch(err) {
      return null;
    }   
  }

  private serialize(params_obj) {
    const str = [];
    for (const p in params_obj) {
      if (params_obj.hasOwnProperty(p)) {
        if (Array.isArray(params_obj[p])) {
          params_obj[p].forEach(current => {
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(current));
          });
        } else {
          str.push(encodeURIComponent(p) + '=' + encodeURIComponent(params_obj[p]));
        }

      }
    }
    return str.join('&');
  }

  public getConnection(device_name) {
    return this.clients[device_name];
  }

  public addConnection(device_name, client) {
    this.clients[device_name] = client;
  }

  public removeConnection(device_name) {
    delete this.clients[device_name];
  }

  public sendClipboard(client, data) {
    // Do not send requests if not connected
    //if (!isConnected())
    //    return;

    // Open stream
    var stream = client.createClipboardStream("text/plain");
    console.log(client);

    var writer = new Guacamole.StringWriter(stream);
    console.log(data);
    // Send text chunks
    for (var i=0; i<data.length; i += 4096)
      writer.sendText(data.substring(i, i+4096));
    // Close stream
    writer.sendEnd();  
  }
}
