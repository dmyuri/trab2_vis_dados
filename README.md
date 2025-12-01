# Visualização de Dados - Crimes de Chicago

Este projeto implementa uma visualização dos dados criminais de Chicago do ano de 2019 a 2024. 

## Estrutura do Projeto

```
projeto-chicago-crime/
├── index.html          # Interface principal
├── index.css           # Estilos
├── package.json        # Dependências npm
├── vite.config.js      # Configuração do Vite
├── README.md           # Este arquivo
└── src/
    ├── main.js         # Ponto de entrada principal
    ├── config.js       # Configuração do DuckDB
    ├── chicago.js      # Classe para carregar e consultar dados
    └── visualizations.js # Funções de visualização D3.js
```

## Requisitos

- Node.js e npm instalados
- Arquivo `chicago.parquet` na pasta `00 - data/` (raiz do repositório)

## Instalação

1. Navegue até a pasta do projeto:
```bash
cd projeto-chicago-crime
```

2. Instale as dependências:
```bash
npm install
```

## Uso

1. Certifique-se de que o arquivo `chicago.parquet` está na pasta `00 - data/` na raiz do repositório.

2. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

3. Abra o navegador no endereço indicado (geralmente `http://localhost:5173`).

4. Clique no botão "Carregar Dados" para carregar os dados e gerar as visualizações.

## Visualizações Implementadas

### 1. Variações Temporais

- **Crimes por Hora do Dia**: Gráfico de barras mostrando a distribuição de crimes ao longo das 24 horas
- **Série Temporal**: Gráfico de linha/área mostrando a evolução dos crimes ao longo do tempo

### 2. Composição de Variáveis

- **Top 10 Tipos de Crime**: Gráfico de barras horizontais com os tipos de crime mais frequentes
- **Top 10 Localizações**: Gráfico de barras horizontais com as localizações mais frequentes
- **Distribuição Com prisão vs Sem prisão**: Gráfico de pizza

### 3. Análises Adicionais

- **Relação Prisão vs Tipo de Crime**: Gráfico de barras agrupadas mostrando a relação entre tipos de crime e ocorrência de arrest

## Tecnologias Utilizadas

- **D3.js v7.9.0**: Biblioteca para visualizações
- **DuckDB-WASM v1.29.0**: Banco de dados in-memory para processamento de dados
- **Vite v6.3.5**: Build tool e servidor de desenvolvimento

## Características

- ✅ Processamento de dados feito inteiramente no sistema (DuckDB)
- ✅ Carregamento de arquivos .parquet originais
- ✅ Visualizações construídas com D3.js
- ✅ Análise temporal (hora, dia, mês, série temporal)
- ✅ Análise de composição (tipos, localizações, distribuições)
- ✅ Interface responsiva e interativa
- ✅ Tooltips informativos em todas as visualizações
