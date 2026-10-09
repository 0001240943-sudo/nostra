// ==========================================================================
// ESTRUTURA ORIENTADA A OBJETOS (CLASSES) PARA PRODUTOS E CARRINHO
// ==========================================================================
class Produto {
    constructor(nome, preco) {
        this.nome = nome;
        this.preco = parseFloat(preco);
    }
}

class Carrinho {
    constructor() {
        this.itens = [];
    }

    adicionarItem(produto) {
        this.itens.push(produto);
        this.atualizarInterface();
    }

    calcularTotal() {
        return this.itens.reduce((total, item) => total + item.preco, 0);
    }

    atualizarInterface() {
        const container = document.getElementById("container-pedido");
        const btnFinalizar = document.getElementById("btn-finalizar");
        if (!container) return;

        if (this.itens.length === 0) {
            container.innerHTML = `<p>Seu pedido está vazio.</p>`;
            if (btnFinalizar) btnFinalizar.style.display = "none";
            return;
        }

        if (btnFinalizar) btnFinalizar.style.display = "inline-block";

        let htmlItens = `<ul style="list-style: none; padding: 0; margin-bottom: 1rem;">`;
        this.itens.forEach(item => {
            htmlItens += `<li style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; border-bottom: 1px dashed #444; padding-bottom: 0.3rem;">
                <span>🍕 ${item.nome}</span>
                <strong>R$ ${item.preco.toFixed(2).replace('.', ',')}</strong>
            </li>`;
        });
        htmlItens += `</ul>`;

        const totalGeral = this.calcularTotal().toFixed(2).replace('.', ',');
        container.innerHTML = `
            ${htmlItens}
            <div style="display: flex; justify-content: space-between; font-size: 1.2rem; margin-top: 1rem; font-weight: bold; border-top: 2px solid #e74c3c; padding-top: 0.5rem;">
                <span>Total:</span>
                <span style="color: #f1c40f;">R$ ${totalGeral}</span>
            </div>
        `;
    }

    finalizarPedido() {
        if (this.itens.length === 0) {
            alert("Seu carrinho está vazio!");
            return;
        }

        const cadastroRaw = localStorage.getItem("cadastroUsuario");
        let clienteNome = localStorage.getItem("usuarioAtual") || "Cliente";
        let clienteEndereco = "Endereço não cadastrado";

        if (cadastroRaw) {
            try {
                const dados = JSON.parse(cadastroRaw);
                clienteEndereco = dados.endereco || clienteEndereco;
            } catch (e) {
                console.error("Erro ao ler dados de endereço", e);
            }
        }

        let textoTXT = `========================================\n`;
        textoTXT += `        NOSTRA PIZZA - COMPROVANTE      \n`;
        textoTXT += `========================================\n\n`;
        textoTXT += `Cliente: ${clienteNome}\n`;
        textoTXT += `Endereço de Entrega: ${clienteEndereco}\n`;
        textoTXT += `Data/Hora: ${new Date().toLocaleString("pt-BR")}\n\n`;
        textoTXT += `----------------------------------------\n`;
        textoTXT += `ITENS DO PEDIDO:\n`;
        
        this.itens.forEach((item, index) => {
            textoTXT += `${index + 1}. 🍕 ${item.nome} - R$ ${item.preco.toFixed(2).replace('.', ',')}\n`;
        });

        textoTXT += `----------------------------------------\n`;
        textoTXT += `TOTAL DO PEDIDO: R$ ${this.calcularTotal().toFixed(2).replace('.', ',')}\n\n`;
        textoTXT += `========================================\n`;
        textoTXT += `Obrigado pela preferência! Buon appetito!\n`;

        const blob = new Blob([textoTXT], { type: "text/plain;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Pedido_NostraPizza_${clienteNome.replace(/\s+/g, '_')}.txt`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert("Compra concluída com sucesso! O resumo do seu pedido (.txt) foi baixado.");
        
        this.itens = [];
        this.atualizarInterface();
    }
}

// Escopo Global: Deixamos o objeto visível para o onclick do HTML
window.meuCarrinho = new Carrinho();

document.addEventListener("DOMContentLoaded", function () {

    const $ = id => document.getElementById(id);

    // ==========================================
    // ÁREA DO CLIENTE - ATUALIZAÇÃO DO NOME
    // ==========================================
    const nomeOriginalDoAmbiente = localStorage.getItem("usuarioAtual");
    const campoNomeOriginalDoAmbiente = $("nome-usuario");
    if (nomeOriginalDoAmbiente && campoNomeOriginalDoAmbiente) {
        campoNomeOriginalDoAmbiente.textContent = nomeOriginalDoAmbiente;
    }

        // ==========================================
    // CAPTURA DOS BOTÕES "ADICIONAR" USANDO AS CLASSES
    // ==========================================
    const botoesAdicionar = document.querySelectorAll("button[data-nome]");
    botoesAdicionar.forEach(botao => {
        botao.addEventListener("click", function () {
            const nomeItem = this.getAttribute("data-nome");
            const precoItem = this.getAttribute("data-preco");
            
            const novoProduto = new Produto(nomeItem, precoItem);
            window.meuCarrinho.adicionarItem(novoProduto);

            // ADICIONADO: Mensagem de confirmação ao adicionar o item
            alert(`🍕 ${nomeItem} foi adicionada ao seu pedido com sucesso!`);
        });
    });

    // MENUS LATERAIS: usados tanto em login.html quanto em cadastro.html
    const contato = $("menuContato");
    const subContato = $("sub-contato");
    const sobre = $("menuSobre");
    const subSobre = $("sub-sobre");

    function configurarMenu(link, painel, outroPainel) {
        if (!link || !painel) return;
        link.addEventListener("click", function (evento) {
            evento.preventDefault();
            evento.stopPropagation();
            if (outroPainel) outroPainel.classList.remove("active");
            painel.classList.toggle("active");
        });
    }

    configurarMenu(contato, subContato, subSobre);
    configurarMenu(sobre, subSobre, subContato);

    document.addEventListener("click", function (evento) {
        if (subContato && !subContato.contains(evento.target) && evento.target !== contato) {
            subContato.classList.remove("active");
        }
        if (subSobre && !subSobre.contains(evento.target) && evento.target !== sobre) {
            subSobre.classList.remove("active");
        }
    });

    // =========================
    // SUBMENUS
    // =========================
    [
        ["btn-telefone", "conteudo-telefone"],
        ["btn-email", "conteudo-email"],
        ["btn-empresa", "conteudo-empresa"],
        ["btn-clientes", "conteudo-clientes"]
    ].forEach(function ([botao, conteudo]) {
        const btn = $(botao);
        const area = $(conteudo);
        if (btn && area) {
            btn.addEventListener("click", function (e) {
                e.stopPropagation();
                area.classList.toggle("ativo");
            });
        }
    });

    // =========================
    // CADASTRO
    // =========================
    const nome = $("nome");
    const email = $("email");
    const senha = $("senha");
    const cpf = $("cpf");
    const endereco = $("endereco");

    if (nome && email && senha && cpf && endereco) {
        const formulario = $("meuFormulario");
        formulario.addEventListener("submit", function (e) {
            e.preventDefault();

            const dadosUsuario = {
                nome: nome.value.trim(),
                email: email.value.trim(),
                senha: senha.value,
                cpf: cpf.value.trim(),
                endereco: endereco.value.trim()
            };

            // Mantém o cadastro em JSON no navegador, como já era feito.
            localStorage.setItem("cadastroUsuario", JSON.stringify(dadosUsuario));

            if (localStorage.getItem("cadastroUsuario")) {
                // Acrescenta o download em TXT sem alterar o funcionamento do login.
                const conteudoTXT = [
                    "NOSTRA PIZZARIA - CADASTRO",
                    "--------------------------",
                    `Nome: ${dadosUsuario.nome}`,
                    `E-mail: ${dadosUsuario.email}`,
                    `CPF: ${dadosUsuario.cpf}`,
                    `Endereço: ${dadosUsuario.endereco}`,
                    `Data do cadastro: ${new Date().toLocaleString("pt-BR")}`
                ].join("\\n");

                const arquivoTXT = new Blob(["\\uFEFF", conteudoTXT], {
                    type: "text/plain;charset=utf-8"
                });
                const urlTXT = URL.createObjectURL(arquivoTXT);
                const linkTXT = document.createElement("a");
                linkTXT.href = urlTXT;
                linkTXT.download = "Cadastro_NostraPizza.txt";
                document.body.appendChild(linkTXT);
                linkTXT.click();
                linkTXT.remove();
                setTimeout(() => URL.revokeObjectURL(urlTXT), 1000);

                alert("Cadastro salvo em JSON e arquivo TXT baixado. Você será direcionado para a página de login.");
                formulario.reset();
                window.location.href = "login.html";
            } else {
                alert("Erro ao salvar o cadastro.");
            }
        });
    }

    // =========================
    // LOGIN
    // =========================
    const usuario = $("username");
    const senhaLogin = $("password");

    if (usuario && senhaLogin) {
        const formulario = $("meuFormulario");
        const mensagem = $("mensagem-login");

        formulario.addEventListener("submit", function (e) {
            e.preventDefault();

            const cadastro = localStorage.getItem("cadastroUsuario");
            if (!cadastro) {
                mostrarMensagem(mensagem, "Nenhum cadastro encontrado. Cadastre-se primeiro.", "#ce2b37");
                return;
            }

            let dados;
            try {
                dados = JSON.parse(cadastro);
            } catch (erro) {
                mostrarMensagem(mensagem, "Erro ao ler os dados do cadastro.", "#ce2b37");
                return;
            }

            if (usuario.value.trim() === dados.nome && senhaLogin.value === dados.senha) {
                mostrarMensagem(mensagem, "✓ Login realizado com sucesso!", "#2b704a");
                localStorage.setItem("usuarioLogado", "true");
                localStorage.setItem("usuarioAtual", dados.nome);

                setTimeout(function () {
                    window.location.href = "ambiente.html";
                }, 800);
            } else {
                mostrarMensagem(mensagem, "✕ Nome ou senha incorretos.", "#ce2b37");
            }
        });
    }

    // =========================
    // DATA DO RODAPÉ
    // =========================
    const data = $("data-atual");
    if (data) {
        data.textContent = new Date().toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
    }
});

// =========================
// MENSAGEM DO LOGIN
// =========================
function mostrarMensagem(elemento, texto, cor) {
    if (elemento) {
elemento.textContent = texto;
elemento.style.color = cor;
} else {
alert(texto);
}
}
// Escopo Global: Deixamos o método sair acessível ao clique
window.sair = function() {
localStorage.removeItem("usuarioLogado");
localStorage.removeItem("usuarioAtual");
window.location.href = "login.html";
}
   
        // ==========================================
    // CLIQUE PARA DISPARAR EFEITO DE EXPLOSÃO COM FRASE ITALIANA
    // ==========================================
    const aviao = document.querySelector(".aviao-promocao");
    if (aviao) {
        aviao.addEventListener("click", function () {
            // 1. Altera o texto para a palavra italiana na hora
            this.innerHTML = "💥 ARRIVEDERCI! 💥";
            
            // 2. Aplica a classe que cancela o voo e explode visualmente
            this.classList.add("explodiu");
        });
    }
