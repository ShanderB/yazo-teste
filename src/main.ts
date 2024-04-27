// Importando os módulos necessários
import express from 'express';
import { Pool } from 'pg';
import bodyParser from 'body-parser';
import { criarUsuario } from './usuario/criacao';
import { listagemUsuarios } from './usuario/listagem';
import { alteracaoUsuario } from './usuario/alteracao';
import { deletarUsuario } from './usuario/deletar';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { dadosJWT, validacaoTipoUsuario } from './common/validacaoTipoUsuario';
import { UsuarioTipo } from './constants';
import { criarPergunta } from './pergunta/Criacao';

require('dotenv').config();

// Configurando o express
const app = express();
app.use(bodyParser.json());

/**
 * Configurando a conexão com o PostgreSQL
 * A classe Pool é usada para criar um pool de conexões com o banco de dados.
 * Um pool de conexões é um cache de conexões de banco de dados mantido para que as conexões possam ser reutilizadas quando necessário.
 **/
//TODO mover para arquivo próprio.
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT!) //passando o "!" para dizer que a variável não é nula nunca.
});

app.post('/login', async (req: Request, res: Response) => {
  const { usuario, senha } = req.body;

  //TODO separar em algum arquivo.
  const retornoBanco = await pool.query('SELECT * FROM usuarios WHERE usuario = $1 AND senha = $2', [usuario, senha]);

  if (!retornoBanco.rows.length) {
    res.status(400).json({ message: 'Usuário ou senha inválidos ou usuário inexistente.' });
    return;
  }
  // Se a autenticação for bem-sucedida, crie um token JWT.
  const token = jwt.sign({ usuario: usuario, senha, usuarioId: retornoBanco.rows[0].id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

  // Envie o token de volta para o cliente.
  res.json({ token });
});


app.route('/usuario')
  .post(async (req: Request, res: Response) => {
    // Rota para criar um novo usuario.
    criarUsuario(req, res, pool);
  })
  .get(async (req: Request, res: Response) => {
    //TODO adicionar validação de permitir somente o organizador.
    // Rota para obter todos os usuarios.
    listagemUsuarios(res, pool);
  })
  .put(async (req: Request, res: Response) => {
    //TODO adicionar validação de permitir somente o organizador.
    alteracaoUsuario(req, res, pool);
  })
  .delete(async (req: Request, res: Response) => {
    //TODO adicionar validação de permitir somente o organizador.
    deletarUsuario(req, res, pool);
  })
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.route('/pergunta')
  .post(async (req: Request, res: Response) => {
    criarPergunta(req, res, pool);
  })
  .get(async (req: Request, res: Response) => { })
  .put(async (req: Request, res: Response) => { })
  .delete(async (req: Request, res: Response) => { })


// Iniciando o servidor
app.listen(3000, () => {
  console.log('Server running on port 3000');
});