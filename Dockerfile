# Gunakan image node.js versi LTS
FROM node:18

# Atur working directory di dalam container
WORKDIR /app

# Salin package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin semua file project ke dalam container
COPY . .

# Setup env
ENV SERVICE_NAME=aplikasi-pertanian \
    MONGO_URL=mongodb+srv://fauzanhusain:iqL83OlQYMhkluW7@cluster0.std89.mongodb.net/pertanian-app?retryWrites=true&w=majority \
    JWT_KEY=achmadfauzanhusainpalopo13agustus2006/toraja \
    PORT=8000 \
    FIREBASE_KEY=AIzaSyAnkBSGaeqlRgQAXHJF9PTHa-T-NZNr7Ao \
    FIREBASE_AUTH_DOMAIN=pertanian-app.firebaseapp.com \
    FIREBASE_MESSAGING_SENDERID=1049538273775 \
    FIREBASE_APP_ID=1:1049538273775:web:c105859446c3180246d61a

# Expose port (ganti dengan port yang digunakan aplikasi Anda)
EXPOSE 8000

# Perintah untuk menjalankan aplikasi
CMD ["npm", "start"]