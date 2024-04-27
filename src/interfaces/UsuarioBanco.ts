import { UsuarioTipo } from "../constants";

export interface UsuarioBanco {
    id: string;
    usuario: string;
    senha: string;
    tipo: UsuarioTipo;
}