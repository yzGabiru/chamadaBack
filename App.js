
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { Aluno } from './models/Aluno.js';
import { Chamada } from './models/Chamada.js';
import { Presenca } from './models/Presenca.js';

const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());

// Rota pública
router.get('/', (req, res) => {
  res.status(200).json({ msg: "API Funcionando!" });
});

/*------------------------------------------FUNCOES GERAIS---------------------------------------------------------------------------*/

//função para verificar se o aluno tem o token de permissao para acessar o dado
function verificarToken(req, res, next) {
  const cabecalho = req.headers['authorization'];
  const token = cabecalho && cabecalho.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Acesso Negado!" });
  }

  try {
    const segredo = process.env.SECRET;
    const tokenBruto = jwt.verify(token, segredo); // Verifica o token

    req.alunoId = tokenBruto.id; // Aqui vai o id_aluno do token

    next();
  } catch (error) {
    console.log('Erro ao verificar token:', error);
    return res.status(400).json({ msg: "Token Inválido" });
  }
}

/*------------------------------------------ROTAS USUARIOS---------------------------------------------------------------------------*/
//rota do aluno logado
router.get('/aluno/:id', verificarToken, async (req, res) => {
  const id = req.params.id;
  const idToken = req.alunoId;

  //verifica se o aluno esta acessando os proprios dados
  if (id != idToken) {
    return res.status(403).json({ msg: "Você não tem permissão de acessar dados de outro aluno!" })
  }

  //verifica se o aluno existe
  const alunoExiste = await Aluno.verificaAlunoPorId(id, '-senha') //retorna o id excluindo a senha

  if (!alunoExiste) {
    return res.status(404).json({ msg: "Usuário nao encontrado" })
  }
  res.status(200).json({ alunoExiste })

});


// Rota para criar um aluno
router.post('/aluno/registro', async (req, res) => {
  const { nome, email, senha, confirmarSenha } = req.body;

  if (!nome) {
    return res.status(422).json({ msg: "O nome é obrigatório!" }); //422 - dados faltando
  }
  if (!email) {
    return res.status(422).json({ msg: "O email é obrigatório!" });
  }
  if (!senha) {
    return res.status(422).json({ msg: "A senha é obrigatória!" });
  }
  if (senha !== confirmarSenha) {
    return res.status(422).json({ msg: "As senhas não conferem!" });
  }

  const usuarioExiste = await Aluno.verificaAlunoPorEmail(email);

  if (usuarioExiste) {
    return res.status(409).json({ msg: "O email já está em uso!" });
  }

  const dificuldade = await bcrypt.genSalt(12);
  const senhaEncryptada = await bcrypt.hash(senha, dificuldade);

  try {
    const novoAluno = await Aluno.cadastrarAluno({
      nome,
      email,
      senha: senhaEncryptada
    });
    res.status(201).json({ msg: "Aluno criado com sucesso!", aluno: novoAluno });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Ocorreu um erro no servidor!" });
  }
});

//rota para logar um aluno
router.post('/aluno/login', async (req, res) => {
  const { email, senha } = req.body;

  //validações
  if (!email) {
    return res.status(422).json({ msg: "O email é obrigatório!" });
  }
  if (!senha) {
    return res.status(422).json({ msg: "A senha é obrigatória!" });
  }

  const usuarioExiste = await Aluno.verificaAlunoPorEmail(email);

  if (!usuarioExiste) {
    return res.status(404).json({ msg: "Aluno não encontrado!" });
  }

  // Verificar se a senha bate
  const verificarSenha = await bcrypt.compare(senha, usuarioExiste.senha);

  if (!verificarSenha) {
    return res.status(422).json({ msg: "Senha Inválida!" });
  }

  try {
    const segredo = process.env.SECRET;
    const token = jwt.sign(
      {
        id: usuarioExiste.id_aluno,  // Use o id_aluno como chave do payload
      },
      segredo,
    );

    res.status(200).json({ msg: "Usuário autenticado com sucesso!", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Ocorreu um erro no servidor!" });
  }
});

//rota para deletar um aluno
router.delete('/aluno/deletar/:id', verificarToken, async (req, res) => {
  const id = req.body.id;
  const idAluno = req.params.id;

  if (idAluno != id) {
    return res.status(422).json({ msg: "Você não tem permissão para deletar um aluno diferente!" });
  }
  try {
    const aluno = await Aluno.deletarAluno(id);
    res.status(200).json({ msg: "Aluno deletado com sucesso!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Ocorreu um erro no servidor!" });
  }
})

//rota para atualizar um aluno
router.put('/aluno/atualizar/:id', verificarToken, async (req, res) => {
  const id = req.body.id;
  const idAluno = req.params.id;

  if (id != idAluno) {
    return res.status(422).json({ msg: "Você não tem permissão para atualizar um aluno diferente!" });
  }
  const dadosParaAtualizar = req.body;
  try {
    const aluno = await Aluno.atualizarAluno(id, dadosParaAtualizar);
    res.status(200).json({ msg: "Aluno atualizado com sucesso!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Ocorreu um erro no servidor!" });
  }
});

//rota especifica para atualizar senha


//rota pesquisar usuarios (consultar o material do auth pra usar o search)

/*------------------------------------------ROTAS CHAMADAS---------------------------------------------------------------------------*/
//rota para nova chamada
router.post('/chamada/criar', verificarToken, async (req, res) => {
  const { descricao } = req.body;

  const idAluno = req.alunoId;
  const dataChamada = new Date();

  try {
    const novaChamada = await Chamada.criarChamada({
      idAluno,
      dataChamada,
      descricao
    });
    res.status(201).json({ msg: "Chamada criada com sucesso!" })
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "Ocorreu um erro ao criar a chamada!" });
  }
});

//buscar chamadas
router.get('/chamada/buscar', async (req, res) => {

  //no front vai mostrar "Chamada Dia ..."

  try {
    const chamadas = await Chamada.buscarChamadas();
    console.log(chamadas)

    if (!chamadas) {
      return res.status(404).json({ msg: "Nenhuma chamada encontrada!" })
    }
    return res.status(200).json({ chamadas })
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Ocorreu um erro ao buscar as chamadas!" });
  }
});



//deletar chamada(tem que deletar todas as presenças dela?)

/*------------------------------------------ROTAS PRESENCA---------------------------------------------------------------------------*/
//rota para nova presenca
router.post('/presenca/criar', async (req, res) => {
  const { idChamada, idAluno, tipoChamada, descricao } = req.body;

  //INICIALMENTE O STATUSORESENCA VAI ESTAR FALTOU AI QUANDO ELKE LER O QR CODE DO ONIBUS FICA PRESENTE
  //O ALUNO SO PODE REGISTAR A PROPRIA PRESENCA
  try {
    const novaPresenca = await Presenca.criarPresenca({
      idChamada, //vai ser pego automatico
      idAluno, //vai ser pego automatico
      tipoChamada, //pego do usuario
      statusPresenca: 'ausente', //vai ser mudado para 'presente' quando o aluno ler o qr code!
      descricao //pego do usuario
    });
    res.status(201).json({ msg: "Presenca criada com sucesso!" })
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "Ocorreu um erro ao criar a presenca!" });
  }

});

//banco ter uma coluna de aluno_ativo, pra dizer se ta ativo naquela chamada ou nao (ver depois)

//deletar presenca
router.delete('/presenca/deletar', async (req, res) => {
  const id = req.body.idAluno;
  try {
    await Presenca.deletarPresenca(id);
    res.status(200).json({ msg: "Presenca deletada com sucesso!" })
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "Ocorreu um erro ao deletar a presença!" });
  }
});

//busca as presenças por chamada
router.get('/presenca/buscar', async (req, res) => {
  //retornar todas as presenças
  const idChamada = req.body.idChamada;

  try {
    const alunos = await Presenca.buscarPresenca(idChamada);
    res.status(200).json(alunos);
  } catch (err) {
    console.log(error);
    res.status(500).json({ msg: "Ocorreu um erro ao buscar as presenças!" });
  }


});




app.use('/', router);
// Iniciar o servidor na porta 3000
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
