import { IsInt, IsNotEmpty, IsString } from 'class-validator';
export class CreateClientDto {
  @IsInt()
  @IsNotEmpty()
  readonly userId: number;

  @IsString()
  @IsNotEmpty()
  readonly hwid: string;

  @IsString()
  @IsNotEmpty()
  readonly ip: string;

  @IsString()
  @IsNotEmpty()
  readonly os: string;
}
export class SendCommandDto {
  @IsString()
  @IsNotEmpty()
  readonly command: string;
}

export class CreateFileDto {
  @IsString()
  @IsNotEmpty()
  readonly content: string;
}
