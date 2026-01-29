FROM oven/bun:1 AS base
WORKDIR /app

# Copiar archivos de dependencias (usando bun.lockb)
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Copiar el resto de la aplicación
COPY . .

# Ejecutar la build con variables de entorno para evitar SSR
ENV NODE_ENV=production
RUN bun run build

# Exponer puerto
EXPOSE 10000

# Comando para ejecutar
CMD ["bun", "run", "start"]
