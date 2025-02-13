import axios from "axios";
import Cookies from "js-cookie";
import { Auth } from "./auth";
import { Session } from "./session";
import { Clients } from "./clients";

export default class ApiClient {
  auth: Auth;
  session: Session;
  clients: Clients;
  constructor() {
    this.auth = new Auth();
    this.session = new Session();
    this.clients = new Clients();

    axios.defaults.headers.common["Authorization"] = `Bearer ${Cookies.get(
      "accessToken"
    )}`;
    axios.defaults.baseURL = "http://localhost:3001/api/v1/";
  }
}
