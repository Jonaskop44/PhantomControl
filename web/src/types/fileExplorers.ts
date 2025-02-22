import { Client } from "./clients";

export interface FileExplorers {
  id?: number;
  hwid: string;
  name: string;
  userId?: number;
  createdAt?: Date;
  updatedAt?: Date;

  client?: Client;
}

export type FileExplorer = FileExplorers;
