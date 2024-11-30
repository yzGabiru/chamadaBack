import { conexaoBanco } from '../db.js';

//  ESSA TABELA É PARA CRIAR A CHAMADA
conexaoBanco`
CREATE TABLE CHAMADA (
    ID_CHAMADA                     SERIAL PRIMARY KEY,
    ID_ALUNO                       INT NOT NULL,     
    DATA_CHAMADA                   DATE NOT NULL,                          
    DESCRICAO                      TEXT,                                 
    CRIADO_EM                      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_ALUNO FOREIGN KEY (ID_ALUNO) REFERENCES ALUNO (ID_ALUNO)
);
`
    .then(() => {
        console.log('Tabela criada com sucesso!');
    })
    .catch(err => {
        console.error('Erro ao criar a tabela:', err);
    });
