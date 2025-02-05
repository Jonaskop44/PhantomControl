export interface Client {
  id?: number;
  hwid?: string;
  ip?: string;
  os?: string;
  online?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
