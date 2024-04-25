# Use a imagem oficial do PostgreSQL. Usando a tag 16 para não manter o "latest" e evitar possiveis problemas futuros.
FROM postgres:16

# Definindo as variáveis de ambiente para o nome do banco de dados, o usuário e a senha
ENV POSTGRES_DB=yazo
ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=admin