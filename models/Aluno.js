import { conexaoBanco } from '../db.js';

const Aluno = {
    async cadastrarAluno(dadosAluno) {
        const { nome, email, senha } = dadosAluno;

        // Query com placeholders ($1, $2, $3) para evitar SQL Injection
        const sql = `
            INSERT INTO ALUNO (NOME, EMAIL, SENHA)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;

        try {
            // Usando template literal marcado corretamente
            const result = await conexaoBanco.unsafe(sql, [nome, email, senha]);
            return result[0]; // Retorna o aluno inserido
        } catch (err) {
            console.error('Erro ao inserir aluno:', err);
            throw new Error('Erro ao inserir aluno');
        }
    },
    async verificaAlunoPorEmail(email) {
        const sql = `SELECT * FROM ALUNO WHERE EMAIL = $1`;

        try {
            const result = await conexaoBanco.unsafe(sql, [email]);
            return result[0];
        } catch (err) {
            console.error('Erro ao buscar no banco!', err);
            throw new Error('Erro ao buscar no banco');
        }
    },
    async verificaAlunoPorId(id) {
        const sql = `SELECT * FROM ALUNO WHERE ID_ALUNO = $1`
        try {
            const result = await conexaoBanco.unsafe(sql, [id]);
            return result[0];
        } catch (err) {
            console.error('Erro ao buscar no banco!', err);
            throw new Error('Erro ao buscar no banco');
        }
    },
    async atualizarAluno(id, dadosAtualizados) {
        
        const { nome, email, numero_celular, tipo_usuario, status_conta } = dadosAtualizados;
    
        
        const campos = [];
        const valores = [];
        let contador = 1; // Placeholder contador $1, $2...
  
        if (nome) {
            campos.push(`NOME = $${contador}`);
            valores.push(nome);
            contador++;
        }
        if (email) {
            campos.push(`EMAIL = $${contador}`);
            valores.push(email);
            contador++;
        }
        if (numero_celular) {
            campos.push(`NUMERO_CELULAR = $${contador}`);
            valores.push(numero_celular);
            contador++;
        }
        if (tipo_usuario) {
            campos.push(`TIPO_USUARIO = $${contador}`);
            valores.push(tipo_usuario);
            contador++;
        }
        if (status_conta) {
            campos.push(`STATUS_CONTA = $${contador}`);
            valores.push(status_conta);
            contador++;
        }
    
        if (campos.length === 0) {
            throw new Error('Nenhum campo fornecido para atualização!');
        }
    
        
        valores.push(id);
    
        
        const sql = `
            UPDATE ALUNO
            SET ${campos.join(', ')}
            WHERE ID_ALUNO = $${contador}
            RETURNING *;
        `;
    
        try {
            const result = await conexaoBanco.unsafe(sql, valores);
            return result[0]; 
        } catch (err) {
            console.error('Erro ao atualizar aluno:', err);
            throw new Error('Erro ao atualizar aluno');
        }
    },
    async deletarAluno(id) {
        const sql2 = `SELECT ID_ALUNO FROM CHAMADA WHERE ID_ALUNO = $1`
        const sql = `DELETE FROM ALUNO WHERE ID_ALUNO = $1`
        try {
            const estaEmUmaChamadaResult = await conexaoBanco.unsafe(sql2, [id]);
            if (estaEmUmaChamadaResult.length > 0) {
                throw new Error('Aluno está em uma chamada, não pode ser deletado')
            }

            const result = await conexaoBanco.unsafe(sql, [id]);
            return result[0];
        } catch (err) {
            console.error('Erro ao deletar aluno:', err);
            throw new Error('Erro ao deletar aluno');
        }
    }

}

export { Aluno };
