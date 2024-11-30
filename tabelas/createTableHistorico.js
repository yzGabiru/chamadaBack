import { conexaoBanco } from '../db.js';

// Criação da tabela no banco de dados
conexaoBanco`
    DROP TABLE HISTORICO_CHAMADA

`
    .then(() => {
        console.log('Tabela criada com sucesso!');
    })
    .catch(err => {
        console.error('Erro ao criar a tabela:', err);
    });


    // CREATE TABLE HISTORICO_CHAMADA (
    //     ID_HISTORICO                        SERIAL PRIMARY KEY,                     
    //     ID_ALUNO                            INT NOT NULL,                    
    //     DATA_CHAMADA                        DATE NOT NULL,         
    //     TIPO_CHAMADA VARCHAR(20) CHECK (TIPO_CHAMADA IN ('vaievolta', 'sovai', 'sovolta')) NOT NULL,
    //     STATUS_PRESENCA VARCHAR(20) CHECK (STATUS_PRESENCA IN ('presente', 'ausente')) NOT NULL,
    //     HORARIO_PRESENCA                    TIME NULL,
    //     OBSERVACAO                          TEXT,
    //     CRIADO_EM                           TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    // );