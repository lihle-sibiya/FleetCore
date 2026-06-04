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
-- Table structure for table `dealership_customers`
--

DROP TABLE IF EXISTS `dealership_customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dealership_customers` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `dealership_id` int unsigned NOT NULL,
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_number` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_dc_dealership` (`dealership_id`),
  CONSTRAINT `fk_dc_dealership` FOREIGN KEY (`dealership_id`) REFERENCES `dealerships` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dealership_customers`
--

LOCK TABLES `dealership_customers` WRITE;
/*!40000 ALTER TABLE `dealership_customers` DISABLE KEYS */;
INSERT INTO `dealership_customers` VALUES (1,1,'Bongani','Dlamini','9404199527182','0720837890','bongani@mzansimotors.co.za','2026-06-02 06:54:21'),(2,1,'Lungelo','Nkosi','7808165293198','0740322408','lungelo@mzansimotors.co.za','2026-06-02 06:54:21'),(3,2,'Nomvula','Nkosi','9805187753170','0727607607','nomvula@capeautogroup.co.za','2026-06-02 06:54:21'),(4,2,'Gerhard','Sithole','7211259278172','0733138439','gerhard@capeautogroup.co.za','2026-06-02 06:54:21'),(5,2,'Nomvula','Dlamini','7212275184126','0782590558','nomvula@capeautogroup.co.za','2026-06-02 06:54:21'),(6,2,'Lerato','Petersen','9309106973161','0793890909','lerato@capeautogroup.co.za','2026-06-02 06:54:21'),(7,3,'Thabo','Adams','7304256787196','0733637677','thabo@durbandrivecentre.co.za','2026-06-02 06:54:21'),(8,3,'Anita','Botha','9706255937107','0780845962','anita@durbandrivecentre.co.za','2026-06-02 06:54:21'),(9,3,'Ruan','Dlamini','6411176832131','0738449260','ruan@durbandrivecentre.co.za','2026-06-02 06:54:21'),(10,3,'Priya','van Rooyen','6004179538178','0756525304','priya@durbandrivecentre.co.za','2026-06-02 06:54:21'),(11,4,'Bongani','Botha','9208185841122','0740839718','bongani@highveldautoptyltd.co.za','2026-06-02 06:54:21'),(12,4,'Lungelo','Sithole','6304145060130','0747227020','lungelo@highveldautoptyltd.co.za','2026-06-02 06:54:21'),(13,4,'Ruan','Petersen','8107218340118','0756980567','ruan@highveldautoptyltd.co.za','2026-06-02 06:54:21'),(14,4,'Gerhard','Petersen','7905208395190','0737439049','gerhard@highveldautoptyltd.co.za','2026-06-02 06:54:21'),(15,5,'Lungelo','Botha','6008179297160','0762088680','lungelo@coastalcarsales.co.za','2026-06-02 06:54:21'),(16,5,'Anita','Nkosi','8911265901164','0750786306','anita@coastalcarsales.co.za','2026-06-02 06:54:21'),(17,5,'Bongani','Dlamini','6308039809192','0742012184','bongani@coastalcarsales.co.za','2026-06-02 06:54:21');
/*!40000 ALTER TABLE `dealership_customers` ENABLE KEYS */;
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
