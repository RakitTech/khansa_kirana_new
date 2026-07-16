-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: localhost    Database: khansa_collection
-- ------------------------------------------------------
-- Server version	8.0.46-0ubuntu0.24.04.3

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `khansa_collection`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `khansa_collection` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `khansa_collection`;

--
-- Table structure for table `admin_users`
--

DROP TABLE IF EXISTS `admin_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_users` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'admin',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_login_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_users`
--

LOCK TABLES `admin_users` WRITE;
/*!40000 ALTER TABLE `admin_users` DISABLE KEYS */;
INSERT INTO `admin_users` VALUES ('976f3e76-1315-4ff1-8569-43c6a9de36a7','Deanaya@admin.com','Deanaya','super_admin',1,'$2b$12$c0RyxGoSqbZ4EzIPEFz/X.MdVVQi6futF7NR3Lj3KYbjI2yeOL0xC',NULL,'2026-04-26 12:49:47'),('d9912a2c-3bfa-4aad-806a-25a8eb94ffac','admin@admin.com','Super Admin','super_admin',1,'$2b$12$ozEmY/kAg/nT3NQI1bjXl.l.ZJSQwygtPRSFXkrZgB6CSpfK.viHe','2026-06-16 20:19:11','2026-04-18 10:09:48');
/*!40000 ALTER TABLE `admin_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catalog_provinces`
--

DROP TABLE IF EXISTS `catalog_provinces`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `catalog_provinces` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `island_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `costume_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` text COLLATE utf8mb4_unicode_ci,
  `price_from` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Rp 125.000',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalog_provinces`
--

LOCK TABLES `catalog_provinces` WRITE;
/*!40000 ALTER TABLE `catalog_provinces` DISABLE KEYS */;
INSERT INTO `catalog_provinces` VALUES ('2f777766-3cce-11f1-b40f-6644b469e6fb','Aceh','sumatera','Ulee Balang','Pakaian kebangsawanan Aceh bertabur sulaman emas',NULL,'Rp 150.000',1,1,'2026-04-20 15:32:48','2026-04-21 06:34:26'),('2f7786a2-3cce-11f1-b40f-6644b469e6fb','Sumatera Utara','sumatera','Ulos Batak','Kain tenun sakral suku Batak Toba',NULL,'Rp 150.000',1,2,'2026-04-20 15:32:48','2026-04-21 06:34:26'),('2f77888c-3cce-11f1-b40f-6644b469e6fb','Sumatera Barat','sumatera','Baju Adat Minang','Pakaian adat Minangkabau penuh ornamen keemasan',NULL,'Rp 175.000',1,3,'2026-04-20 15:32:48','2026-04-21 06:34:26'),('2f7789c2-3cce-11f1-b40f-6644b469e6fb','Riau','sumatera','Baju Melayu Riau','Pakaian adat Melayu Riau yang elegan',NULL,'Rp 125.000',1,4,'2026-04-20 15:32:48','2026-04-21 06:34:26'),('2f778ada-3cce-11f1-b40f-6644b469e6fb','Kepulauan Riau','sumatera','Baju Melayu Labuh','Baju kurung labuh khas Kepulauan Riau',NULL,'Rp 125.000',1,5,'2026-04-20 15:32:48','2026-04-21 06:34:26'),('2f778bfc-3cce-11f1-b40f-6644b469e6fb','Jambi','sumatera','Baju Kurung Jambi','Pakaian adat Melayu Jambi bermotif batik',NULL,'Rp 125.000',1,6,'2026-04-20 15:32:48','2026-04-21 06:34:26'),('2f778cec-3cce-11f1-b40f-6644b469e6fb','Bengkulu','sumatera','Baju Besurek','Baju bermotif kaligrafi khas Bengkulu',NULL,'Rp 125.000',1,7,'2026-04-20 15:32:48','2026-04-21 06:34:26'),('2f778de6-3cce-11f1-b40f-6644b469e6fb','Sumatera Selatan','sumatera','Aesan Gede','Pakaian pengantin kebesaran Palembang',NULL,'Rp 175.000',1,8,'2026-04-20 15:32:48','2026-04-21 06:34:26'),('2f778f30-3cce-11f1-b40f-6644b469e6fb','Bangka Belitung','sumatera','Baju Seting & Pending','Pakaian adat perempuan Bangka yang mewah',NULL,'Rp 125.000',1,9,'2026-04-20 15:32:48','2026-04-21 06:34:26'),('2f779034-3cce-11f1-b40f-6644b469e6fb','Lampung','sumatera','Tapis Lampung','Kain tapis bhineqa berbenang emas Lampung',NULL,'Rp 150.000',1,10,'2026-04-20 15:32:48','2026-04-21 06:34:26'),('2f77912e-3cce-11f1-b40f-6644b469e6fb','Banten','jawa','Pangsi Banten','Baju adat silat khas Banten',NULL,'Rp 100.000',1,11,'2026-04-20 15:32:48','2026-04-21 06:34:26'),('2f77921e-3cce-11f1-b40f-6644b469e6fb','DKI Jakarta','jawa','Kebaya Betawi','Kebaya encim & ondel-ondel khas Betawi Jakarta',NULL,'Rp 150.000',1,12,'2026-04-20 15:32:48','2026-04-21 06:34:26'),('2f7794a8-3cce-11f1-b40f-6644b469e6fb','Jawa Barat','jawa','Kebaya Sunda','Kebaya & kebat sunda yang anggun',NULL,'Rp 125.000',1,13,'2026-04-20 15:32:48','2026-04-21 06:34:26'),('2f77964c-3cce-11f1-b40f-6644b469e6fb','Jawa Tengah','jawa','Kebaya Jawa Tengah','Kebaya & jarit batik keraton Jawa Tengah',NULL,'Rp 125.000',1,14,'2026-04-20 15:32:48','2026-04-21 06:34:26'),('2f779782-3cce-11f1-b40f-6644b469e6fb','DI Yogyakarta','jawa','Kebaya Yogyakarta','Busana adat keraton Ngayogyakarta yang sakral',NULL,'Rp 125.000',1,15,'2026-04-20 15:32:48','2026-04-21 06:34:26'),('2f7798a4-3cce-11f1-b40f-6644b469e6fb','Jawa Timur','jawa','Kebaya Pesa\'an','Kebaya Pesa\'an khas Madura-Jawa Timur',NULL,'Rp 125.000',1,16,'2026-04-20 15:32:48','2026-04-21 06:34:26'),('2f7799b2-3cce-11f1-b40f-6644b469e6fb','Bali','bali_nt','Baju Adat Bali','Kebaya Bali & kamen dengan simbol kesakralan',NULL,'Rp 150.000',1,17,'2026-04-20 15:32:48','2026-04-21 06:34:26'),('2f779ab6-3cce-11f1-b40f-6644b469e6fb','NTB','bali_nt','Lambung (Lombok)','Pakaian adat wanita suku Sasak Lombok',NULL,'Rp 125.000',1,18,'2026-04-20 15:32:48','2026-04-21 06:34:26'),('2f779bba-3cce-11f1-b40f-6644b469e6fb','NTT','bali_nt','Kain Tenun Ikat','Pakaian tenun ikat khas NTT bermotif unik',NULL,'Rp 125.000',1,19,'2026-04-20 15:32:48','2026-04-21 06:34:26'),('2f779cbe-3cce-11f1-b40f-6644b469e6fb','Kalimantan Barat','kalimantan','Baju Adat Dayak','Baju adat Dayak Kalbar bermotif etnis',NULL,'Rp 150.000',1,20,'2026-04-20 15:32:48','2026-04-21 06:34:26'),('2f779dc2-3cce-11f1-b40f-6644b469e6fb','Kalimantan Tengah','kalimantan','King Manik','Pakaian adat Dayak Kalteng penuh manik-manik',NULL,'Rp 150.000',1,21,'2026-04-20 15:32:48','2026-04-21 06:34:26'),('2f779ed0-3cce-11f1-b40f-6644b469e6fb','Kalimantan Selatan','kalimantan','Pengantin Banjar','Baju pengantin Banjar bertenun khas Kalsel',NULL,'Rp 175.000',1,22,'2026-04-20 15:32:48','2026-04-21 06:34:26'),('2f779fde-3cce-11f1-b40f-6644b469e6fb','Kalimantan Timur','kalimantan','Baju Dayak Kenyah','Pakaian adat Dayak Kenyah Kalimantan Timur',NULL,'Rp 150.000',1,23,'2026-04-20 15:32:48','2026-04-21 06:34:26'),('2f77a0f6-3cce-11f1-b40f-6644b469e6fb','Kalimantan Utara','kalimantan','Baju Bulungan','Pakaian kerajaan Bulungan Kalimantan Utara',NULL,'Rp 150.000',1,24,'2026-04-20 15:32:48','2026-04-21 06:34:26'),('2f77a20e-3cce-11f1-b40f-6644b469e6fb','Sulawesi Utara','sulawesi','Baju Adat Minahasa','Pakaian adat wanita Minahasa Sulawesi Utara',NULL,'Rp 125.000',1,25,'2026-04-20 15:32:48','2026-04-21 06:34:26'),('2f77a358-3cce-11f1-b40f-6644b469e6fb','Gorontalo','sulawesi','Baju Bili\'u','Pakaian adat Bili\'u pengantin Gorontalo',NULL,'Rp 150.000',1,26,'2026-04-20 15:32:48','2026-04-21 06:34:26'),('2f77a4a2-3cce-11f1-b40f-6644b469e6fb','Sulawesi Tengah','sulawesi','Baju Adat Kulavi','Pakaian adat suku Kulavi Sulawesi Tengah',NULL,'Rp 125.000',1,27,'2026-04-20 15:32:48','2026-04-21 06:34:26'),('2f77a5a6-3cce-11f1-b40f-6644b469e6fb','Sulawesi Barat','sulawesi','Baju Adat Mandar','Pakaian adat suku Mandar Sulawesi Barat',NULL,'Rp 125.000',1,28,'2026-04-20 15:32:48','2026-04-21 06:34:26'),('2f77a6aa-3cce-11f1-b40f-6644b469e6fb','Sulawesi Selatan','sulawesi','Baju Bodo','Baju Bodo khas Bugis-Makassar Sulawesi Selatan',NULL,'Rp 100.000',1,29,'2026-04-20 15:32:48','2026-04-21 06:34:26'),('2f77a7a4-3cce-11f1-b40f-6644b469e6fb','Sulawesi Tenggara','sulawesi','Baju Adat Tolaki','Pakaian adat suku Tolaki Sulawesi Tenggara',NULL,'Rp 125.000',1,30,'2026-04-20 15:32:48','2026-04-21 06:34:26'),('2f77a8a8-3cce-11f1-b40f-6644b469e6fb','Maluku','maluku_papua','Baju Cele','Pakaian adat Maluku bermotif geometris',NULL,'Rp 125.000',1,31,'2026-04-20 15:32:48','2026-04-21 06:34:26'),('2f77a9ac-3cce-11f1-b40f-6644b469e6fb','Maluku Utara','maluku_papua','Manteren Lamo','Pakaian kebesaran Kesultanan Ternate',NULL,'Rp 150.000',1,32,'2026-04-20 15:32:48','2026-04-21 06:34:26'),('2f77aab0-3cce-11f1-b40f-6644b469e6fb','Papua Barat','maluku_papua','Baju Adat Arfak','Pakaian adat suku Arfak Papua Barat',NULL,'Rp 125.000',1,33,'2026-04-20 15:32:48','2026-04-21 06:34:26'),('2f77ac22-3cce-11f1-b40f-6644b469e6fb','Papua','maluku_papua','Baju Adat Papua','Pakaian tradisional suku asli Papua',NULL,'Rp 125.000',1,34,'2026-04-20 15:32:48','2026-04-21 06:34:26');
/*!40000 ALTER TABLE `catalog_provinces` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gallery_items`
--

DROP TABLE IF EXISTS `gallery_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gallery_items` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `image_url` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `cross_axis_cell_count` int NOT NULL DEFAULT '2',
  `main_axis_cell_count` int NOT NULL DEFAULT '1',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gallery_items`
--

LOCK TABLES `gallery_items` WRITE;
/*!40000 ALTER TABLE `gallery_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `gallery_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `island_groups`
--

DROP TABLE IF EXISTS `island_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `island_groups` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `island_groups`
--

LOCK TABLES `island_groups` WRITE;
/*!40000 ALTER TABLE `island_groups` DISABLE KEYS */;
INSERT INTO `island_groups` VALUES ('dc08c495-3b0e-11f1-9d6d-74563ca5f64f','jawa','Jawa',1),('dc08cb05-3b0e-11f1-9d6d-74563ca5f64f','sumatera','Sumatera',2),('dc08cd30-3b0e-11f1-9d6d-74563ca5f64f','kalimantan','Kalimantan',3),('dc08ce92-3b0e-11f1-9d6d-74563ca5f64f','sulawesi','Sulawesi',4),('dc08d011-3b0e-11f1-9d6d-74563ca5f64f','bali_nusa','Bali & Nusa Tenggara',5),('dc08d20d-3b0e-11f1-9d6d-74563ca5f64f','papua','Papua',6),('e816e745-514b-11f1-9ff4-74563ca5f64f','bali_nt','Bali & Nusa Tenggara',5),('e816e9d8-514b-11f1-9ff4-74563ca5f64f','maluku_papua','Maluku & Papua',6);
/*!40000 ALTER TABLE `island_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `variant_id` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `product_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `size_label` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `color_label` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `unit_price` double NOT NULL DEFAULT '0',
  `quantity` int NOT NULL DEFAULT '1',
  `subtotal` double NOT NULL DEFAULT '0',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_order_items_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `source` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'walk_in',
  `customer_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_whatsapp` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_institution` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `handover_date` datetime DEFAULT NULL,
  `planned_return_date` datetime DEFAULT NULL,
  `actual_return_date` datetime DEFAULT NULL,
  `status` enum('pending','confirmed','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `rental_status` enum('booked','handed_over','returned','overdue') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'booked',
  `payment_status` enum('unpaid','partial','paid') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unpaid',
  `total_amount` double NOT NULL DEFAULT '0',
  `paid_amount` double NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_order_code` (`order_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `outlet_locations`
--

DROP TABLE IF EXISTS `outlet_locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `outlet_locations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `whatsapp` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `operational_hours` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_main` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `outlet_locations`
--

LOCK TABLES `outlet_locations` WRITE;
/*!40000 ALTER TABLE `outlet_locations` DISABLE KEYS */;
INSERT INTO `outlet_locations` VALUES ('88d3284a-51a4-11f1-9ff4-74563ca5f64f','Outlet Pusat Jakarta','Jl. Contoh No. 1, Kebayoran Baru, Jakarta Selatan',-6.2297,106.8049,'+6281234567890','+6281234567890','Senin - Sabtu: 08.00 - 20.00',1,1,'2026-05-17 10:57:33','2026-05-17 10:57:33'),('88d32cd9-51a4-11f1-9ff4-74563ca5f64f','Outlet Bandung','Jl. Dago No. 55, Coblong, Bandung',-6.8914,107.6102,'+6281234567891','+6281234567891','Senin - Minggu: 09.00 - 19.00',0,1,'2026-05-17 10:57:33','2026-05-17 10:57:33'),('dc0a6b30-3b0e-11f1-9d6d-74563ca5f64f','Outlet Pusat Jakarta','Jl. Contoh No. 1, Kebayoran Baru, Jakarta Selatan',-6.2297,106.8049,'+6281234567890','+6281234567890','Senin - Sabtu: 08.00 - 20.00',1,1,'2026-04-18 17:10:43','2026-04-18 17:10:43'),('dc0a7095-3b0e-11f1-9d6d-74563ca5f64f','Outlet Bandung','Jl. Dago No. 55, Coblong, Bandung',-6.8914,107.6102,'+6281234567891','+6281234567891','Senin - Minggu: 09.00 - 19.00',0,1,'2026-04-18 17:10:43','2026-04-18 17:10:43'),('e81987ee-514b-11f1-9ff4-74563ca5f64f','Outlet Pusat Jakarta','Jl. Contoh No. 1, Kebayoran Baru, Jakarta Selatan',-6.2297,106.8049,'+6281234567890','+6281234567890','Senin - Sabtu: 08.00 - 20.00',1,1,'2026-05-17 00:23:08','2026-05-17 00:23:08'),('e819cefb-514b-11f1-9ff4-74563ca5f64f','Outlet Bandung','Jl. Dago No. 55, Coblong, Bandung',-6.8914,107.6102,'+6281234567891','+6281234567891','Senin - Minggu: 09.00 - 19.00',0,1,'2026-05-17 00:23:08','2026-05-17 00:23:08');
/*!40000 ALTER TABLE `outlet_locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_product_images_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_variants`
--

DROP TABLE IF EXISTS `product_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_variants` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `size_label` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `color_label` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `stock_qty` int NOT NULL DEFAULT '0',
  `price_override` double DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_product_variants_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variants`
--

LOCK TABLES `product_variants` WRITE;
/*!40000 ALTER TABLE `product_variants` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_variants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image_url` text COLLATE utf8mb4_unicode_ci,
  `price` double NOT NULL DEFAULT '0',
  `category` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `province` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `traditional_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT '1',
  `show_in_gallery` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES ('18b02fc1-6c2d-410f-a3f0-cd05f4da1b96','tes','tes','https://api-khansakirana.widiyanto.web.id/static/products/products_1776517097_0bebd5.jpeg',100000,'atasan','','tes',1,1,'2026-04-18 12:58:21','2026-04-22 02:28:49'),('88d272d5-51a4-11f1-9ff4-74563ca5f64f','Kebaya Encim Betawi','Kebaya encim khas Betawi dengan hiasan bordir halus, cocok untuk acara pernikahan dan kondangan.','',185000,'kebaya','DKI Jakarta','Kebaya Encim',1,0,'2026-05-17 10:57:33','2026-05-17 10:57:33'),('88d277d0-51a4-11f1-9ff4-74563ca5f64f','Kebaya Kartini Jawa','Kebaya potongan Kartini dari bahan katun halus, elegant dan nyaman dipakai seharian.','',165000,'kebaya','Jawa Tengah','Kebaya Jawa',1,0,'2026-05-17 10:57:33','2026-05-17 10:57:33'),('88d27956-51a4-11f1-9ff4-74563ca5f64f','Batik Parang Solo','Batik tulis motif parang khas Solo dengan warna sogan tradisional.','',250000,'batik','Jawa Tengah','Batik Parang',1,0,'2026-05-17 10:57:33','2026-05-17 10:57:33'),('88d27a82-51a4-11f1-9ff4-74563ca5f64f','Batik Mega Mendung','Batik cap motif mega mendung khas Cirebon, hadir dalam berbagai pilihan warna cerah.','',195000,'batik','Jawa Barat','Batik Mega Mendung',1,0,'2026-05-17 10:57:33','2026-05-17 10:57:33'),('88d27be5-51a4-11f1-9ff4-74563ca5f64f','Baju Bodo Bugis','Baju bodo tradisional Bugis dari bahan sutra, tersedia dalam berbagai warna sesuai tingkatan adat.','',320000,'baju_adat','Sulawesi Selatan','Baju Bodo',1,0,'2026-05-17 10:57:33','2026-05-17 10:57:33'),('88d27ced-51a4-11f1-9ff4-74563ca5f64f','Ulos Batak Toba','Kain ulos motif ragi hotang khas Batak Toba, ditenun secara tradisional.','',280000,'kain_adat','Sumatera Utara','Ulos Ragi Hotang',1,0,'2026-05-17 10:57:33','2026-05-17 10:57:33'),('88d27deb-51a4-11f1-9ff4-74563ca5f64f','Kebaya Bali Modern','Kebaya Bali dengan sentuhan modern, cocok untuk upacara adat maupun pesta.','',210000,'kebaya','Bali','Kebaya Bali',1,0,'2026-05-17 10:57:33','2026-05-17 10:57:33'),('88d27ef1-51a4-11f1-9ff4-74563ca5f64f','Batik Kawung Yogyakarta','Batik motif kawung klasik khas Keraton Yogyakarta, dibuat dengan teknik batik tulis.','',275000,'batik','DI Yogyakarta','Batik Kawung',1,0,'2026-05-17 10:57:33','2026-05-17 10:57:33'),('88d27ff3-51a4-11f1-9ff4-74563ca5f64f','Tenun Songket Palembang','Kain songket Palembang dengan benang emas, cocok untuk acara resmi dan pernikahan adat.','',450000,'kain_adat','Sumatera Selatan','Songket Palembang',1,0,'2026-05-17 10:57:33','2026-05-17 10:57:33'),('88d281b5-51a4-11f1-9ff4-74563ca5f64f','Baju Adat Dayak','Pakaian adat Dayak dengan hiasan manik-manik tradisional, nyaman dan unik.','',380000,'baju_adat','Kalimantan Tengah','Baju Adat Dayak',1,0,'2026-05-17 10:57:33','2026-05-17 10:57:33'),('dc09a069-3b0e-11f1-9d6d-74563ca5f64f','baju adat lampung','baju adat lampung dengan kain tapis ','https://api-khansakirana.widiyanto.web.id/static/products/products_1776519512_fc44f2.jpg',150000,'atasan','DKI Jakarta','kebaya brokat',1,1,'2026-04-18 17:10:43','2026-04-26 12:48:19'),('dc09a79e-3b0e-11f1-9d6d-74563ca5f64f','Batik Parang Solo','Batik tulis motif parang khas Solo dengan warna sogan tradisional.','',250000,'batik','Jawa Tengah','Batik Parang',1,0,'2026-04-18 17:10:43','2026-04-18 17:10:43'),('dc09a897-3b0e-11f1-9d6d-74563ca5f64f','Batik Mega Mendung','Batik cap motif mega mendung khas Cirebon, hadir dalam berbagai pilihan warna cerah.','',195000,'batik','Jawa Barat','Batik Mega Mendung',1,0,'2026-04-18 17:10:43','2026-04-18 17:10:43'),('dc09a9a0-3b0e-11f1-9d6d-74563ca5f64f','Baju Bodo Bugis','Baju bodo tradisional Bugis dari bahan sutra, tersedia dalam berbagai warna sesuai tingkatan adat.','',320000,'baju_adat','Sulawesi Selatan','Baju Bodo',1,0,'2026-04-18 17:10:43','2026-04-18 17:10:43'),('dc09aaa4-3b0e-11f1-9d6d-74563ca5f64f','Ulos Batak Toba','Kain ulos motif ragi hotang khas Batak Toba, ditenun secara tradisional.','',280000,'kain_adat','Sumatera Utara','Ulos Ragi Hotang',1,0,'2026-04-18 17:10:43','2026-04-18 17:10:43'),('dc09aba8-3b0e-11f1-9d6d-74563ca5f64f','Kebaya Bali Modern','Kebaya Bali dengan sentuhan modern, cocok untuk upacara adat maupun pesta.','',210000,'kebaya','Bali','Kebaya Bali',1,0,'2026-04-18 17:10:43','2026-04-22 08:25:36'),('dc09acc0-3b0e-11f1-9d6d-74563ca5f64f','Batik Kawung Yogyakarta','Batik motif kawung klasik khas Keraton Yogyakarta, dibuat dengan teknik batik tulis.','',275000,'batik','DI Yogyakarta','Batik Kawung',1,0,'2026-04-18 17:10:43','2026-04-18 17:10:43'),('dc09ae1c-3b0e-11f1-9d6d-74563ca5f64f','Tenun Songket Palembang','Kain songket Palembang dengan benang emas, cocok untuk acara resmi dan pernikahan adat.','',450000,'kain_adat','Sumatera Selatan','Songket Palembang',1,0,'2026-04-18 17:10:43','2026-04-18 17:10:43'),('dc09af84-3b0e-11f1-9d6d-74563ca5f64f','Baju Adat Dayak','Pakaian adat Dayak dengan hiasan manik-manik tradisional, nyaman dan unik.','',380000,'baju_adat','Kalimantan Tengah','Baju Adat Dayak',1,0,'2026-04-18 17:10:43','2026-04-18 17:10:43'),('e818acba-514b-11f1-9ff4-74563ca5f64f','Kebaya Encim Betawi','Kebaya encim khas Betawi dengan hiasan bordir halus, cocok untuk acara pernikahan dan kondangan.','',185000,'kebaya','DKI Jakarta','Kebaya Encim',1,0,'2026-05-17 00:23:08','2026-05-17 00:23:08'),('e818fc6f-514b-11f1-9ff4-74563ca5f64f','Kebaya Kartini Jawa','Kebaya potongan Kartini dari bahan katun halus, elegant dan nyaman dipakai seharian.','',165000,'kebaya','Jawa Tengah','Kebaya Jawa',1,0,'2026-05-17 00:23:08','2026-05-17 00:23:08'),('e818feb2-514b-11f1-9ff4-74563ca5f64f','Batik Parang Solo','Batik tulis motif parang khas Solo dengan warna sogan tradisional.','',250000,'batik','Jawa Tengah','Batik Parang',1,0,'2026-05-17 00:23:08','2026-05-17 00:23:08'),('e8190025-514b-11f1-9ff4-74563ca5f64f','Batik Mega Mendung','Batik cap motif mega mendung khas Cirebon, hadir dalam berbagai pilihan warna cerah.','',195000,'batik','Jawa Barat','Batik Mega Mendung',1,0,'2026-05-17 00:23:08','2026-05-17 00:23:08'),('e8190125-514b-11f1-9ff4-74563ca5f64f','Baju Bodo Bugis','Baju bodo tradisional Bugis dari bahan sutra, tersedia dalam berbagai warna sesuai tingkatan adat.','',320000,'baju_adat','Sulawesi Selatan','Baju Bodo',1,0,'2026-05-17 00:23:08','2026-05-17 00:23:08'),('e8190593-514b-11f1-9ff4-74563ca5f64f','Ulos Batak Toba','Kain ulos motif ragi hotang khas Batak Toba, ditenun secara tradisional.','',280000,'kain_adat','Sumatera Utara','Ulos Ragi Hotang',1,0,'2026-05-17 00:23:08','2026-05-17 00:23:08'),('e8190691-514b-11f1-9ff4-74563ca5f64f','Kebaya Bali Modern','Kebaya Bali dengan sentuhan modern, cocok untuk upacara adat maupun pesta.','',210000,'kebaya','Bali','Kebaya Bali',1,0,'2026-05-17 00:23:08','2026-05-17 00:23:08'),('e819079e-514b-11f1-9ff4-74563ca5f64f','Batik Kawung Yogyakarta','Batik motif kawung klasik khas Keraton Yogyakarta, dibuat dengan teknik batik tulis.','',275000,'batik','DI Yogyakarta','Batik Kawung',1,0,'2026-05-17 00:23:08','2026-05-17 00:23:08'),('e8190890-514b-11f1-9ff4-74563ca5f64f','Tenun Songket Palembang','Kain songket Palembang dengan benang emas, cocok untuk acara resmi dan pernikahan adat.','',450000,'kain_adat','Sumatera Selatan','Songket Palembang',1,0,'2026-05-17 00:23:08','2026-05-17 00:23:08'),('e8190982-514b-11f1-9ff4-74563ca5f64f','Baju Adat Dayak','Pakaian adat Dayak dengan hiasan manik-manik tradisional, nyaman dan unik.','',380000,'baju_adat','Kalimantan Tengah','Baju Adat Dayak',1,0,'2026-05-17 00:23:08','2026-05-17 00:23:08');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_content`
--

DROP TABLE IF EXISTS `site_content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `site_content` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `section` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'text',
  `value` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_content`
--

LOCK TABLES `site_content` WRITE;
/*!40000 ALTER TABLE `site_content` DISABLE KEYS */;
INSERT INTO `site_content` VALUES ('4182546b-cb3e-470f-9a13-1717e872478c','hero_images','hero','text','https://api-khansakirana.widiyanto.web.id/static/hero/hero_1777207387_9e7892.jpg','URL gambar hero/slideshow beranda','2026-04-26 12:43:46'),('dc0bcb98-3b0e-11f1-9d6d-74563ca5f64f','hero_title','hero','text','Keindahan Busana Nusantara','Judul utama halaman beranda','2026-04-18 17:10:43'),('dc0bd251-3b0e-11f1-9d6d-74563ca5f64f','hero_subtitle','hero','text','Sewa pakaian adat berkualitas dari seluruh penjuru Indonesia','Subjudul halaman beranda','2026-04-18 17:10:43'),('dc0bd4e3-3b0e-11f1-9d6d-74563ca5f64f','about_title','about','text','Tentang Khansa Collection','Judul halaman about','2026-04-18 17:10:43'),('dc0bd7b3-3b0e-11f1-9d6d-74563ca5f64f','about_text','about','text','Khansa Collection hadir untuk memenuhi kebutuhan busana adat Nusantara Anda. Dengan koleksi lengkap dari berbagai provinsi di Indonesia, kami siap membantu Anda tampil memukau di setiap acara spesial.','Deskripsi about','2026-04-18 17:10:43');
/*!40000 ALTER TABLE `site_content` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store_profile`
--

DROP TABLE IF EXISTS `store_profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_profile` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `store_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo_url` text COLLATE utf8mb4_unicode_ci,
  `address` text COLLATE utf8mb4_unicode_ci,
  `gmaps_link` text COLLATE utf8mb4_unicode_ci,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `whatsapp` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `instagram_url` text COLLATE utf8mb4_unicode_ci,
  `facebook_url` text COLLATE utf8mb4_unicode_ci,
  `tiktok_url` text COLLATE utf8mb4_unicode_ci,
  `operational_hours` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hero_images` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_profile`
--

LOCK TABLES `store_profile` WRITE;
/*!40000 ALTER TABLE `store_profile` DISABLE KEYS */;
INSERT INTO `store_profile` VALUES ('00000000-0000-0000-0000-000000000002','Khansa Collection','','Jl. Contoh No. 1, Jakarta Selatan','https://maps.google.com/maps?q=-6.2348,106.9714&z=16',-6.2348,106.9714,'+6281234567890','+6281234567890','https://instagram.com/khansakirana','','','Senin - Sabtu: 08.00 - 20.00','[\"/uploads/hero/cd92f939-33f2-4c61-a49f-586bf80f39a7.png\"]','2026-05-17 00:23:08','2026-05-17 11:19:45'),('dc07a661-3b0e-11f1-9d6d-74563ca5f64f','Khansa Collection','','Jl. Contoh No. 1, Jakarta Selatan','https://maps.app.goo.gl/wPUKBcxNmProhjyd8',-6.2382,106.9983,'+6281234567890','+6281234567890','https://instagram.com/khansakirana','','','Senin - Sabtu: 08.00 - 20.00','https://api-khansakirana.widiyanto.web.id/static/hero/hero_1777207387_9e7892.jpg','2026-04-18 17:10:43','2026-04-26 12:43:46');
/*!40000 ALTER TABLE `store_profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `testimonials`
--

DROP TABLE IF EXISTS `testimonials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `testimonials` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `occasion` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `review` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` double NOT NULL DEFAULT '5',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testimonials`
--

LOCK TABLES `testimonials` WRITE;
/*!40000 ALTER TABLE `testimonials` DISABLE KEYS */;
INSERT INTO `testimonials` VALUES ('88d3bf84-51a4-11f1-9ff4-74563ca5f64f','Siti Rahayu','Pernikahan Adat Jawa','Kebaya yang saya sewa sangat cantik dan sesuai ekspektasi. Pelayanan ramah dan pengiriman tepat waktu!',5,1,1,'2026-05-17 10:57:33','2026-05-17 10:57:33'),('88d3c290-51a4-11f1-9ff4-74563ca5f64f','Dewi Lestari','Wisuda Universitas','Baju adatnya bagus sekali, bahan nyaman dipakai seharian. Pasti akan sewa lagi untuk acara berikutnya.',5,1,2,'2026-05-17 10:57:33','2026-05-17 10:57:33'),('88d3c3d9-51a4-11f1-9ff4-74563ca5f64f','Rina Fitriani','Acara Kebudayaan','Koleksinya lengkap dan harganya sangat terjangkau. Kualitas kain juga tidak mengecewakan.',4.5,1,3,'2026-05-17 10:57:33','2026-05-17 10:57:33'),('c4b117c9-b840-4af3-b509-89b0d5127102','tes','tes','tes',5,1,0,'2026-04-18 13:22:25','2026-04-18 13:22:25'),('dc0b14a7-3b0e-11f1-9d6d-74563ca5f64f','Siti Rahayu','Pernikahan Adat Jawa','Kebaya yang saya sewa sangat cantik dan sesuai ekspektasi. Pelayanan ramah dan pengiriman tepat waktu!',5,1,1,'2026-04-18 17:10:43','2026-04-18 17:10:43'),('dc0b19a2-3b0e-11f1-9d6d-74563ca5f64f','Dewi Lestari','Wisuda Universitas','Baju adatnya bagus sekali, bahan nyaman dipakai seharian. Pasti akan sewa lagi untuk acara berikutnya.',5,1,2,'2026-04-18 17:10:43','2026-04-18 17:10:43'),('dc0b1b27-3b0e-11f1-9d6d-74563ca5f64f','Rina Fitriani','Acara Kebudayaan','Koleksinya lengkap dan harganya sangat terjangkau. Kualitas kain juga tidak mengecewakan.',4.5,1,3,'2026-04-18 17:10:43','2026-04-18 17:10:43'),('e81a4d7d-514b-11f1-9ff4-74563ca5f64f','Siti Rahayu','Pernikahan Adat Jawa','Kebaya yang saya sewa sangat cantik dan sesuai ekspektasi. Pelayanan ramah dan pengiriman tepat waktu!',5,1,1,'2026-05-17 00:23:08','2026-05-17 00:23:08'),('e81a8926-514b-11f1-9ff4-74563ca5f64f','Dewi Lestari','Wisuda Universitas','Baju adatnya bagus sekali, bahan nyaman dipakai seharian. Pasti akan sewa lagi untuk acara berikutnya.',5,1,2,'2026-05-17 00:23:08','2026-05-17 00:23:08'),('e81a8afc-514b-11f1-9ff4-74563ca5f64f','Rina Fitriani','Acara Kebudayaan','Koleksinya lengkap dan harganya sangat terjangkau. Kualitas kain juga tidak mengecewakan.',4.5,1,3,'2026-05-17 00:23:08','2026-05-17 00:23:08');
/*!40000 ALTER TABLE `testimonials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'khansa_collection'
--

--
-- Dumping routines for database 'khansa_collection'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-16 23:00:13
