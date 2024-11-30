import { conexaoBanco } from '../db.js';

//  ESSA TABELA É PARA CRIAR ENTRADA DA CHAMADA DO ALUNO
conexaoBanco`
CREATE TABLE CHAMADA_DIA (
    ID_CHAMADA_DIA SERIAL PRIMARY KEY,                   
    ID_CHAMADA INT NOT NULL,                   
    ID_ALUNO INT NOT NULL,                           
    TIPO_CHAMADA VARCHAR(20) CHECK (TIPO_CHAMADA IN ('vaievolta', 'sovai', 'sovolta')) NOT NULL, 
    STATUS_PRESENCA VARCHAR(20) CHECK (STATUS_PRESENCA IN ('presente', 'ausente')) NOT NULL,                      
    DESCRICAO TEXT,                                    
    CRIADO_EM TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   
    CONSTRAINT FK_ALUNO FOREIGN KEY (ID_ALUNO) REFERENCES ALUNO (ID_ALUNO), 
    CONSTRAINT FK_CHAMADA FOREIGN KEY (ID_CHAMADA) REFERENCES CHAMADA (ID_CHAMADA)
);

`
    .then(() => {
        console.log('Tabela criada com sucesso!');
    })
    .catch(err => {
        console.error('Erro ao criar a tabela:', err);
    });
