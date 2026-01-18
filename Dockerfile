FROM oven/bun:1.0

# Instala dependencias del sistema operativo si son necesarias
# RUN apt-get update && apt-get install -y ...

WORKDIR /app

# Copia los archivos de definición de dependencias e instálalas
COPY package.json bun.lockb ./
RUN bun install

# Copia el resto del código de la aplicación
COPY . .

# Expone el puerto en el que corre la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["bun", "start"]
