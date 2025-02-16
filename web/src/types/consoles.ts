export interface Consoles {
  id?: number;
  hwid: string;
  name: string;
  userId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type Console = Consoles;
