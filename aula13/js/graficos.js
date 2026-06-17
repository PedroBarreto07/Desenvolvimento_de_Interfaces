const URL_BASE = "https://6a1f6463b79eec0d6cf0b9d2.mockapi.io/produto";

async function carregarDashboard() {
    const status = document.getElementById('status-api');
    try {
        status.innerText = "⏳ Sincronizando dados...";
        const resposta = await fetch(URL_BASE);
        const produtos = await resposta.json();

        // 1. ATUALIZAR TABELA (Operacional)
        const corpoTabela = document.getElementById('corpo-tabela');
        corpoTabela.innerHTML = "";
        produtos.forEach(p => {
            const total = p.quantidade * p.valor;
            corpoTabela.innerHTML += `
                <tr>
                    <td>${p.id}</td>
                    <td>${p.nome}</td>
                    <td>${p.quantidade} un.</td>
                    <td>R$ ${p.valor.toFixed(2)}</td>
                    <td><strong>R$ ${total.toFixed(2)}</strong></td>
                </tr>
            `;
        });

        // 2. PREPARAR DADOS PARA GRÁFICOS (ECharts)
        const nomes = produtos.map(p => p.nome);
        const valoresTotais = produtos.map(p => p.quantidade * p.valor);
        const dadosPizza = produtos.map(p => ({ value: p.quantidade, name: p.nome }));

        // 3. RENDERIZAR GRÁFICO DE BARRAS (Investimento)
        renderizarBarras(nomes, valoresTotais);

        // 4. RENDERIZAR GRÁFICO DE PIZZA (Mix de Estoque)
        renderizarPizza(dadosPizza);

        status.innerText = "✅ Dashboard atualizado com sucesso.";
    } catch (err) {
        status.innerText = "❌ Falha ao carregar dados do MockAPI.";
    }
}

function renderizarBarras(nomes, valores) {
    const chartBarras = echarts.init(document.getElementById('grafico-barras'));
    const option = {
        title: { text: 'Onde está o dinheiro? (Valor Total)', left: 'center' },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: nomes },
        yAxis: { type: 'value' },
        series: [{ data: valores, type: 'bar', color: '#1877f2' }]
    };
    chartBarras.setOption(option);
}

function renderizarPizza(dados) {
    const chartPizza = echarts.init(document.getElementById('grafico-pizza'));
    const option = {
        title: { text: 'O que falta? (Distribuição Qtd)', left: 'center' },
        tooltip: { trigger: 'item' },
        series: [{
            type: 'pie',
            radius: '50%',
            data: dados,
            emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
        }]
    };
    chartPizza.setOption(option);
}

// Inicialização
window.onload = carregarDashboard;