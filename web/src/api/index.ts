import axios from "axios";
import Cookies from "js-cookie";
import { Auth } from "./auth";
import { Session } from "./session";
import { Clients } from "./clients";
import { User } from "./user";

export default class ApiClient {
  auth: Auth;
  session: Session;
  clients: Clients;
  user: User;
  constructor() {
    this.auth = new Auth();
    this.session = new Session();
    this.clients = new Clients();
    this.user = new User();

    axios.defaults.headers.common["Authorization"] = `Bearer ${Cookies.get(
      "accessToken"
    )}`;
    axios.defaults.baseURL = "http://127.0.0.1:3001/api/v1/";
  }
}
