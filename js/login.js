function logar() {

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    const usuarios = JSON.parse(localStorage.getItem("users")) || {};

    // verificar email existente
    if (!usuarios[email]) {
        alert("Email não encontrado!");
        return;
    }

    // verificar senha
    if (usuarios[email].senha !== senha) {
        alert("Senha incorreta!");
        return;
    }

    // criar sessão
    localStorage.setItem("sessionUser", email);

    alert(`Bem-vindo(a), ${usuarios[email].nome}!`);

    // 🔥 REDIRECIONAR PARA O JOGO
    window.location.href = "../pages/jogo.html";
}
