import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";
const API_URL = `${BASE_URL}/reserva`;

export const getReservas = async () => {
    const response = await fetch(API_URL);
    return response.json();
};

export async function criarReserva(reserva) {
    try {
        console.log('Enviando reserva:', reserva);

        const response = await axios.post(API_URL, {
            data: reserva.data,
            hora: reserva.hora,
            numeMesa: parseInt(reserva.numeMesa),
            quantPessoas: parseInt(reserva.quantPessoas),
            nomeRespons: reserva.nomeRespons,
            statusMesa: reserva.statusMesa || 'reservada',
            usuario_id: reserva.usuarioId || null,
        });

        console.log('Resposta do servidor:', response.data);
        return response.data.dados;
    } catch (error) {
        console.error('Erro ao criar reserva:', error);
        throw error;
    }
}

export const atualizarReserva = async (id, dadosAtualizados) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosAtualizados),
    });
    return response.json();
};
