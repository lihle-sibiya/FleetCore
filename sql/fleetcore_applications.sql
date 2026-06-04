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
-- Table structure for table `applications`
--

DROP TABLE IF EXISTS `applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `applications` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `vehicle_id` int unsigned NOT NULL,
  `private_customer_id` int unsigned DEFAULT NULL,
  `dealership_customer_id` int unsigned DEFAULT NULL,
  `app_type` enum('new_registration','ownership_transfer') COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','documents_received','submitted_to_licensing','completed','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `licensing_fee_paid` decimal(10,2) DEFAULT NULL,
  `licensing_dept_ref` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `submitted_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_app_vehicle` (`vehicle_id`),
  KEY `fk_app_private_customer` (`private_customer_id`),
  KEY `fk_app_dealership_customer` (`dealership_customer_id`),
  CONSTRAINT `fk_app_dealership_customer` FOREIGN KEY (`dealership_customer_id`) REFERENCES `dealership_customers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_app_private_customer` FOREIGN KEY (`private_customer_id`) REFERENCES `private_customers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_app_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `applications`
--

LOCK TABLES `applications` WRITE;
/*!40000 ALTER TABLE `applications` DISABLE KEYS */;
INSERT INTO `applications` VALUES (1,1,3,NULL,'new_registration','completed',280.00,'LIC-54942','2026-05-23 06:54:21','2026-05-28 06:54:21','2025-06-26 06:54:21'),(2,2,2,NULL,'ownership_transfer','documents_received',NULL,NULL,NULL,NULL,'2025-06-08 06:54:21'),(3,3,4,NULL,'new_registration','completed',280.00,'LIC-52592','2026-05-30 06:54:21','2026-05-29 06:54:21','2025-08-18 06:54:21'),(4,4,1,NULL,'ownership_transfer','submitted_to_licensing',280.00,'LIC-26390','2026-05-28 06:54:21',NULL,'2026-03-14 06:54:21'),(5,5,5,NULL,'new_registration','pending',NULL,NULL,NULL,NULL,'2026-01-08 06:54:21'),(6,5,5,NULL,'ownership_transfer','completed',650.00,'LIC-64423','2026-06-01 06:54:21','2026-05-28 06:54:21','2025-07-03 06:54:21'),(7,6,6,NULL,'ownership_transfer','completed',560.00,'LIC-54943','2026-05-25 06:54:21','2026-06-01 06:54:21','2025-09-20 06:54:21'),(8,7,7,NULL,'ownership_transfer','completed',650.00,'LIC-64487','2026-05-24 06:54:21','2026-06-01 06:54:21','2026-03-27 06:54:21'),(9,7,7,NULL,'new_registration','completed',560.00,'LIC-46813','2026-05-24 06:54:21','2026-06-01 06:54:21','2026-02-07 06:54:21'),(10,7,7,NULL,'new_registration','pending',NULL,NULL,NULL,NULL,'2025-09-08 06:54:21'),(11,8,8,NULL,'new_registration','completed',560.00,'LIC-51617','2026-05-29 06:54:21','2026-05-28 06:54:21','2025-08-08 06:54:21'),(12,8,8,NULL,'ownership_transfer','documents_received',NULL,NULL,NULL,NULL,'2025-06-26 06:54:21'),(13,9,9,NULL,'ownership_transfer','completed',280.00,'LIC-66262','2026-05-26 06:54:21','2026-05-28 06:54:21','2026-04-27 06:54:21'),(14,10,10,NULL,'new_registration','submitted_to_licensing',480.00,'LIC-51683','2026-06-01 06:54:21',NULL,'2025-12-05 06:54:21'),(15,11,NULL,1,'new_registration','pending',NULL,NULL,NULL,NULL,'2025-12-08 06:54:21'),(16,12,NULL,2,'new_registration','pending',NULL,NULL,NULL,NULL,'2025-10-14 06:54:21'),(17,12,NULL,2,'ownership_transfer','completed',650.00,'LIC-10131','2026-05-27 06:54:21','2026-05-28 06:54:21','2026-02-25 06:54:21'),(18,13,NULL,3,'ownership_transfer','completed',280.00,'LIC-65882','2026-05-29 06:54:21','2026-05-30 06:54:21','2025-10-13 06:54:21'),(19,14,NULL,4,'new_registration','documents_received',NULL,NULL,NULL,NULL,'2025-09-29 06:54:21'),(20,14,NULL,4,'ownership_transfer','completed',650.00,'LIC-74768','2026-05-26 06:54:22','2026-05-29 06:54:22','2026-02-20 06:54:22'),(21,15,NULL,5,'ownership_transfer','completed',280.00,'LIC-82953','2026-06-01 06:54:22','2026-06-01 06:54:22','2025-11-11 06:54:22'),(22,16,NULL,6,'ownership_transfer','submitted_to_licensing',280.00,'LIC-30527','2026-05-31 06:54:22',NULL,'2025-06-26 06:54:22'),(23,16,NULL,6,'new_registration','completed',280.00,'LIC-56243','2026-05-23 06:54:22','2026-05-30 06:54:22','2025-12-03 06:54:22'),(24,16,NULL,6,'ownership_transfer','submitted_to_licensing',480.00,'LIC-99094','2026-05-24 06:54:22',NULL,'2026-01-31 06:54:22'),(25,17,NULL,7,'new_registration','pending',NULL,NULL,NULL,NULL,'2026-01-30 06:54:22'),(26,17,NULL,7,'new_registration','completed',480.00,'LIC-46124','2026-05-25 06:54:22','2026-06-01 06:54:22','2025-10-31 06:54:22'),(27,18,NULL,8,'ownership_transfer','completed',650.00,'LIC-58846','2026-05-27 06:54:22','2026-05-29 06:54:22','2025-07-04 06:54:22'),(28,19,NULL,9,'ownership_transfer','completed',560.00,'LIC-38272','2026-05-26 06:54:22','2026-05-31 06:54:22','2026-05-08 06:54:22'),(29,19,NULL,9,'ownership_transfer','pending',NULL,NULL,NULL,NULL,'2026-04-08 06:54:22'),(30,19,NULL,9,'new_registration','submitted_to_licensing',280.00,'LIC-41018','2026-06-01 06:54:22',NULL,'2025-09-06 06:54:22'),(31,20,NULL,10,'new_registration','submitted_to_licensing',480.00,'LIC-49244','2026-05-30 06:54:22',NULL,'2025-08-15 06:54:22'),(32,21,NULL,11,'new_registration','completed',650.00,'LIC-56570','2026-05-26 06:54:22','2026-05-28 06:54:22','2026-05-11 06:54:22'),(33,22,NULL,12,'ownership_transfer','completed',650.00,'LIC-17211','2026-05-24 06:54:22','2026-05-28 06:54:22','2025-10-26 06:54:22'),(34,23,NULL,13,'ownership_transfer','completed',280.00,'LIC-57338','2026-05-29 06:54:22','2026-06-01 06:54:22','2026-02-16 06:54:22'),(35,24,NULL,14,'ownership_transfer','documents_received',NULL,NULL,NULL,NULL,'2026-05-23 06:54:22'),(36,25,NULL,15,'new_registration','documents_received',NULL,NULL,NULL,NULL,'2025-12-17 06:54:22'),(37,25,NULL,15,'new_registration','documents_received',NULL,NULL,NULL,NULL,'2026-03-12 06:54:22');
/*!40000 ALTER TABLE `applications` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-02 16:46:19
