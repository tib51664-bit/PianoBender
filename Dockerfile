# Usar imagen oficial de Bun
FROM oven/bun:1 AS base
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json bun.lock ./
RUN bun install --production

# Copiar el resto de la aplicación
COPY . .

# Exponer puerto (Render usa el 10000 por defecto)
EXPOSE 10000

# Comando para ejecutar
CMD ["bun", "run", "start"]
