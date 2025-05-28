// Função para lidar com o envio do formulário de cadastro de reserva
document.getElementById("formReserva").onsubmit = async (e) => {
  e.preventDefault();

  // Coleta dos dados do formulário
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  try {
    // Envia os dados para o servidor via POST
    const response = await fetch("/reserva", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    // Exibe a resposta do servidor
    const result = await response.text();
    alert(result);
    e.target.reset(); // Limpa o formulário
  } catch (error) {
    alert("Erro ao tentar criar a reserva. Verifique sua conexão.");
    console.error(error);
  }
};

// Função para lidar com o envio do formulário de cancelamento de reserva
document.getElementById("formCancelar").onsubmit = async (e) => {
  e.preventDefault();

  // Coleta o ID da reserva a ser cancelada
  const formData = new FormData(e.target);
  const id = formData.get("idReserva");

  try {
    // Envia o pedido de DELETE para o servidor
    const response = await fetch(`/reserva/${id}`, {
      method: "DELETE"
    });

    // Exibe a resposta do servidor
    const result = await response.text();
    alert(result);
    e.target.reset(); // Limpa o formulário
  } catch (error) {
    alert("Erro ao tentar cancelar a reserva. Verifique sua conexão.");
    console.error(error);
  }
};
