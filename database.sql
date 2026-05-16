-- =============================================================================
-- Khansa Collection — Database Schema & Seed
-- Database: khansa_collection (MySQL / MariaDB)
--
-- Cara pakai:
--   mysql -u <user> -p < database.sql
-- =============================================================================

CREATE DATABASE IF NOT EXISTS khansa_collection
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE khansa_collection;

-- -----------------------------------------------------------------------------
-- TABLES
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `admin_users` (
    `id`             VARCHAR(36)  NOT NULL,
    `email`          VARCHAR(255) NOT NULL,
    `name`           VARCHAR(255)          DEFAULT NULL,
    `role`           VARCHAR(50)  NOT NULL DEFAULT 'admin',
    `is_active`      TINYINT(1)   NOT NULL DEFAULT 1,
    `password_hash`  VARCHAR(255) NOT NULL,
    `last_login_at`  DATETIME              DEFAULT NULL,
    `created_at`     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_admin_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `site_content` (
    `id`           VARCHAR(36)  NOT NULL,
    `key`          VARCHAR(255) NOT NULL,
    `section`      VARCHAR(100) NOT NULL,
    `content_type` VARCHAR(50)  NOT NULL DEFAULT 'text',
    `value`        TEXT         NOT NULL,
    `description`  TEXT                  DEFAULT NULL,
    `updated_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_site_content_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `store_profile` (
    `id`                VARCHAR(36)  NOT NULL,
    `store_name`        VARCHAR(255)          DEFAULT NULL,
    `logo_url`          TEXT                  DEFAULT NULL,
    `address`           TEXT                  DEFAULT NULL,
    `gmaps_link`        TEXT                  DEFAULT NULL,
    `latitude`          DOUBLE                DEFAULT NULL,
    `longitude`         DOUBLE                DEFAULT NULL,
    `phone`             VARCHAR(50)           DEFAULT NULL,
    `whatsapp`          VARCHAR(50)           DEFAULT NULL,
    `instagram_url`     TEXT                  DEFAULT NULL,
    `facebook_url`      TEXT                  DEFAULT NULL,
    `tiktok_url`        TEXT                  DEFAULT NULL,
    `operational_hours` VARCHAR(255)          DEFAULT NULL,
    `hero_images`       TEXT                  DEFAULT NULL,
    `created_at`        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `products` (
    `id`               VARCHAR(36)  NOT NULL,
    `name`             VARCHAR(255) NOT NULL,
    `description`      TEXT                  DEFAULT NULL,
    `image_url`        TEXT                  DEFAULT NULL,
    `price`            DOUBLE       NOT NULL DEFAULT 0,
    `category`         VARCHAR(100) NOT NULL,
    `province`         VARCHAR(100)          DEFAULT NULL,
    `traditional_name` VARCHAR(255)          DEFAULT NULL,
    `is_available`     TINYINT(1)   NOT NULL DEFAULT 1,
    `show_in_gallery`  TINYINT(1)   NOT NULL DEFAULT 0,
    `created_at`       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `product_images` (
    `id`         VARCHAR(36)  NOT NULL,
    `product_id` VARCHAR(36)  NOT NULL,
    `image_url`  TEXT         NOT NULL,
    `sort_order` INT          NOT NULL DEFAULT 0,
    `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_product_images_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `outlet_locations` (
    `id`                VARCHAR(36)  NOT NULL,
    `name`              VARCHAR(255) NOT NULL,
    `address`           TEXT                  DEFAULT NULL,
    `latitude`          DOUBLE       NOT NULL,
    `longitude`         DOUBLE       NOT NULL,
    `phone`             VARCHAR(50)           DEFAULT NULL,
    `whatsapp`          VARCHAR(50)           DEFAULT NULL,
    `operational_hours` VARCHAR(255)          DEFAULT NULL,
    `is_main`           TINYINT(1)   NOT NULL DEFAULT 0,
    `is_active`         TINYINT(1)   NOT NULL DEFAULT 1,
    `created_at`        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `testimonials` (
    `id`         VARCHAR(36)  NOT NULL,
    `name`       VARCHAR(255) NOT NULL,
    `occasion`   VARCHAR(255) NOT NULL,
    `review`     TEXT         NOT NULL,
    `rating`     DOUBLE       NOT NULL DEFAULT 5.0,
    `is_active`  TINYINT(1)   NOT NULL DEFAULT 1,
    `sort_order` INT          NOT NULL DEFAULT 0,
    `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `gallery_items` (
    `id`                    VARCHAR(36)  NOT NULL,
    `title`                 VARCHAR(255) NOT NULL,
    `category`              VARCHAR(100) NOT NULL DEFAULT '',
    `image_url`             TEXT         NOT NULL,
    `cross_axis_cell_count` INT          NOT NULL DEFAULT 2,
    `main_axis_cell_count`  INT          NOT NULL DEFAULT 1,
    `is_active`             TINYINT(1)   NOT NULL DEFAULT 1,
    `sort_order`            INT          NOT NULL DEFAULT 0,
    `created_at`            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `island_groups` (
    `id`         VARCHAR(36)  NOT NULL,
    `key`        VARCHAR(100) NOT NULL,
    `name`       VARCHAR(255) NOT NULL,
    `sort_order` INT          NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_island_groups_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `catalog_provinces` (
    `id`           VARCHAR(36)  NOT NULL,
    `name`         VARCHAR(255) NOT NULL,
    `island_key`   VARCHAR(100) NOT NULL DEFAULT '',
    `costume_name` VARCHAR(255) NOT NULL DEFAULT '',
    `description`  TEXT         NOT NULL,
    `image_url`    TEXT                  DEFAULT NULL,
    `price_from`   VARCHAR(100) NOT NULL DEFAULT 'Rp 125.000',
    `is_active`    TINYINT(1)   NOT NULL DEFAULT 1,
    `sort_order`   INT          NOT NULL DEFAULT 0,
    `created_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- SEED DATA
-- -----------------------------------------------------------------------------

-- Admin default (password: kadmink123)
-- Untuk generate hash yang benar, jalankan:
--   python3 scripts/create_admin.py --email admin@admin.com --password kadmink123 --name "Super Admin" --role super_admin
INSERT IGNORE INTO `admin_users` (`id`, `email`, `name`, `role`, `is_active`, `password_hash`, `created_at`) VALUES
  ('00000000-0000-0000-0000-000000000001',
   'admin@admin.com', 'Super Admin', 'super_admin', 1,
   '$2b$12$r5ehKEMumj7SfaifnpVa2OUDJbVfNdxXVxfn0e69gz/WVeaaJSjW6',
   UTC_TIMESTAMP());

-- Island Groups
INSERT IGNORE INTO `island_groups` (`id`, `key`, `name`, `sort_order`) VALUES
  (UUID(), 'jawa',       'Jawa',                 1),
  (UUID(), 'sumatera',   'Sumatera',              2),
  (UUID(), 'kalimantan', 'Kalimantan',            3),
  (UUID(), 'sulawesi',   'Sulawesi',              4),
  (UUID(), 'bali_nt',    'Bali & Nusa Tenggara',  5),
  (UUID(), 'maluku_papua', 'Maluku & Papua',      6);

-- Store Profile
INSERT IGNORE INTO `store_profile` (`id`, `store_name`, `address`, `phone`, `whatsapp`, `instagram_url`, `operational_hours`) VALUES
  ('00000000-0000-0000-0000-000000000002',
   'Khansa Collection',
   'Jl. Contoh No. 1, Jakarta Selatan',
   '+6281234567890', '+6281234567890',
   'https://instagram.com/khansakirana',
   'Senin - Sabtu: 08.00 - 20.00');

-- Products
INSERT IGNORE INTO `products` (`id`, `name`, `description`, `image_url`, `price`, `category`, `province`, `traditional_name`, `is_available`) VALUES
  (UUID(), 'Kebaya Encim Betawi',     'Kebaya encim khas Betawi dengan hiasan bordir halus, cocok untuk acara pernikahan dan kondangan.',   '', 185000, 'kebaya',    'DKI Jakarta',       'Kebaya Encim',       1),
  (UUID(), 'Kebaya Kartini Jawa',     'Kebaya potongan Kartini dari bahan katun halus, elegant dan nyaman dipakai seharian.',               '', 165000, 'kebaya',    'Jawa Tengah',       'Kebaya Jawa',        1),
  (UUID(), 'Batik Parang Solo',       'Batik tulis motif parang khas Solo dengan warna sogan tradisional.',                                '', 250000, 'batik',     'Jawa Tengah',       'Batik Parang',       1),
  (UUID(), 'Batik Mega Mendung',      'Batik cap motif mega mendung khas Cirebon, hadir dalam berbagai pilihan warna cerah.',              '', 195000, 'batik',     'Jawa Barat',        'Batik Mega Mendung', 1),
  (UUID(), 'Baju Bodo Bugis',         'Baju bodo tradisional Bugis dari bahan sutra, tersedia dalam berbagai warna sesuai tingkatan adat.', '', 320000, 'baju_adat', 'Sulawesi Selatan',  'Baju Bodo',          1),
  (UUID(), 'Ulos Batak Toba',         'Kain ulos motif ragi hotang khas Batak Toba, ditenun secara tradisional.',                          '', 280000, 'kain_adat', 'Sumatera Utara',    'Ulos Ragi Hotang',   1),
  (UUID(), 'Kebaya Bali Modern',      'Kebaya Bali dengan sentuhan modern, cocok untuk upacara adat maupun pesta.',                        '', 210000, 'kebaya',    'Bali',              'Kebaya Bali',        1),
  (UUID(), 'Batik Kawung Yogyakarta', 'Batik motif kawung klasik khas Keraton Yogyakarta, dibuat dengan teknik batik tulis.',               '', 275000, 'batik',     'DI Yogyakarta',     'Batik Kawung',       1),
  (UUID(), 'Tenun Songket Palembang', 'Kain songket Palembang dengan benang emas, cocok untuk acara resmi dan pernikahan adat.',            '', 450000, 'kain_adat', 'Sumatera Selatan',  'Songket Palembang',  1),
  (UUID(), 'Baju Adat Dayak',         'Pakaian adat Dayak dengan hiasan manik-manik tradisional, nyaman dan unik.',                        '', 380000, 'baju_adat', 'Kalimantan Tengah', 'Baju Adat Dayak',    1);

-- Outlets
INSERT IGNORE INTO `outlet_locations` (`id`, `name`, `address`, `latitude`, `longitude`, `phone`, `whatsapp`, `operational_hours`, `is_main`, `is_active`) VALUES
  (UUID(), 'Outlet Pusat Jakarta', 'Jl. Contoh No. 1, Kebayoran Baru, Jakarta Selatan', -6.2297, 106.8049, '+6281234567890', '+6281234567890', 'Senin - Sabtu: 08.00 - 20.00',  1, 1),
  (UUID(), 'Outlet Bandung',       'Jl. Dago No. 55, Coblong, Bandung',                 -6.8914, 107.6102, '+6281234567891', '+6281234567891', 'Senin - Minggu: 09.00 - 19.00', 0, 1);

-- Testimonials
INSERT IGNORE INTO `testimonials` (`id`, `name`, `occasion`, `review`, `rating`, `is_active`, `sort_order`) VALUES
  (UUID(), 'Siti Rahayu',   'Pernikahan Adat Jawa', 'Kebaya yang saya sewa sangat cantik dan sesuai ekspektasi. Pelayanan ramah dan pengiriman tepat waktu!', 5.0, 1, 1),
  (UUID(), 'Dewi Lestari',  'Wisuda Universitas',   'Baju adatnya bagus sekali, bahan nyaman dipakai seharian. Pasti akan sewa lagi untuk acara berikutnya.', 5.0, 1, 2),
  (UUID(), 'Rina Fitriani', 'Acara Kebudayaan',     'Koleksinya lengkap dan harganya sangat terjangkau. Kualitas kain juga tidak mengecewakan.',              4.5, 1, 3);

-- Site Content
INSERT IGNORE INTO `site_content` (`id`, `key`, `section`, `content_type`, `value`, `description`) VALUES
  (UUID(), 'hero_title',    'hero',  'text', 'Keindahan Busana Nusantara',                                                                                                                       'Judul utama halaman beranda'),
  (UUID(), 'hero_subtitle', 'hero',  'text', 'Sewa pakaian adat berkualitas dari seluruh penjuru Indonesia',                                                                                    'Subjudul halaman beranda'),
  (UUID(), 'about_title',   'about', 'text', 'Tentang Khansa Collection',                                                                                                                       'Judul halaman about'),
  (UUID(), 'about_text',    'about', 'text', 'Khansa Collection hadir untuk memenuhi kebutuhan busana adat Nusantara Anda. Dengan koleksi lengkap dari berbagai provinsi di Indonesia, kami siap membantu Anda tampil memukau di setiap acara spesial.', 'Deskripsi about');
