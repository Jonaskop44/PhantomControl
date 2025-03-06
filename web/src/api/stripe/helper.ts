import { Role } from "@/types/user";
import axios from "axios";

export class Helper {
  constructor() {}

  async createCheckoutSession(plan: Role | null) {
    return axios
      .post(`stripe/create-checkout-session?plan=${plan}`)
      .then((response) => {
        if (response.status !== 201) return { data: null, status: false };

        const data = response.data;
        return { data: data, status: true };
      })
      .catch(() => {
        return { data: null, status: false };
      });
  }

  async getSessionStatus(sessionId: string) {
    return axios
      .get(`stripe/session-status?session_id=${sessionId}`)
      .then((response) => {
        if (response.status !== 200) return { data: null, status: false };

        const data = response.data;
        return { data: data, status: true };
      })
      .catch(() => {
        return { data: null, status: false };
      });
  }
}
