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

  async sendCommand(hwid: string, command: string) {
    return axios
      .post(`clients/${hwid}/command`, {
        command: command,
      })
      .then((response) => {
        if (response.status !== 201) return { data: null, status: false };

        const data = response.data;

        console.log(data);

        return { data: data, status: true };
      })
      .catch(() => {
        return { data: null, status: false };
      });
  }

  async getClientRegistrationsLast30Days() {
    return axios
      .get("clients/registrations-last-30-days")
      .then((response) => {
        if (response.status !== 200) return { data: null, status: false };

        const data = response.data;
        return { data: data, status: true };
      })
      .catch(() => {
        return { data: null, status: false };
      });
  }

  async createConsole(name: string, hwid: string) {
    return axios
      .post(`clients/${hwid}/console/create`, {
        name: name,
      })
      .then((response) => {
        if (response.status !== 201) return { data: null, status: false };

        const data = response.data;
        return { data: data, status: true };
      })
      .catch(() => {
        return { data: null, status: false };
      });
  }

  async getConsolesByUserId() {
    return axios
      .get("clients/consoles")
      .then((response) => {
        if (response.status !== 200) return { data: null, status: false };

        const data = response.data;
        return { data: data, status: true };
      })
      .catch(() => {
        return { data: null, status: false };
      });
  }

  async getConsoleByHwid(hwid: string) {
    return axios
      .get(`clients/${hwid}/console`)
      .then((response) => {
        if (response.status !== 200) return { data: null, status: false };

        const data = response.data;
        return { data: data, status: true };
      })
      .catch(() => {
        return { data: null, status: false };
      });
  }

  async deleteConsole(hwid: string) {
    return axios
      .delete(`clients/${hwid}/console/delete`)
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
