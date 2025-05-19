FROM node:18-alpine AS development

WORKDIR /usr/src/app

# Instala dependências de compilação e SSL
RUN apk add --no-cache curl netcat-openbsd

# 1. Copia arquivos de configuração primeiro (para melhor cache)
COPY package*.json tsconfig*.json ./

# 2. Instala dependências
RUN npm install

# 3. Copia todo o código fonte
COPY . .

RUN chmod +x entrypoint.sh

# 4. Compila TypeScript para JavaScript
RUN npm run build

EXPOSE 3000

CMD [ "./entrypoint.sh" ]
