import { JwtPayload } from "jsonwebtoken";
import { UsuarioTipo } from "../constants";

export interface MinhaJwtPayload extends JwtPayload {
    usuario: string;
    senha: string;
    usuarioId: number;
    tipo?: UsuarioTipo;
}