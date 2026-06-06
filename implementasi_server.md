# Implementasi Server Ubuntu - khansa_kirana_new

Dokumen ini dibuat otomatis oleh `auto-github-backup` untuk recovery ketika server mati/down.
Branch backup saat dokumen ini dibuat: `feat/backup-v21`.

## 1. Paket dasar server

```bash
sudo apt update
sudo apt install -y git curl nginx mysql-server build-essential
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

## 2. Ambil source dari GitHub

```bash
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www
git clone -b feat/backup-v21 https://github.com/RakitTech/khansa_kirana_new.git /var/www/khansa_kirana_new
cd /var/www/khansa_kirana_new
npm ci
```

Jika ingin restore versi backup lain, ganti nama branch `feat/backup-v<n>`.

## 3. Siapkan database MySQL

```bash
sudo mysql
CREATE DATABASE IF NOT EXISTS `khansa_collection` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'khansa_user'@'localhost' IDENTIFIED BY 'PASSWORD_DATABASE';
GRANT ALL PRIVILEGES ON `khansa_collection`.* TO 'khansa_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
mysql -u khansa_user -p khansa_collection < database.sql
```

## 4. Siapkan file env

Buat file env sesuai pola proyek. Jangan commit password asli ke repo.

```bash
cat > .env <<'EOF'
DB_HOST=localhost
DB_PORT=3306
DB_USER=khansa_user
DB_PASSWORD=PASSWORD_DATABASE
DB_NAME=khansa_collection
NODE_ENV=production
PORT=3030
EOF
```

Untuk Next.js yang memakai `.env.local`, salin nilai yang sama ke `.env.local`.

## 5. Build dan jalankan aplikasi

```bash
# Tidak ada langkah ORM khusus.
npm run build
pm2 start npm --name khansa-kirana-web -- run start -- -p 3030
pm2 save
pm2 startup
```

## 6. Reverse proxy Nginx

```nginx
server {
    listen 80;
    server_name DOMAIN_ANDA;

    location / {
        proxy_pass http://127.0.0.1:3030;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Aktifkan konfigurasi:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 7. Checklist recovery

- Pastikan `database.sql` sudah di-import tanpa error.
- Pastikan file `.env` atau `.env.local` berisi credential produksi.
- Jalankan `pm2 logs khansa-kirana-web` jika aplikasi tidak naik.
- Jika ada folder upload lokal, pastikan folder tersebut ikut ada di source backup atau dipulihkan dari storage backup lain.
