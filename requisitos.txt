# Teste Técnico para Desenvolvedor Backend Yazo

####

Este teste foi elaborado para avaliar suas habilidades técnicas e práticas em desenvolvimento de software, especificamente no contexto de criação de sistemas backend usando tecnologias como Node.js, TypeScript e PostgreSQL.
&nbsp;

#### Objetivo do Projeto:

Desenvolver um sistema onde usuários organizadores criem perguntas e usuários participantes respondem a essas perguntas.

#### Requisitos

- **Deve ser possível criar usuários;**
  - Na criação do usuário deve ser possível definir seu tipo, sendo participante ou organizador;
  - Deve ser possível fazer login no sistema;
- **Deve ser possível criar perguntas;**
  - Apenas usuários organizadores podem criar perguntas.
  - Usuários organizadores e usuários participantes podem responder as perguntas;
  - Um usuário não pode responder uma pergunta criada por si mesmo;
  - O mesmo usuário não pode responder a mesma pergunta mais de uma vez.
- **Os usuários (ambos) devem ter uma listagem com paginação de todas as perguntas disponíveis;**
  - Nessa listagem, cada entidade deve conter uma propriedade indicando se a pergunta já foi respondida ou não pelo usuário autenticado;
- **Os usuários organizadores devem possuir uma listagem com paginação das respostas de uma pergunta específica.**

#### Tecnologias obrigatórias

- Node.js;
- TypeScript;
- PostgreSQL.
- As demais tecnologias ficam ao seu critério.
  &nbsp;

#### O que será avaliado

1. Atendimento dos requisitos;
2. Padrão REST;
3. Conceitos de SQL;
4. Estrutura usada no projeto;
5. Uso de testes automatizados;

#### Diferenciais

- Documento **explicando as decisões técnicas**, pode ser no próprio README;
- Documentação dos endpoints.

---

&nbsp;

#### Entrega

##### Data de Entrega:

Até 02/05/2024 às 23h59.

##### Como entregar o projeto?

- Sabemos que as vezes outras responsabilidades podem acabar impedindo a conclusão integral do teste, nesse caso não hesite em enviar para nós porque o resultado pode ser positivo.
- Deve ser criado um projeto no GitHub e deve ser enviado o link do projeto para o email **luis.vitor@yazo.com.br**
- Se optar por deixar o seu repositório privado, não esqueça também de convidar o mesmo email informado acima.
- Este teste não apenas avaliará suas habilidades técnicas, mas também sua capacidade de comunicar suas ideias e decisões técnicas de forma clara e eficaz.

> Alguns requisitos podem trazer a tona algumas dúvidas, sinta-se livre tanto para enviar dúvidas no email para contato ou abrindo uma issue nesse repositório quanto tomando suas próprias decisões no decorrer do projeto.

> Estamos ansiosos para ver sua solução para este desafio e disponíveis para quaisquer perguntas ou esclarecimentos adicionais sobre o processo. **Boa sorte!**

Atenciosamente,
_**Equipe Yazo**_
&nbsp;
![Yazo-Logo](https://i.ibb.co/ZY5T06Z/Logotipo.png)
