document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector(".card");

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
