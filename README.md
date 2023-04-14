# 🚛 Transporte de Cargas (DELL) 🚚
[![NPM](https://img.shields.io/github/license/Alamito/Dell-ChargeTransport-Nodejs)](https://github.com/Alamito/Dell-ChargeTransport-Nodejs/blob/main/LICENSE)

# 📜 Sobre o projeto 📜
<p align="justify">
Projeto dedicado ao desafio prático proposto pela empresa DELL Brasil em conjunto com a PUCRS em seu processo seletivo, no qual tem como objetivo o desenvolvimento de um sistema de transporte interestadual de cargas. Para o desenvolvimento da aplicação foi fornecido um arquivo .CSV contendo dados de distâncias entre as cidades, bem como uma tabela de itens e de modelos de transporte.<br>
</p>

| ITENS | Peso (Kg) |
| -------- | -------- |
| Celular | 0.5 |
| Geladeira | 60.0 |
| Freezer | 100.0 |
| Cadeira | 5.0 |
| Luminária | 0.8 |
| Lavadora de roupa | 120kg |

| ITENS | Preço por Km (R$/Km) |
| -------- | -------- |
| Caminhão de pequeno porte | 4,87 |
| Caminhão de médio porte | 11,92 |
| Caminhão de grande porte | 27,44 |

<p align="justify">
O desenvolvimento da aplicação foi dividido entre três funcionalidades: (1) Consultar trechos x modalidade; (2) Cadastrar transporte; e (3) Dados estatísticos.
</p>

### Consultar trechos x modalidade
<p align="justify">
Nesta funcionalidade, a aplicação tem que fornecer os trechos disponíveis para transporte e, a partir da modalidade de transporte inserida pelo usuário, fornecer a distância entre as cidades e o custo total da viagem.
</p>

### Cadastrar transporte
<p align="justify">
Nesta funcionalidade, a aplicação deve permitir ao usuário inserir determinados itens e uma sequência de cidades, a partir disso identificar o(s) modelo(s) de caminhão(ões) mais adequado de transporte, bem como os custos envolvidos.
</p>

### Dados estatísticos
<p align="justify">
Nesta funcionalidade, a aplicação deve exibir um relatório dos transportes até então cadastrados.
</p>

# 🎥 Apresentação do projeto 🎥
A seguir está representada a aplicação, onde foram testadas as três funcionalidades:

https://user-images.githubusercontent.com/102616676/232062388-4ac8fcf8-916f-4ff5-8f6d-eea08aabb51e.mp4

# 🧬 Tecnologias utilizadas 🧬
- JavaScript/Node.js;
- Módulos Node: Readline e fast-CSV;

# ⏯ Como executar o projeto ⏯

### Requisitos
- Node.js e NPM.

```bash
# clonar repositório
git clone https://github.com/Alamito/Dell-ChargeTransport-Nodejs.git

# entrar no diretório da aplicação
cd "Dell-ChargeTransport-Nodejs"

# baixar os módulos node
npm i

# inicializar a aplicação
node main.js
```

# ✍️ Autor ✍️
Alamir Bobroski Filho 
- www.linkedin.com/in/alamirdev

<p align = "center"><em>"O poder não vem do conhecimento mantido, mas do conhecimento compartilhado"</em></p> <p align = "center">Bill Gates</p>
