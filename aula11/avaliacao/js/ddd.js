// ──────────────────────────────────────────────
//  Consulta DDD — BrasilAPI
//  Padrão reutilizado do projeto (buscarCEP / buscarBanco)
// ──────────────────────────────────────────────

async function buscarDDD() {
    const input = document.getElementById('inputDDD');
    const box   = document.getElementById('resultadoDDD');

    // 1. Validação local (mesmo padrão do buscarBanco)
    const ddd = input.value.trim();
    if (!ddd) {
        box.innerHTML = `<div class="erro-box">⚠️ Por favor, digite um DDD.</div>`;
        return;
    }
    if (ddd.length > 2 || isNaN(ddd)) {
        box.innerHTML = `<div class="erro-box">⚠️ DDD inválido. Digite apenas os 2 dígitos (ex: 61).</div>`;
        return;
    }

    // 2. Estado de carregamento (mesmo padrão do buscarCEP)
    box.innerHTML = `<p class="loading">⏳ Consultando Registro Nacional...</p>`;

    try {
        // 3. Chamada à BrasilAPI — mesmo padrão fetch usado no projeto
        const resposta = await fetch(`https://brasilapi.com.br/api/ddd/v1/${ddd}`, { mode: 'cors' });

        // 4. Gestão de erros HTTP (mesmo padrão do buscarBanco)
        if (!resposta.ok) {
            if (resposta.status === 404) {
                throw new Error("DDD não identificado. Verifique o número digitado.");
            } else if (resposta.status === 504) {
                throw new Error("Servidor lento, tente novamente.");
            } else {
                throw new Error("Erro desconhecido na API.");
            }
        }

        // 5. Leitura do JSON
        const dados = await resposta.json();

        // 6. Criação dinâmica do DOM (mesmo padrão do buscarBanco)
        //    dados = { state: "DF", cities: ["BRASÍLIA", "VILA BOA", ...] }
        const cardsHTML = dados.cities
            .map(cidade => `
                <div class="cidade-card">
                    <div class="cidade-nome">${cidade}</div>
                    <div class="cidade-regiao">Região Metropolitana (${dados.state})</div>
                </div>
            `)
            .join('');

        box.innerHTML = `
            <div class="estado-header">
                📍 Estado correspondente: <span class="sigla">${dados.state}</span>
            </div>
            <div class="cidades-grid">
                ${cardsHTML}
            </div>
        `;

    } catch (erro) {
        // 7. Tratamento visual do erro (mesmo padrão do projeto)
        if (erro.message.includes("fetch")) {
            box.innerHTML = `<div class="erro-box">⚠️ Falha de conexão. Verifique sua internet.</div>`;
        } else {
            box.innerHTML = `<div class="erro-box">⚠️ <strong>Falha:</strong> ${erro.message}</div>`;
        }
    }
}

// Permite consultar pressionando Enter
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('inputDDD')
        .addEventListener('keydown', (e) => {
            if (e.key === 'Enter') buscarDDD();
        });
});