import { Console } from "./console";
import { Helper } from "./helper";

export class Clients {
  helper: Helper;
  console: Console;
  constructor() {
    this.helper = new Helper();
    this.console = new Console();
  }
}
