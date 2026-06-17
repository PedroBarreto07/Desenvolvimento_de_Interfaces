const executar = () => {
    // 1. Captura todos os elementos da lista
    const servidores = document.querySelectorAll('.item');

    // --- LOOP FOR: Formatação Geral ---
    // Percorre a lista para encontrar quem está Offline
    for (let i=0; i < servidores.length; i++) {
        let elemento = servidores[i];
        let conteudo = elemento.innerText;

        if (conteudo.includes("Offline")) {
            elemento.classList.add("alerta");
            console.log("Aviso aplicado ao Servidor" + (i + 1));
        }
    }

    // --- LOOP WHILE: Segurança (Scanner de Erros) ---
    // Este loop procura um erro crítico e para o sistema se encontrar
    let c =0;
    while (c < servidores.length) {
        let status = servidores[c].innerText;

        if (status.includes("Erro Crítico")) {
            servidores[c].classList.add("critico");
            alert("SISTEMA BLOQUEADO: Falha grave no Servidor" + (c + 1));
            break; // O break interrompe a varredura por segurança
        }
        c++;
    }
}