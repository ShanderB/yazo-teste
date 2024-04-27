import { JwtPayload } from "jsonwebtoken";

export interface MinhaJwtPayload extends JwtPayload {
    usuario: string;
    senha: string;
    id: number;
}