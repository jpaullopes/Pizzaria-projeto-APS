// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./db');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Rota de teste
app.get('/', (req, res) => {
  res.send('API da Pizzaria - Backend funcionando!');
});

// Endpoint para obter lista de sabores
app.get('/sabores', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Sabor ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erro ao obter sabores.' });
  }
});

// Endpoint para criação de conta de atendente
app.post('/atendentes', async (req, res) => {
  const { username, password } = req.body;
  // Aqui você pode adicionar validações (ex.: verificar se username já existe)
  try {
    const result = await pool.query(
      'INSERT INTO Atendente (username, password) VALUES ($1, $2) RETURNING id',
      [username, password]
    );
    res.json({ success: true, message: 'Conta criada com sucesso.', id: result.rows[0].id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erro ao criar conta.' });
  }
});

// Endpoint para login de atendente
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM Atendente WHERE username = $1 AND password = $2',
      [username, password]
    );
    if (result.rows.length > 0) {
      res.json({ success: true, message: 'Login efetuado com sucesso.' });
    } else {
      res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erro no login.' });
  }
});

// Endpoint para registrar pedido
app.post('/pedidos', async (req, res) => {
  const { cliente, pizzas } = req.body;
  try {
    await pool.query('BEGIN');
    
    // Inserir o cliente
    const clienteQuery = 'INSERT INTO Cliente (nome, telefone, endereco) VALUES ($1, $2, $3) RETURNING id';
    const clienteResult = await pool.query(clienteQuery, [cliente.nome, cliente.telefone, cliente.endereco]);
    const clienteId = clienteResult.rows[0].id;
    
    // Inserir o pedido
    const pedidoQuery = 'INSERT INTO Pedido (cliente_id, status) VALUES ($1, $2) RETURNING id';
    const pedidoResult = await pool.query(pedidoQuery, [clienteId, 'Pendente']);
    const pedidoId = pedidoResult.rows[0].id;
    
    // Processar cada pizza e calcular o preço
    let totalPedido = 0;
    let pizzasDetalhes = [];
    for (const pizza of pizzas) {
      // pizza: { tamanho, saborId }
      let precoBase = 0;
      if (pizza.tamanho === 'Média') {
        precoBase = 15;
      } else if (pizza.tamanho === 'Grande') {
        precoBase = 35;
      } else if (pizza.tamanho === 'Gigante') {
        precoBase = 45;
      }
      // Obter o sabor a partir do ID
      const saborQuery = 'SELECT * FROM Sabor WHERE id = $1';
      const saborResult = await pool.query(saborQuery, [pizza.saborId]);
      if (saborResult.rows.length === 0) {
        throw new Error('Sabor não encontrado.');
      }
      const sabor = saborResult.rows[0];
      const precoPizza = precoBase + parseFloat(sabor.adicional);
      totalPedido += precoPizza;
      pizzasDetalhes.push({
        tamanho: pizza.tamanho,
        sabor: sabor.nome,
        preco: precoPizza
      });
      // Inserir a pizza
      const pizzaQuery = 'INSERT INTO Pizza (pedido_id, tamanho, sabor) VALUES ($1, $2, $3)';
      await pool.query(pizzaQuery, [pedidoId, pizza.tamanho, sabor.nome]);
    }
    
    await pool.query('COMMIT');
    
    // Calcular tempo estimado de entrega (entre 30 e 60 minutos)
    const tempoEntrega = Math.floor(Math.random() * (60 - 30 + 1)) + 30;
    
    res.json({
      success: true,
      message: 'Pedido registrado com sucesso.',
      pedido: {
        id: pedidoId,
        cliente: cliente.nome,
        total: totalPedido,
        tempoEntrega: tempoEntrega,
        pizzas: pizzasDetalhes
      }
    });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ success: false, message: 'Erro ao registrar o pedido.' });
  }
});

// Endpoint para atualizar o status do pedido (opcional)
app.put('/pedidos/:id/status', async (req, res) => {
  const pedidoId = req.params.id;
  const { status } = req.body;
  try {
    const updateQuery = 'UPDATE Pedido SET status = $1 WHERE id = $2';
    await pool.query(updateQuery, [status, pedidoId]);
    res.json({ success: true, message: 'Status atualizado com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erro ao atualizar status.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
