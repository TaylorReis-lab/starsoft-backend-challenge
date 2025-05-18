FROM node:18-alpine

WORKDIR /usr/src/app

# Instala dependências de compilação
RUN apk add --no-cache python3 make g++

# Copia arquivos de configuração
COPY package*.json tsconfig*.json ./

# Instala dependências
RUN npm install

# Copia todo o código fonte
COPY . .

# Compila o TypeScript para JavaScript
RUN npm run build

# Remove arquivos TypeScript (opcional)
RUN find src -name "*.ts" -type f -delete

CMD ["node", "dist/main"]