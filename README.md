# Order Management API

API para gerenciamento de pedidos construída com NestJS, utilizando Kafka para eventos, PostgreSQL como banco de dados relacional e Elasticsearch para busca eficiente.

---

## Funcionalidades

- **CRUD completo de pedidos:** criar, listar, atualizar e deletar pedidos.
- **Gerenciamento de status:** acompanhamento do status dos pedidos (pending, processing, shipped, delivered).
- **Integração com Kafka:** emissão de eventos quando o status do pedido é alterado.
- **Indexação e busca com Elasticsearch:** indexa os pedidos para buscas rápidas e avançadas.
- **Filtros flexíveis:** permite buscar pedidos por status, cliente, datas, e valor total.
- **Health check endpoint:** monitoramento do status da API para integração com orquestradores e monitoração.

---

## Estrutura do Projeto

order-management-api/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── orders/
│   │   ├── orders.controller.ts
│   │   ├── orders.service.ts
│   │   ├── orders.module.ts
│   │   ├── entities/
│   │   │   └── order.entity.ts
│   │   └── dto/
│   │       ├── create-order.dto.ts
│   │       └── update-order.dto.ts
│   ├── kafka/
│   │   └── kafka.service.ts
│   └── elasticsearch/
│       └── elasticsearch.service.ts
├── docker-compose.yml
├── Dockerfile
├── entrypoint.sh
├── package.json
├── tsconfig.json
└── README.md

- **modules/orders:** contém toda lógica relacionada a pedidos (entidades, controladores, serviços, DTOs e repositórios).
- **modules/kafka:** serviço responsável pela produção e consumo de eventos Kafka.
- **modules/elasticsearch:** serviço para indexação e busca dos pedidos no Elasticsearch.
- **config:** configuração centralizada do projeto (database, kafka, elasticsearch).
- **docker-compose.yml:** orquestração dos containers Docker (API, Kafka, Zookeeper, PostgreSQL, Elasticsearch).
- **.env:** arquivo de variáveis de ambiente.

---

## Como usar

### Pré-requisitos

- Docker e Docker Compose instalados.
- Porta 3000, 9200, 9092, 5432 livres no seu sistema.

### Passos para rodar localmente com Docker

1. Clone o repositório:

```bash
git clone <repo-url>
cd order-management-api

2. Configure as variáveis de ambiente no arquivo .env (exemplo já fornecido no projeto).


3. Suba os containers Docker:



docker-compose up --build

Isso vai iniciar os serviços:

API NestJS em http://localhost:3000

PostgreSQL

Kafka + Zookeeper

Elasticsearch: 


4. Verifique a saúde da API:



curl http://localhost:3000/health

Endpoints principais

Método	Rota	Descrição

GET	/orders	Lista pedidos com filtros opcionais
GET	/orders/:id	Obtém pedido por ID
POST	/orders	Cria um novo pedido
PUT	/orders/:id	Atualiza pedido existente
DELETE	/orders/:id	Remove um pedido


Event Streaming com Kafka

Evento ORDER_STATUS_CHANGED é emitido sempre que o status de um pedido é atualizado.

Eventos são enviados para o tópico configurado em .env.


Indexação e busca com Elasticsearch

Pedidos são automaticamente indexados no Elasticsearch após criação ou atualização.

Busca avançada disponível via filtros nos endpoints.



---

Desenvolvimento

Código TypeScript organizado seguindo boas práticas e padrão Clean Architecture.

Serviços desacoplados para facilitar manutenção e testes.

Utilize npm run start:dev para rodar em modo desenvolvimento (watch mode).



---

Considerações Finais

Este projeto é uma base robusta para aplicações que demandam alta escalabilidade e integração via eventos. O uso combinado de Kafka e Elasticsearch permite tratar grandes volumes de dados e oferecer respostas rápidas para buscas complexas.


---

Se precisar de ajuda com algo mais, é só chamar!

---

Quer que eu gere o arquivo pra você salvar localmente? Posso criar e disponibilizar para download.

