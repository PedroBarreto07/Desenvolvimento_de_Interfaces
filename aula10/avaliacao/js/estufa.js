const executar = () => {
    // 1. Captura todos os elementos da lista
    const servidores = document.querySelectorAll('.estufa-item');

    // --- LOOP FOR: Formatação Geral ---
    // Percorre a lista para encontrar quem está Offline
    for (let i=0; i < servidores.length; i++) {
        let elemento = servidores[i];
        let conteudo = elemento.innerText;

        if (conteudo.includes("Baixa")) {
            elemento.classList.add("perigo");
            console.log("Aviso aplicado ao Servidor" + (i + 1));
        }
    }

    // --- LOOP WHILE: Segurança (Scanner de Erros) ---
    // Este loop procura um erro crítico e para o sistema se encontrar
    let c =0;
    while (c < servidores.length) {
        let status = servidores[c].innerText;

        if (status.includes("Sensor Inoperante")) {
            servidores[c].classList.add("bloqueado");
            alert("Sensor Inoperante: Falha grave no Servidor" + (c + 1));
            break; // O break interrompe a varredura por segurança
        }
        c++;
    }
}