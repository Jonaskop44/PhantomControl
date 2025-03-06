import axios from "axios";
import Cookies from "js-cookie";
import { Auth } from "./auth";
import { Session } from "./session";
import { Clients } from "./clients";
import { User } from "./user";
import { Analytics } from "./analytics";
import { Stripe } from "./stripe";

export default class ApiClient {
  auth: Auth;
  session: Session;
  clients: Clients;
  user: User;
  analytics: Analytics;
  stripe: Stripe;
  constructor() {
    this.auth = new Auth();
    this.session = new Session();
    this.clients = new Clients();
    this.user = new User();
    this.analytics = new Analytics();
    this.stripe = new Stripe();

    axios.defaults.headers.common["Authorization"] = `Bearer ${Cookies.get(
      "accessToken"
    )}`;
    axios.defaults.baseURL = "http://127.0.0.1:3001/api/v1/";
  }
}
