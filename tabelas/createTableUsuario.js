import { conexaoBanco } from '../db.js';

// Criação da tabela no banco de dados
conexaoBanco`
    CREATE TABLE ALUNO (
        ID_ALUNO            SERIAL PRIMARY KEY,   
        NOME                VARCHAR NOT NULL,   
        EMAIL               VARCHAR NOT NULL,  
        SENHA               VARCHAR NOT NULL,
        NUMERO_CELULAR      VARCHAR,
        TIPO_USUARIO        VARCHAR DEFAULT 'aluno',
        STATUS_CONTA        VARCHAR(20) DEFAULT 'ativo',
        DATA_CRIACAO        TIMESTAMP DEFAULT NOW()
    );
`
    .then(() => {
        console.log('Tabela criada com sucesso!');
    })
    .catch(err => {
        console.error('Erro ao criar a tabela:', err);
    });
