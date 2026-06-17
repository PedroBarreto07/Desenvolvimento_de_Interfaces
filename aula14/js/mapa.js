// Substitua pela sua URL real do MockAPI
const URL_MOCK = "https://6a1f6463b79eec0d6cf0b9d2.mockapi.io/locais";

// 1. Inicializa o mapa focado no Distrito Federal (Brasília)
const mapa = L.map('map').setView([-15.7941, -47.8825], 10);

// 2. Adiciona a camada de mapas do OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(mapa);

// ── TAREFA 1: Função que retorna o ícone colorido conforme o tipo ──
function obterIcone(tipo) {
  // Classe CSS que será aplicada à imagem do ícone padrão do Leaflet
  let classeIcone = 'icon-azul'; // padrão: Armazém

  if (tipo === 'Fábrica') {
    classeIcone = 'icon-vermelho';
  } else if (tipo === 'Loja') {
    classeIcone = 'icon-verde';
  }

  return L.divIcon({
    className: '',
    html: `<img src="https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png"
                class="${classeIcone}"
                style="width:25px; height:41px;">`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  });
}

// 3. Função para carregar os pontos do MockAPI
async function carregarPontos() {
  try {
    const resposta = await fetch(URL_MOCK);
    const locais = await resposta.json();

    locais.forEach(local => {
      // Usa o ícone colorido de acordo com o tipo
      const icone = obterIcone(local.tipo);
      const marcador = L.marker([local.lat, local.lng], { icon: icone }).addTo(mapa);

      // Popup com informações do local
      marcador.bindPopup(`
        <strong>${local.nome}</strong><br>
        Tipo: ${local.tipo}<br>
        <small>Coord: ${local.lat}, ${local.lng}</small>
      `);
    });
  } catch (erro) {
    console.error("Erro ao carregar dados geográficos:", erro);
  }
}

// ── TAREFA 2: Evento de clique no mapa — exibe coordenadas em alert ──
mapa.on('click', function(e) {
  const lat = e.latlng.lat.toFixed(4);
  const lng = e.latlng.lng.toFixed(4);
  alert(`📍 Nova Coordenada Detectada:\nLatitude: ${lat}\nLongitude: ${lng}`);
});

// Executa a função
carregarPontos();