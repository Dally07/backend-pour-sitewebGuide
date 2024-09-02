import { Type } from "class-transformer";
import { IsISO8601, IsInt } from "class-validator";

export class CreateInformationDto {
  titreInfo: string;
  corpsinfo: string;
  userId?: number;
  imageData: string;
}

