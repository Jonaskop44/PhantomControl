import axios from "axios";
import io, { Socket } from "socket.io-client";

export class Helper {
  constructor() {}

  private socket: Socket | null = null;

  async getAllClients() {
    return axios
      .get("clients")
      .then((response) => {
        if (response.status !== 200) return { data: null, status: false };

        const data = response.data;
        return { data: data, status: true };
      })
      .catch(() => {
        return { data: null, status: false };
      });
  }

  initSocket(callback: (data: { hwid: string; online: boolean }) => void) {
    if (!this.socket) {
      this.socket = io("http://localhost:3001");
    }

    this.socket.on("updateClientStatus", (data) => {
      callback(data);
    });
  }

  disconnectSocket() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}
