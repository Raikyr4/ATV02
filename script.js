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

    // Métodos para relatórios refatorados com Streams JS
    filtrarSalarioAlto() {
        this.funcionariosFiltrados = this.funcionarios
            .filter(f => f.salario > 5000)
            .sort((a, b) => b.salario - a.salario); // Ordena por salário decrescente
        
        this.atualizarTabela();
        
        const total = this.funcionariosFiltrados.length;
        const somaSalarios = this.funcionariosFiltrados
            .reduce((acc, f) => acc + f.salario, 0);
        const media = total > 0 ? somaSalarios / total : 0;
        
        this.exibirRelatorio(
            'Funcionários com Salário > R$5000', 
            total > 0 ? [
                `Total: ${total} funcionário(s)`,
                `Soma salarial: R$ ${somaSalarios.toFixed(2)}`,
                'Lista ordenada por salário (maior para menor):',
                ...this.funcionariosFiltrados.map(f => 
                    `${f.nome} - ${f.cargo} - R$ ${f.salario.toFixed(2)}`)
            ] : ['Nenhum funcionário com salário acima de R$5000']
        );
    }

    calcularMediaSalarial() {
        const [total, somaSalarios] = this.funcionarios
            .reduce(([count, sum], f) => [count + 1, sum + f.salario], [0, 0]);
        
        const media = total > 0 ? somaSalarios / total : 0;
        
        this.exibirRelatorio('Média Salarial', [
            `Total de funcionários: ${total}`,
            `Soma total salarial: R$ ${somaSalarios.toFixed(2)}`,
            `Média salarial: R$ ${media.toFixed(2)}`,
            'Distribuição por cargo:',
            ...Object.entries(
                this.funcionarios.reduce((acc, f) => {
                    acc[f.cargo] = (acc[f.cargo] || 0) + f.salario;
                    return acc;
                }, {})
            ).map(([cargo, soma]) => 
                `${cargo}: R$ ${soma.toFixed(2)}`)
        ]);
    }

    mostrarCargosUnicos() {
        const cargosUnicos = this.funcionarios
            .map(f => f.cargo)
            .filter((cargo, index, self) => self.indexOf(cargo) === index)
            .sort();
        
        this.exibirRelatorio(
            'Cargos Únicos', 
            cargosUnicos.length > 0 ? [
                `Total de cargos distintos: ${cargosUnicos.length}`,
                'Lista de cargos:',
                ...cargosUnicos.map((cargo, index) => `${index + 1}. ${cargo}`)
            ] : ['Nenhum cargo cadastrado']
        );
    }

    mostrarNomesMaiusculo() {
        const nomesInfo = this.funcionarios
            .map(f => ({
                nomeOriginal: f.nome,
                nomeMaiusculo: f.nome.toUpperCase(),
                cargo: f.cargo,
                salario: f.salario
            }))
            .sort((a, b) => a.nomeOriginal.localeCompare(b.nomeOriginal));
        
        this.exibirRelatorio(
            'Nomes em Maiúsculo', 
            nomesInfo.length > 0 ? [
                `Total de funcionários: ${nomesInfo.length}`,
                'Lista completa:',
                ...nomesInfo.map(f => 
                    `${f.nomeMaiusculo} (${f.nomeOriginal}) - ${f.cargo} - R$ ${f.salario.toFixed(2)}`)
            ] : ['Nenhum funcionário cadastrado']
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