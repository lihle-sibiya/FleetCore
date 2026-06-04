CREATE DATABASE  IF NOT EXISTS `fleetcore` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `fleetcore`;
-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: fleetcore
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `private_customers`
--

DROP TABLE IF EXISTS `private_customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `private_customers` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_number` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_number` (`id_number`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `private_customers`
--

LOCK TABLES `private_customers` WRITE;
/*!40000 ALTER TABLE `private_customers` DISABLE KEYS */;
INSERT INTO `private_customers` VALUES (1,'Anita','Adams','8305175089108','0758910471','anita.adams@gmail.com','123 Church St, Cape Town','2026-06-02 06:54:21'),(2,'Priya','van Rooyen','6104019981117','0763280658','priya.van_rooyen@gmail.com','200 Church St, Cape Town','2026-06-02 06:54:21'),(3,'Ruan','Khumalo','6905215267147','0789688581','ruan.khumalo@gmail.com','48 Oxford Rd, Cape Town','2026-06-02 06:54:21'),(4,'Sipho','Meyer','9004099793108','0777960915','sipho.meyer@gmail.com','99 Church St, Cape Town','2026-06-02 06:54:21'),(5,'Anita','Cele','7609048943132','0725339373','anita.cele@gmail.com','133 Long St, Cape Town','2026-06-02 06:54:21'),(6,'Lerato','Cele','8411065286134','0746858730','lerato.cele@gmail.com','120 Main Rd, Cape Town','2026-06-02 06:54:21'),(7,'Lungelo','Dlamini','6110157252127','0727240744','lungelo.dlamini@gmail.com','129 Main Rd, Cape Town','2026-06-02 06:54:21'),(8,'Lerato','Meyer','8411097090166','0764773914','lerato.meyer@gmail.com','174 Church St, Cape Town','2026-06-02 06:54:21'),(9,'Lerato','van Rooyen','9307095485148','0718469914','lerato.van_rooyen@gmail.com','112 Main Rd, Cape Town','2026-06-02 06:54:21'),(10,'Lerato','van Rooyen','6303265753188','0795475929','lerato.van_rooyen@gmail.com','156 Church St, Cape Town','2026-06-02 06:54:21'),(11,'Priya','Petersen','8303159301157','0757628173','priya.petersen@gmail.com','169 Long St, Cape Town','2026-06-02 06:54:21'),(12,'Priya','Petersen','7601169839117','0725056984','priya.petersen@gmail.com','118 Oxford Rd, Cape Town','2026-06-02 06:54:21');
/*!40000 ALTER TABLE `private_customers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-02 16:46:20
