const express = require('express');
const router = express.Router();
const db = require('../db/database');

/**
 * Rota para relatórios do gerente
 */
router.get('/relatorios', async (req, res) => {
  try {
    const { tipo, mesa, inicio, fim, status } = req.query;

    if (!tipo) {
      return res.status(400).json({ erro: 'O parâmetro "tipo" é necessário' });
    }

    let resultado;
    
    switch (tipo) {
      case 'por-mesa':
        if (!mesa) return res.status(400).json({ erro: 'Número da mesa é obrigatório' });
        resultado = await db.buscarReservasPorMesa(mesa);
        break;
      
      case 'por-periodo':
        if (!inicio || !fim) return res.status(400).json({ erro: 'Data de início e fim são obrigatórias' });
        resultado = await db.buscarReservasPorPeriodo(inicio, fim);
        break;
      
      case 'confirmadas':
        resultado = await db.buscarReservasConfirmadas();
        break;

      case 'mesas-livres':
        resultado = await db.buscarMesasLivres();
        break;
      
      default:
        return res.status(400).json({ erro: 'Tipo de relatório inválido' });
    }

    res.json({
      sucesso: true,
      dados: resultado || []
    });

  } catch (erro) {
    console.error('Erro no relatório:', erro);
    res.status(500).json({ 
      sucesso: false,
      erro: 'Falha ao gerar relatório' 
    });
  }
});

/**
 * Nova rota para cadastrar reserva (atendente)
 */
router.post('/reservas', async (req, res) => {
  try {
    const { mesa, cliente, data } = req.body;
    
    // Verifica se a mesa está livre
    const mesaDisponivel = await db.verificarDisponibilidadeMesa(mesa, data);
    if (!mesaDisponivel) {
      return res.status(400).json({ erro: 'Mesa já reservada para este horário' });
    }

    // Cria reserva com status "reservada"
    const reserva = await db.criarReserva({
      mesa,
      cliente,
      data,
      status: 'reservada' // Status muda ao ser reservada
    });

    res.json({
      sucesso: true,
      dados: reserva
    });

  } catch (erro) {
    console.error('Erro ao criar reserva:', erro);
    res.status(500).json({ 
      sucesso: false,
      erro: 'Falha ao criar reserva' 
    });
  }
});

/**
 * Nova rota para confirmar ocupação (garçom)
 */
router.put('/reservas/:id/confirmar', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Atualiza status para "confirmada"
    const reserva = await db.atualizarReserva(id, { 
      status: 'confirmada',
      garcom: req.body.garcom 
    });

    // Libera a mesa (opcional depende da sua regra de negócio)
    await db.atualizarStatusMesa(reserva.mesa, 'livre');

    res.json({
      sucesso: true,
      dados: reserva
    });

  } catch (erro) {
    console.error('Erro ao confirmar reserva:', erro);
    res.status(500).json({ 
      sucesso: false,
      erro: 'Falha ao confirmar reserva' 
    });
  }
});

module.exports = router;