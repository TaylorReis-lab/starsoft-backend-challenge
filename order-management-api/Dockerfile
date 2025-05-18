# Usa imagem Node como base
FROM node:24-alpine

# Cria diretório de trabalho
WORKDIR /usr/src/app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia os arquivos da aplicação
COPY . .

# Expõe a porta da aplicação
EXPOSE 3000

# Comando padrão
CMD ["npm", "run", "start:dev"]
