FROM oven/bun:1 AS base
WORKDIR /app

# Copiar archivos de dependencias (usando bun.lockb)
COPY package.json bun.lockb ./
RUN bun install --production

# Copiar el resto de la aplicación
COPY . .

# Exponer puerto
EXPOSE 10000

# Comando para ejecutar
CMD ["bun", "run", "start"]
