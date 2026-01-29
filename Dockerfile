FROM oven/bun:1 AS base
WORKDIR /app

# Copiar archivos de dependencias (usando bun.lockb)
COPY package.json bun.lockb ./
RUN bun install

# Copiar el resto de la aplicación
COPY . .

# Ejecutar la build
RUN bun run build

# Exponer puerto
EXPOSE 10000

# Comando para ejecutar
CMD ["bun", "run", "start"]
