const URL_BASE = "https://6a1f6463b79eec0d6cf0b9d2.mockapi.io/produto";

// NAVEGAÇÃO: Troca de telas no mesmo HTML
function navegar(tela) {
    document.getElementById('tela-incluir').style.display = tela === 'incluir' ? 'block' : 'none';
    document.getElementById('tela-listar').style.display = tela === 'listar' ? 'block' : 'none';

    if (tela === 'listar') {
        limparFormulario();
        listar();
    }
}

// R - READ: Listar Produtos
async function listar() {
    const grid = document.getElementById('grid-produtos');
    const status = document.getElementById('status-api');

    try {
        status.innerText = "⏳ Sincronizando com a nuvem...";
        const res = await fetch(URL_BASE);
        const produtos = await res.json();

        grid.innerHTML = "";
        produtos.forEach(p => {
            grid.innerHTML +=
                `<div class="card">
                    <h3>${p.nome}</h3>
                    <p><strong>Estoque:</strong> ${p.quantidade}</p>
                    <p><strong>Valor:</strong> R$ ${p.valor}</p>
                    <hr>
                    <button class="btn-excluir" onclick="excluir('${p.id}')">Excluir</button>
                    <button class="btn-alterar" onclick="prepararEdicao('${p.id}')">Alterar</button>
                </div>`;
        });
        status.innerText = "";
    } catch (err) {
        status.innerText = "❌ Erro ao carregar dados.";
    }
}

// C - CREATE / U - UPDATE: Salvar Produto
async function salvar() {
    const id = document.getElementById('produto-id').value;
    const dados = {
        nome: document.getElementById('nome').value,
        quantidade: Number(document.getElementById('quantidade').value),
        valor: Number(document.getElementById('valor').value)
    };

    try {
        if (!id) {
            // CREATE - POST
            await fetch(URL_BASE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
        } else {
            // UPDATE - PUT
            await fetch(URL_BASE + "/" + id, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
        }

        navegar('listar');

    } catch (err) {
        alert("⚠️ Erro na comunicação com o servidor.");
    }
}

// D - DELETE: Remover Produto
async function excluir(id) {
    if (confirm("Deseja apagar este produto?")) {
        await fetch(`${URL_BASE}/${id}`, { method: 'DELETE' });
        listar();
    }
}

// U - UPDATE: Preparar Edição (GET por ID)
async function prepararEdicao(id) {
    try {
        const res = await fetch(URL_BASE + "/" + id);
        const produto = await res.json();

        document.getElementById('produto-id').value = produto.id;
        document.getElementById('nome').value = produto.nome;
        document.getElementById('quantidade').value = produto.quantidade;
        document.getElementById('valor').value = produto.valor;

        document.getElementById('titulo-form').innerText = "✏️ Editando Produto";
        navegar('incluir');

    } catch (err) {
        alert("⚠️ Erro ao carregar os dados do produto.");
    }
}

// Limpar Formulário
function limparFormulario() {
    document.getElementById('produto-id').value = "";
    document.getElementById('nome').value = "";
    document.getElementById('quantidade').value = "";
    document.getElementById('valor').value = "";
    document.getElementById('titulo-form').innerText = "Cadastrar Novo Produto";
}

window.onload = () => navegar('listar');