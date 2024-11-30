import { conexaoBanco } from '../db.js';

const Chamada = {
    async criarChamada(dadosChamada) {
        const { idAluno, dataChamada, descricao } = dadosChamada;

        // Query com placeholders ($1, $2, $3) para evitar SQL Injection
        const sql = `
            INSERT INTO CHAMADA (ID_ALUNO, DATA_CHAMADA, DESCRICAO)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;

        try {
            // Usando template literal marcado corretamente
            const result = await conexaoBanco.unsafe(sql, [idAluno, dataChamada, descricao]);
            return result[0]; // Retorna chamada inserida
        } catch (err) {
            console.error('Erro ao inserir chamada:', err);
            throw new Error('Erro ao inserir chamada');
        }
    },
    async buscarChamadas(){
        const sql = `
        SELECT * FROM CHAMADA
        ORDER BY DATA_CHAMADA DESC;
        `
        try {
            const result = await conexaoBanco.unsafe(sql);
            return result; // Retorna as chamadas
        } catch (err) {
            console.error('Erro ao buscar as chamadas:', err);
            throw new Error('Erro ao buscar as chamadas!');
        }
    }
}

export { Chamada };
