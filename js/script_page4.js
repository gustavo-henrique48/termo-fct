$(document).ready(function () {

    /* ============================================
       CONTROLE DE LINHAS ATIVAS
    ============================================ */

    let linhaAtual = 1;

    function atualizarLinhas() {
        $(".jogo > div").each(function (i) {
            const linha = i + 1;

            const inputs = $(this).find("input");
            const ativa = (linha === linhaAtual);

            inputs.prop("disabled", !ativa)
                .attr("tabindex", ativa ? 0 : -1);

            $(this)
                .toggleClass("linha-ativa", ativa)
                .toggleClass("linha-bloqueada", !ativa);
        });
    }

    atualizarLinhas();



    /* ============================================
       TECLADO VIRTUAL
    ============================================ */

    // Função para simular digitação em um input
    function simularDigitacao(letra) {
        const linhaAtualElement = $(".jogo > div").eq(linhaAtual - 1);
        const inputs = linhaAtualElement.find("input");
        const inputVazio = inputs.filter(function () {
            return $(this).val() === "";
        }).first();

        if (inputVazio.length) {
            inputVazio.val(letra);
            inputVazio.addClass("zoomar");
            setTimeout(() => inputVazio.removeClass("zoomar"), 120);

            // Foca no próximo input vazio
            const proximoInput = inputVazio.next("input");
            if (proximoInput.length) {
                proximoInput.focus();
            }
        }
    }

    // Função para backspace
    function simularBackspace() {
        const linhaAtualElement = $(".jogo > div").eq(linhaAtual - 1);
        const inputs = linhaAtualElement.find("input");

        // Encontra o último input preenchido
        const inputsArray = inputs.get();
        let ultimoPreenchido = null;

        for (let i = inputsArray.length - 1; i >= 0; i--) {
            if ($(inputsArray[i]).val() !== "") {
                ultimoPreenchido = $(inputsArray[i]);
                break;
            }
        }

        if (ultimoPreenchido) {
            ultimoPreenchido.val("");
            ultimoPreenchido.focus();
        } else {
            // Se não há nenhum preenchido, foca no primeiro
            inputs.first().focus();
        }
    }

    // Função para enter
    function simularEnter() {
        const linhaAtualElement = $(".jogo > div").eq(linhaAtual - 1);
        const inputs = linhaAtualElement.find("input").get();

        // Verifica se a linha está completa
        if (!inputs.every(inp => inp.value !== "")) {
            alert("Preencha todas as letras antes de enviar!");
            return;
        }

        // Aqui você pode adicionar a lógica de verificação da palavra
        console.log("Palavra da linha " + linhaAtual + ":", inputs.map(inp => inp.value).join(""));

        // Avança para a próxima linha
        if (linhaAtual < 6) {
            linhaAtual++;
            atualizarLinhas();

            // Foca no primeiro input da nova linha
            $(".jogo > div").eq(linhaAtual - 1)
                .find("input").first().focus();
        } else {
            alert("Fim do jogo!");
            // Aqui você pode adicionar lógica para finalizar o jogo
        }
    }

    // Event listeners para o teclado virtual
    $(".tecla[data-key]").on("click", function () {
        const tecla = $(this).data("key");

        switch (tecla) {
            case "ENTER":
                simularEnter();
                break;
            case "BACKSPACE":
                simularBackspace();
                break;
            default:
                if (tecla.length === 1 && /^[A-Z]$/.test(tecla)) {
                    simularDigitacao(tecla);
                }
                break;
        }
    });

    // Adiciona efeito visual ao pressionar as teclas
    $(".tecla").on("mousedown touchstart", function () {
        $(this).css({
            "transform": "scale(0.95)",
            "background-color": "#3a3630"
        });
    });

    $(".tecla").on("mouseup mouseleave touchend", function () {
        $(this).css({
            "transform": "scale(1)",
            "background-color": "#534f48"
        });
    });



    /* ============================================
       FORMATAÇÃO DOS INPUTS FÍSICOS
    ============================================ */

    const inputs = $(".jogo input[type='text']");

    inputs.on('keydown', function (e) {
        const $this = $(this);
        const key = e.key.toUpperCase();

        /* -----------------------------
           NAVEGAÇÃO: SETAS
        ----------------------------- */
        if (e.key === "ArrowLeft") {
            e.preventDefault();
            const $ant = $this.prev("input");
            if ($ant.length) $ant.focus();
            return;
        }

        if (e.key === "ArrowRight") {
            e.preventDefault();
            const $prox = $this.next("input");
            if ($prox.length) $prox.focus();
            return;
        }

        /* -----------------------------
           LETRAS A–Z SOMENTE
        ----------------------------- */
        if (key.length === 1) {
            if (!/^[A-Z]$/.test(key)) {
                e.preventDefault();
                return;
            }

            e.preventDefault();
            $this.val(key);

            $this.addClass("zoomar");
            setTimeout(() => $this.removeClass("zoomar"), 120);

            const $prox = $this.next("input");
            if ($prox.length) $prox.focus();
            return;
        }

        /* -----------------------------
           BACKSPACE
        ----------------------------- */
        if (e.key === "Backspace") {
            e.preventDefault();

            if ($this.val() !== "") {
                $this.val("");
            } else {
                const $ant = $this.prev("input");
                if ($ant.length) $ant.val("").focus();
            }
            return;
        }

        /* -----------------------------
           ENTER — AVANÇA LINHA
        ----------------------------- */
        if (e.key === "Enter") {
            const linha = $this.closest("div");
            const inputsLinha = linha.find("input").get();

            if (!inputsLinha.every(inp => inp.value !== "")) {
                alert("Preencha todas as letras antes de enviar!");
                return;
            }

            // Aqui você pode adicionar a lógica de verificação da palavra
            console.log("Palavra da linha " + linhaAtual + ":", inputsLinha.map(inp => inp.value).join(""));

            if (linhaAtual < 6) {
                linhaAtual++;
                atualizarLinhas();
                $(".jogo > div").eq(linhaAtual - 1)
                    .find("input").first().focus();
            } else {
                alert("Fim do jogo!");
            }
            return;
        }

        /* -----------------------------
           BLOQUEIA HOME E END
        ----------------------------- */
        if (["Home", "End"].includes(e.key)) {
            e.preventDefault();
            return;
        }
    });



    /* ============================================
       COLAR — aceita só a primeira letra A–Z
    ============================================ */
    inputs.on('paste', function (e) {
        e.preventDefault();

        const texto = (e.originalEvent || e).clipboardData.getData("text");
        if (!texto) return;

        const letra = texto.trim().charAt(0).toUpperCase();

        if (/^[A-Z]$/.test(letra)) {
            $(this).val(letra);
            const $prox = $(this).next("input");
            if ($prox.length) $prox.focus();
        }
    });

});

