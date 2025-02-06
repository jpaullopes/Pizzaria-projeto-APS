# Pizzaria Projeto APS

Este é o projeto final da disciplina de Análise e Projeto de Sistemas. Trata-se de um sistema para controle de uma pizzaria de entrega em domícilio, permitindo que os **atendentes** gerenciem seus cadastros, façam login, registrem pedidos e visualizem os pedidos registrados. O sistema utiliza:

- **Backend:** Node.js, Express e PostgreSQL
- **Frontend:** HTML, CSS e JavaScript (Fetch API)

---

## Estrutura do Projeto

```
Pizzaria-projeto-APS/
├── backend/
│   ├── package.json         # Configuração do Node.js e dependências (body-parser, cors, pg)
│   ├── server.js            # Arquivo principal do backend, contendo as rotas da API
│   └── db.js                # Configuração da conexão com o banco de dados PostgreSQL
└── frontend/
    ├── login.html           # Tela de login para atendentes
    ├── criarConta.html      # Tela para criação de conta de atendentes
    ├── pedidos.html         # Tela para registro de pedidos (dados do cliente e pizzas)
    ├── pedidoRegistrado.html# Tela para exibição dos detalhes do pedido registrado
    ├── app.js               # Arquivo para funções comuns (scripts JavaScript)
    └── style.css            # Folha de estilo com identidade visual do projeto
```

---

## Tecnologias e Ferramentas Utilizadas

- **Backend:**
  - Node.js e Express para a criação da API.
  - PostgreSQL como banco de dados relacional.
  - Dependências Node: `body-parser`, `cors`, `pg`.
- **Frontend:**
  - HTML5, CSS3 e JavaScript.
  - **Live Server (extensão do VS Code):**\
    Recomendada para rodar as páginas web de forma local com protocolo HTTP (evita problemas de CORS e garante uma experiência mais próxima de um ambiente de produção).
- **Outras Ferramentas:**
  - pgAdmin, DBeaver ou `psql` para gerenciamento do PostgreSQL.

---

## Configuração do Banco de Dados

1. **Criar o Banco de Dados:**

   No PostgreSQL, execute o comando:

   ```sql
   CREATE DATABASE pizzaria;
   ```

2. **Criar as Tabelas:**

   Conecte-se ao banco `pizzaria` e execute os seguintes comandos SQL:

   ```sql
   -- Tabela de Clientes
   CREATE TABLE Cliente (
       id SERIAL PRIMARY KEY,
       nome VARCHAR(100) NOT NULL,
       telefone VARCHAR(20),
       endereco TEXT
   );

   -- Tabela de Pedidos
   CREATE TABLE Pedido (
       id SERIAL PRIMARY KEY,
       cliente_id INTEGER REFERENCES Cliente(id),
       status VARCHAR(20) DEFAULT 'Pendente'
   );

   -- Tabela de Pizzas
   CREATE TABLE Pizza (
       id SERIAL PRIMARY KEY,
       pedido_id INTEGER REFERENCES Pedido(id),
       tamanho VARCHAR(20),
       sabor VARCHAR(50)
   );

   -- Tabela de Sabores (pré-cadastrados)
   CREATE TABLE Sabor (
       id SERIAL PRIMARY KEY,
       nome VARCHAR(100) NOT NULL,
       adicional DECIMAL NOT NULL
   );

   -- Inserindo os 30 sabores pré-cadastrados:
   INSERT INTO Sabor (nome, adicional) VALUES
   ('Calabresa', 15), ('Margherita', 15), ('Portuguesa', 15), ('Frango com Catupiry', 15), ('Quatro Queijos', 15),
   ('Marguerita Especial', 15), ('Pepperoni', 15), ('Vegetariana', 15), ('Escarola', 15), ('Alho e Óleo', 15),
   ('Chocolate', 20), ('Banana com Canela', 20), ('Prestígio', 20), ('Romeu e Julieta', 20), ('Abacaxi', 20),
   ('Carne Seca', 20), ('Chá de Hibisco', 20), ('Strogonoff', 20), ('Cogumelos', 20), ('Ervilha com Bacon', 20),
   ('Bacon', 25), ('Atum', 25), ('Frutos do Mar', 25), ('Rúcula com Tomate Seco', 25), ('Alho Poró', 25),
   ('Alho Cremoso', 25), ('Brócolis', 25), ('Espinafre', 25), ('Lombo Canadense', 25), ('Tomate e Manjericão', 25);
   ```

3. **Configuração do Arquivo ********`db.js`********:**

   No arquivo `backend/db.js`, configure as credenciais do seu banco de dados:

   ```javascript
   const { Pool } = require('pg');

   const pool = new Pool({
     user: 'seu_usuario',         // Ex.: 'postgres'
     host: 'localhost',
     database: 'pizzaria',        // Banco de dados criado
     password: 'sua_senha',       // Sua senha do PostgreSQL
     port: 5432,
   });
   ```

---

## Como Executar o Projeto

### Backend

1. **Navegue até a pasta ********`backend`********:**
   ```bash
   cd Pizzaria-projeto-APS/backend
   ```
2. **Instale as dependências:**
   ```bash
   npm install
   ```
3. **Inicie o servidor:**
   ```bash
   npm start
   ```
   O backend ficará disponível na porta **3000**.

### Frontend

Para rodar as páginas do frontend de forma correta:

1. **Utilizando a Extensão "Live Server" no VS Code:**
   - Abra o VS Code e carregue a pasta `frontend`.
   - Clique com o botão direito sobre o arquivo `login.html` (ou outro) e selecione **"Open with Live Server"**.

---

## Funcionalidades do Sistema

- **Criação de Conta para Atendentes**
- **Login de Atendentes**
- **Registro de Pedidos**
- **Tela de Pedido Registrado**

---

## Considerações Finais

- **Segurança:**

  - Uso de hashing para senhas (ex.: bcrypt)
  - Autenticação JWT
  - Implementação de HTTPS

---

Esperamos que este README forneça todas as informações necessárias para utilizar o projeto com sucesso! 🚀