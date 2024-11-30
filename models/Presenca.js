import { conexaoBanco } from '../db.js';

const Presenca = {
    async criarPresenca(dadosPresenca) {
        const { idChamada, idAluno, tipoChamada, statusPresenca, descricao } = dadosPresenca;

        // Query com placeholders ($1, $2, $3) para evitar SQL Injection
        const sql = `
            INSERT INTO CHAMADA_DIA (ID_CHAMADA, ID_ALUNO, TIPO_CHAMADA, STATUS_PRESENCA, DESCRICAO)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const sql2 = `SELECT ID_ALUNO FROM CHAMADA_DIA WHERE ID_ALUNO = $1`;

        try {
            const alunoExiste = await conexaoBanco.unsafe(sql2, [idAluno])

            if (alunoExiste.length > 0) {
                throw new Error('Aluno ja está na presença!')
            }
            const result = await conexaoBanco.unsafe(sql, [idChamada, idAluno, tipoChamada, statusPresenca, descricao]);
            return result[0]; // retorna a presenca inserida
        } catch (err) {
            console.error('Erro ao inserir presenca:', err);
            throw new Error('Erro ao inserir presenca');
        }
    },
    async deletarPresenca(idAluno) {
        const sql = `DELETE FROM CHAMADA_DIA WHERE ID_ALUNO = $1;`
        try {
            const result = await conexaoBanco.unsafe(sql, [idAluno]);
            return result[0];
        } catch (err) {
            console.error('Erro ao deletar presenca:', err);
            throw new Error('Erro ao deletar presenca');
        }
    },
    async buscarPresenca(chamada) {
        const sql = `SELECT * FROM CHAMADA_DIA WHERE ID_CHAMADA = $1 ORDER BY CRIADO_EM DESC`
        try {
            const result = await conexaoBanco.unsafe(sql, [chamada]);
            return result;
        } catch (err) {
            console.error('Erro ao buscar presenca:', err);
            throw new Error('Erro ao buscar presenca');
        }

    }
}

export { Presenca };
