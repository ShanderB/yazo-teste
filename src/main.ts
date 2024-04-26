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

require('dotenv').config();

// Configurando o express
const app = express();
app.use(bodyParser.json());

/**
 * Configurando a conexão com o PostgreSQL
 * A classe Pool é usada para criar um pool de conexões com o banco de dados.
 * Um pool de conexões é um cache de conexões de banco de dados mantido para que as conexões possam ser reutilizadas quando necessário.
 **/
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
  const retornoBanco = await pool.query('SELECT * FROM usuarios WHERE nome = $1 AND senha = $2', [usuario, senha]);

  if(!retornoBanco.rows.length){
    res.status(400).json({ message: 'Usuário ou senha inválidos ou usuário inexistente.' });
    return;
  }

  // Se a autenticação for bem-sucedida, crie um token JWT.
  const token = jwt.sign({ usuario: usuario, senha }, process.env.JWT_SECRET!, { expiresIn: '1h' });

  // Envie o token de volta para o cliente.
  res.json({ token });
});

// Rota para criar um novo usuario.
app.post('/usuario', async (req: Request, res: Response) => {
  criarUsuario(req, res, pool);
});

// Rota para obter todos os usuarios.
app.get('/usuario', async (req: Request, res: Response) => {
  //TODO adicionar validação de permitir somente o organizador.
  listagemUsuarios(res, pool);
});

// Rota para atualizar um usuario.
app.put('/usuario/:id', async (req: Request, res: Response) => {
  //TODO adicionar validação de permitir somente o organizador.
  alteracaoUsuario(req, res, pool);
});

// Rota para deletar um usuario.
app.delete('/usuario/:id', async (req: Request, res: Response) => {
  //TODO adicionar validação de permitir somente o organizador.
  deletarUsuario(req, res, pool);
});


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Iniciando o servidor
app.listen(3000, () => {
  console.log('Server running on port 3000');
});