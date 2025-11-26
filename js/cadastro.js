document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector(".card");

    // Lista de cidades brasileiras populares para autocomplete
    const cidadesBrasileiras = [
        "São Paulo", "Rio de Janeiro", "Belo Horizonte", "Brasília", "Salvador",
        "Fortaleza", "Recife", "Porto Alegre", "Curitiba", "Goiânia",
        "Belém", "Manaus", "Vitória", "Florianópolis", "Natal",
        "Maceió", "João Pessoa", "Teresina", "Campo Grande", "Cuiabá",
        "São Luís", "Aracaju", "Palmas", "Porto Velho", "Rio Branco",
        "Macapá", "Boa Vista", "Santos", "Campinas", "São José dos Campos",
        "Ribeirão Preto", "Uberlândia", "Sorocaba", "Niterói", "Duque de Caxias",
        "São Bernardo do Campo", "Osasco", "Santo André", "São José do Rio Preto",
        "Jundiaí", "Americana", "Araraquara", "São Carlos", "Piracicaba",
        "Bauru", "Itu", "Indaiatuba", "Hortolândia", "Vinhedo"
    ];

    // Configurar autocomplete para cidade
    function configurarAutocomplete() {
        const cidadeInput = document.getElementById("cidade");
        const datalist = document.getElementById("cidades-list");

        cidadeInput.addEventListener("input", function () {
            const valor = this.value.toLowerCase();

            // Limpar opções anteriores
            datalist.innerHTML = '';

            if (valor.length > 1) {
                // Filtrar cidades que começam com o texto digitado
                const cidadesFiltradas = cidadesBrasileiras.filter(cidade =>
                    cidade.toLowerCase().startsWith(valor)
                );

                // Adicionar opções ao datalist
                cidadesFiltradas.forEach(cidade => {
                    const option = document.createElement('option');
                    option.value = cidade;
                    datalist.appendChild(option);
                });
            }
        });
    }

    // Configurar mapa inicial
    function inicializarMapa() {
        const iframe = document.querySelector(".map-box iframe");
        // Usar uma localização padrão sem necessidade de API key
        iframe.src = "https://www.openstreetmap.org/export/embed.html?layer=mapnik&marker=-23.5505,-46.6333";
    }

    inicializarMapa();
    configurarAutocomplete(); // Inicializar o autocomplete

    // Atualizar mapa baseado na cidade e estado
    function atualizarMapa(cidade, estado) {
        const iframe = document.querySelector(".map-box iframe");
        const query = `${cidade},${estado},Brasil`;
        iframe.src = `https://www.openstreetmap.org/export/embed.html?layer=mapnik&marker=${encodeURIComponent(query)}`;
    }

    // Ouvir mudanças na cidade e estado para atualizar o mapa
    document.getElementById("cidade").addEventListener("change", function () {
        const cidade = this.value.trim();
        const estado = document.getElementById("estado").value;
        if (cidade && estado) {
            atualizarMapa(cidade, estado);
        }
    });

    document.getElementById("estado").addEventListener("change", function () {
        const estado = this.value;
        const cidade = document.getElementById("cidade").value.trim();
        if (cidade && estado) {
            atualizarMapa(cidade, estado);
        }
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const nome = document.getElementById("name").value.trim();
        const sobrenome = document.getElementById("last_name").value.trim();
        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value;
        const repetirSenha = document.getElementById("senha2").value;
        const genero = document.querySelector("input[name='genero']:checked")?.value || "";
        const estado = document.getElementById("estado").value;
        const cidade = document.getElementById("cidade").value.trim();

        // =============================
        // VALIDAR CAMPOS
        // =============================

        if (!nome || !sobrenome || !email || !senha || !repetirSenha || !genero || estado === "" || !cidade) {
            alert("Preencha todos os campos!");
            return;
        }

        // email válido
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Digite um email válido!");
            return;
        }

        // validar senhas iguais
        if (senha !== repetirSenha) {
            alert("As senhas não coincidem!");
            return;
        }

        // =============================
        // SALVAR NO LOCALSTORAGE
        // =============================

        let usuarios = JSON.parse(localStorage.getItem("users")) || {};

        if (usuarios[email]) {
            alert("Este email já está cadastrado!");
            return;
        }

        usuarios[email] = {
            nome,
            sobrenome,
            email,
            senha,
            genero,
            estado,
            cidade
        };

        localStorage.setItem("users", JSON.stringify(usuarios));

        alert("Cadastro realizado com sucesso!");

        // redirecionar para login
        window.location.href = "../pages/login.html";
    });

});