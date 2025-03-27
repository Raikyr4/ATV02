class Funcionario {
    constructor(nome, idade, cargo, salario, id = null) {
        this._nome = nome;
        this._idade = idade;
        this._cargo = cargo;
        this._salario = salario;
        this._id = id || Date.now().toString();
    }

    // Getters e Setters
    get id() {
        return this._id;
    }

    get nome() {
        return this._nome;
    }

    set nome(novoNome) {
        this._nome = novoNome;
    }

    get idade() {
        return this._idade;
    }

    set idade(novaIdade) {
        this._idade = novaIdade;
    }

    get cargo() {
        return this._cargo;
    }

    set cargo(novoCargo) {
        this._cargo = novoCargo;
    }

    get salario() {
        return this._salario;
    }

    set salario(novoSalario) {
        this._salario = novoSalario;
    }

    toString() {
        return `Nome: ${this.nome}, Idade: ${this.idade}, Cargo: ${this.cargo}, Salário: R$${this.salario.toFixed(2)}`;
    }
}

class GerenciadorFuncionarios {
    constructor() {
        // Referências aos elementos HTML
        this.form = document.getElementById('funcionarioForm');
        this.nomeInput = document.getElementById('nome');
        this.idadeInput = document.getElementById('idade');
        this.cargoInput = document.getElementById('cargo');
        this.salarioInput = document.getElementById('salario');
        this.funcionarioIdInput = document.getElementById('funcionarioId');
        this.salvarBtn = document.getElementById('salvarBtn');
        this.tableBody = document.getElementById('funcionariosTableBody');
        this.reportResult = document.getElementById('reportResult');
        
        this.funcionarios = [];
        this.funcionariosFiltrados = [];
        this.editando = false;
        this.funcionarioEditandoId = null;

        this.inicializarEventos();
        this.carregarDados();
    }

    inicializarEventos() {
        // Evento de submit do formulário
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.salvarFuncionario();
        });

        // Evento do botão cancelar
        document.getElementById('cancelarBtn').addEventListener('click', () => {
            this.cancelarEdicao();
        });

        // Eventos dos botões de relatório
        document.getElementById('salarioAltoBtn').addEventListener('click', () => {
            this.filtrarSalarioAlto();
        });

        document.getElementById('mediaSalarialBtn').addEventListener('click', () => {
            this.calcularMediaSalarial();
        });

        document.getElementById('cargosUnicosBtn').addEventListener('click', () => {
            this.mostrarCargosUnicos();
        });

        document.getElementById('nomesMaiusculoBtn').addEventListener('click', () => {
            this.mostrarNomesMaiusculo();
        });

        document.getElementById('mostrarTodosBtn').addEventListener('click', () => {
            this.mostrarTodosFuncionarios();
        });
    }

    salvarFuncionario() {
        const nome = this.nomeInput.value.trim();
        const idade = parseInt(this.idadeInput.value);
        const cargo = this.cargoInput.value.trim();
        const salario = parseFloat(this.salarioInput.value);
        const funcionarioId = this.funcionarioIdInput.value;

        // Validação básica
        if (!nome || !idade || !cargo || isNaN(salario)) {
            alert('Por favor, preencha todos os campos corretamente!');
            return;
        }

        if (this.editando && funcionarioId) {
            // Atualizar funcionário existente
            const funcionario = this.funcionarios.find(f => f.id === funcionarioId);
            if (funcionario) {
                funcionario.nome = nome;
                funcionario.idade = idade;
                funcionario.cargo = cargo;
                funcionario.salario = salario;
                this.salvarBtn.textContent = 'Cadastrar';

                alert('Funcionário atualizado com sucesso!');
            }
        } else {
            // Adicionar novo funcionário
            const novoFuncionario = new Funcionario(nome, idade, cargo, salario);
            this.funcionarios.push(novoFuncionario);
            alert('Funcionário cadastrado com sucesso!');
        }

        this.salvarDados();
        this.mostrarTodosFuncionarios();
        this.limparFormulario();
    }

    editarFuncionario(id) {
        const funcionario = this.funcionarios.find(f => f.id === id);
        if (funcionario) {
            this.nomeInput.value = funcionario.nome;
            this.idadeInput.value = funcionario.idade;
            this.cargoInput.value = funcionario.cargo;
            this.salarioInput.value = funcionario.salario;
            this.funcionarioIdInput.value = funcionario.id;
            
            this.salvarBtn.textContent = 'Atualizar';
            this.editando = true;
            this.funcionarioEditandoId = id;
            
            // Rolar para o topo do formulário
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Dar foco no primeiro campo
            this.nomeInput.focus();
        }
    }

    excluirFuncionario(id) {
        if (confirm('Tem certeza que deseja excluir este funcionário?')) {
            this.funcionarios = this.funcionarios.filter(f => f.id !== id);
            this.salvarDados();
            this.mostrarTodosFuncionarios();
            alert('Funcionário excluído com sucesso!');
        }
    }

    cancelarEdicao() {
        this.limparFormulario();
        this.editando = false;
        this.funcionarioEditandoId = null;
        this.salvarBtn.textContent = 'Cadastrar';
    }

    limparFormulario() {
        this.form.reset();
        this.funcionarioIdInput.value = '';
    }

    mostrarTodosFuncionarios() {
        this.funcionariosFiltrados = [...this.funcionarios];
        this.atualizarTabela();
        this.reportResult.innerHTML = '<h4>Todos os Funcionários na Tabela Acima</h4>';
    }

    atualizarTabela() {
        this.tableBody.innerHTML = '';
        
        if (this.funcionariosFiltrados.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="5" style="text-align: center;">Nenhum funcionário cadastrado</td>';
            this.tableBody.appendChild(row);
            return;
        }
        
        this.funcionariosFiltrados.forEach(funcionario => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${funcionario.nome}</td>
                <td>${funcionario.idade}</td>
                <td>${funcionario.cargo}</td>
                <td class="${funcionario.salario > 5000 ? 'salario-alto' : ''}">
                    R$ ${funcionario.salario.toFixed(2)}
                </td>
                <td>
                    <button class="action-btn editar-btn" data-id="${funcionario.id}">Editar</button>
                    <button class="action-btn excluir-btn" data-id="${funcionario.id}">Excluir</button>
                </td>
            `;
            
            this.tableBody.appendChild(row);
        });

        // Adicionar eventos aos botões de editar e excluir (usando arrow functions)
        document.querySelectorAll('.editar-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.editarFuncionario(e.target.getAttribute('data-id'));
            });
        });

        document.querySelectorAll('.excluir-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.excluirFuncionario(e.target.getAttribute('data-id'));
            });
        });
    }

    // Métodos para relatórios (usando métodos de array)
    filtrarSalarioAlto() {
        this.funcionariosFiltrados = this.funcionarios.filter(f => f.salario > 5000);
        this.atualizarTabela();
        this.exibirRelatorio(
            'Funcionários com Salário > R$5000', 
            this.funcionariosFiltrados.length > 0 ? 
                [`Total: ${this.funcionariosFiltrados.length} funcionário(s)`] : 
                ['Nenhum funcionário com salário acima de R$5000']
        );
    }

    calcularMediaSalarial() {
        if (this.funcionarios.length === 0) {
            this.exibirRelatorio('Média Salarial', ['Nenhum funcionário cadastrado']);
            return;
        }
        
        const total = this.funcionarios.reduce((sum, func) => sum + func.salario, 0);
        const media = total / this.funcionarios.length;
        this.exibirRelatorio('Média Salarial', [`Média salarial: R$ ${media.toFixed(2)}`]);
    }

    mostrarCargosUnicos() {
        const cargosUnicos = [...new Set(this.funcionarios.map(f => f.cargo))];
        this.exibirRelatorio(
            'Cargos Únicos', 
            cargosUnicos.length > 0 ? 
                cargosUnicos.map(cargo => cargo) : 
                ['Nenhum cargo cadastrado']
        );
    }

    mostrarNomesMaiusculo() {
        const nomesMaiusculo = this.funcionarios.map(f => f.nome.toUpperCase());
        this.exibirRelatorio(
            'Nomes em Maiúsculo', 
            nomesMaiusculo.length > 0 ? 
                nomesMaiusculo : 
                ['Nenhum funcionário cadastrado']
        );
    }

    exibirRelatorio(titulo, itens) {
        this.reportResult.innerHTML = `
            <h4>${titulo}</h4>
            ${itens.map(item => `<div class="report-item">${item}</div>`).join('')}
        `;
    }

    // Armazenamento local
    salvarDados() {
        localStorage.setItem('techstartupFuncionarios', JSON.stringify(this.funcionarios));
    }

    carregarDados() {
        const dados = localStorage.getItem('techstartupFuncionarios');
        if (dados) {
            const funcionariosData = JSON.parse(dados);
            this.funcionarios = funcionariosData.map(func => 
                new Funcionario(func._nome, func._idade, func._cargo, func._salario, func._id));
            this.mostrarTodosFuncionarios();
        }
    }
}

// Inicializar o gerenciador quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new GerenciadorFuncionarios();
});