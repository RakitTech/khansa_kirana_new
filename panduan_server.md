# Panduan Deploy Khansa Collection ke Server

> Panduan ini ditujukan untuk deploy aplikasi Next.js **Khansa Collection** ke server Linux (Ubuntu/Debian) dengan database MySQL.

---

## Persyaratan Server

| Komponen  | Versi Minimum |
|-----------|--------------|
| OS        | Ubuntu 20.04 / Debian 11 |
| Node.js   | 20.x LTS     |
| npm       | 10.x         |
| MySQL     | 8.0 / MariaDB 10.6 |
| Git       | 2.x          |
| PM2       | (process manager) |

---

## 1. Update Server & Install Dependensi Dasar

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl wget unzip
```

---

## 2. Install Node.js (v20 LTS via NodeSource)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v    # pastikan v20.x
npm -v
```

---

## 3. Install MySQL

```bash
sudo apt install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql

# Amankan instalasi MySQL
sudo mysql_secure_installation
```

### Buat Database & User MySQL

```sql
-- Login sebagai root
sudo mysql -u root -p

-- Jalankan perintah berikut di dalam MySQL:
CREATE DATABASE khansa_collection
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

CREATE USER 'khansa_user'@'localhost' IDENTIFIED BY 'GANTI_DENGAN_PASSWORD_KUAT';
GRANT ALL PRIVILEGES ON khansa_collection.* TO 'khansa_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Import Schema Database

```bash
# Upload file database.sql ke server terlebih dahulu, lalu:
mysql -u khansa_user -p khansa_collection < /path/ke/database.sql
```

> **Catatan:** File `database.sql` sudah tersedia di root proyek ini. File tersebut mencakup semua tabel dan data awal (seed) termasuk akun admin default.

---

## 4. Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
```

---

## 5. Clone & Setup Proyek

```bash
# Masuk ke direktori web (sesuaikan)
cd /var/www

# Clone repositori
git clone <URL_REPO_GITHUB> khansa-collection
cd khansa-collection

# Install dependensi
npm install
```

---

## 6. Buat File `.env.local`

Buat file `.env.local` di root proyek:

```bash
nano /var/www/khansa-collection/.env.local
```

Isi dengan konfigurasi berikut (sesuaikan nilai-nilainya):

```env
# ── Database MySQL ────────────────────────────────────────
DB_HOST=localhost
DB_PORT=3306
DB_USER=khansa_user
DB_PASSWORD=GANTI_DENGAN_PASSWORD_KUAT
DB_NAME=khansa_collection

# ── JWT Auth ──────────────────────────────────────────────
# Gunakan string acak yang panjang dan kuat!
JWT_SECRET=GANTI_DENGAN_STRING_RAHASIA_PANJANG_MIN_32_KARAKTER

# ── App URL ───────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=https://domain-anda.com
```

> **PENTING:** Jangan pernah commit file `.env.local` ke Git.  
> Generate `JWT_SECRET` yang kuat: `openssl rand -hex 32`

---

## 7. Build Aplikasi Next.js

```bash
cd /var/www/khansa-collection
npm run build
```

Pastikan build selesai tanpa error.

---

## 8. Jalankan dengan PM2

```bash
pm2 start npm --name "khansa-collection" -- start
pm2 save
pm2 startup   # ikuti instruksi yang muncul agar auto-start saat reboot
```

Cek status:

```bash
pm2 status
pm2 logs khansa-collection
```

Aplikasi berjalan di port **3000** secara default.

---

## 9. Setup Nginx sebagai Reverse Proxy

```bash
sudo apt install -y nginx
```

Buat konfigurasi Nginx:

```bash
sudo nano /etc/nginx/sites-available/khansa-collection
```

Isi dengan:

```nginx
server {
    listen 80;
    server_name domain-anda.com www.domain-anda.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Upload file — sesuaikan ukuran maksimal
    client_max_body_size 20M;
}
```

Aktifkan dan restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/khansa-collection /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 10. SSL/HTTPS dengan Certbot (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d domain-anda.com -d www.domain-anda.com
```

Certbot akan otomatis memperbarui sertifikat. Cek dengan:

```bash
sudo certbot renew --dry-run
```

---

## 11. Login Admin Default

Setelah database diimport, login ke panel admin:

- **URL:** `https://domain-anda.com/admin/login`
- **Email:** `admin@admin.com`
- **Password:** `kadmink123`

> **WAJIB:** Ganti password setelah pertama kali login melalui menu **Settings → Ganti Password**.

---

## 12. Update Aplikasi (Deploy Ulang)

```bash
cd /var/www/khansa-collection
git pull origin main
npm install
npm run build
pm2 restart khansa-collection
```

---

## Ringkasan Variabel Environment

| Variabel           | Keterangan                              | Contoh                          |
|--------------------|-----------------------------------------|---------------------------------|
| `DB_HOST`          | Host MySQL                              | `localhost`                     |
| `DB_PORT`          | Port MySQL                              | `3306`                          |
| `DB_USER`          | Username MySQL                          | `khansa_user`                   |
| `DB_PASSWORD`      | Password MySQL                          | `password_kuat`                 |
| `DB_NAME`          | Nama database                           | `khansa_collection`             |
| `JWT_SECRET`       | Secret untuk JWT token auth             | string acak min. 32 karakter    |
| `NEXT_PUBLIC_APP_URL` | URL publik aplikasi                  | `https://domain-anda.com`       |

---

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Build gagal | Pastikan Node.js v20, cek `npm install` ulang |
| DB tidak konek | Cek kredensial di `.env.local`, pastikan MySQL jalan |
| Port 3000 tidak bisa diakses | Cek `pm2 status`, lihat log dengan `pm2 logs` |
| 502 Bad Gateway | Pastikan Next.js jalan di port 3000, cek konfigurasi Nginx |
| Upload file gagal | Cek izin direktori `public/uploads`, sesuaikan `client_max_body_size` di Nginx |

---

*Dibuat untuk proyek Khansa Collection — Next.js 16 + MySQL*
