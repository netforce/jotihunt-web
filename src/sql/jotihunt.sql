-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Oct 17, 2014 at 04:06 PM
-- Server version: 5.5.40-0ubuntu0.14.04.1
-- PHP Version: 5.5.9-1ubuntu4.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `jotihunt`
--

-- --------------------------------------------------------

--
-- Table structure for table `activiteiten`
--

CREATE TABLE IF NOT EXISTS `activiteiten` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uur` int(11) NOT NULL,
  `deelnemer` int(11) NOT NULL,
  `type` char(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `deelnemer` (`deelnemer`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=101 ;

--
-- Dumping data for table `activiteiten`
--

INSERT INTO `activiteiten` (`id`, `uur`, `deelnemer`, `type`) VALUES
(20, 10, 25, 'H'),
(21, 11, 25, 'H'),
(22, 12, 25, 'H'),
(23, 13, 25, 'H'),
(24, 22, 25, 'H'),
(25, 23, 25, 'H'),
(26, 24, 25, 'H'),
(27, 0, 25, 'A'),
(28, 1, 25, 'A'),
(29, 2, 25, 'A'),
(30, 3, 25, 'A'),
(31, 4, 25, 'A'),
(32, 5, 25, 'O'),
(33, 6, 25, 'A'),
(34, 7, 25, 'A'),
(35, 8, 25, 'A'),
(36, 9, 25, 'A'),
(37, 14, 25, 'A'),
(38, 15, 25, 'S'),
(39, 16, 25, 'S'),
(40, 17, 25, 'S'),
(41, 18, 25, 'S'),
(42, 19, 25, 'S'),
(43, 20, 25, 'S'),
(44, 21, 25, 'A'),
(45, 25, 25, 'A'),
(46, 26, 25, 'A'),
(47, 27, 25, 'A'),
(48, 28, 25, 'A'),
(49, 29, 25, 'A'),
(50, 13, 28, 'H'),
(51, 14, 28, 'H'),
(52, 15, 28, 'H'),
(53, 16, 28, 'H'),
(54, 17, 28, 'H'),
(55, 0, 28, 'A'),
(56, 1, 28, 'A'),
(57, 2, 28, 'A'),
(58, 3, 28, 'A'),
(59, 4, 28, 'A'),
(60, 5, 28, 'A'),
(61, 6, 28, 'A'),
(62, 7, 28, 'A'),
(63, 8, 28, 'A'),
(64, 9, 28, 'A'),
(65, 10, 28, 'A'),
(66, 11, 28, 'A'),
(67, 12, 28, 'A'),
(68, 18, 28, 'A'),
(69, 29, 28, 'H'),
(70, 28, 28, 'H'),
(71, 27, 28, 'H'),
(72, 19, 28, 'A'),
(73, 20, 28, 'A'),
(74, 21, 28, 'A'),
(75, 22, 28, 'A'),
(76, 23, 28, 'A'),
(77, 24, 28, 'A'),
(78, 25, 28, 'A'),
(79, 26, 28, 'A'),
(80, 0, 29, 'A'),
(81, 0, 53, 'P'),
(82, 1, 29, 'A'),
(83, 2, 29, 'A'),
(84, 3, 29, 'A'),
(85, 4, 29, 'A'),
(86, 5, 29, 'A'),
(87, 6, 29, 'A'),
(88, 7, 29, 'A'),
(89, 8, 29, 'A'),
(90, 9, 29, 'A'),
(91, 10, 29, 'A'),
(92, 11, 29, 'A'),
(93, 12, 29, 'A'),
(94, 13, 29, 'A'),
(95, 14, 29, 'A'),
(96, 15, 29, 'A'),
(97, 16, 29, 'A'),
(98, 17, 29, 'A'),
(99, 18, 29, 'A'),
(100, 19, 29, 'A');

-- --------------------------------------------------------

--
-- Table structure for table `autoritten`
--

CREATE TABLE IF NOT EXISTS `autoritten` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chauffeur` int(11) NOT NULL,
  `bijrijder_1` int(11) DEFAULT NULL,
  `bijrijder_2` int(11) DEFAULT NULL,
  `bijrijder_3` int(11) DEFAULT NULL,
  `deelgebied` char(1) NOT NULL,
  `instamapper` tinyint(11) NOT NULL,
  `weer_terug` tinyint(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `chauffeur` (`chauffeur`),
  KEY `bijrijder_1` (`bijrijder_1`),
  KEY `bijrijder_2` (`bijrijder_2`),
  KEY `bijrijder_3` (`bijrijder_3`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

-- --------------------------------------------------------

--
-- Table structure for table `deelnemers`
--

CREATE TABLE IF NOT EXISTS `deelnemers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `naam` varchar(100) NOT NULL,
  `telefoonnummer` varchar(10) NOT NULL,
  `chauffeur` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=54 ;

--
-- Dumping data for table `deelnemers`
--

INSERT INTO `deelnemers` (`id`, `naam`, `telefoonnummer`, `chauffeur`) VALUES
(25, 'Ruben', '0649878365', 1),
(28, 'Martijn', '0631978460', 1),
(29, 'Eelco', '0613474889', 0),
(30, 'Wesley', '0616998726', 0),
(31, 'Rik', '0647591804', 0),
(32, 'Irene', '0657809526', 0),
(33, 'Allard', '0634424123', 1),
(34, 'Jeroen', '0642238303', 1),
(35, 'Onno', '0642013024', 1),
(36, 'Annemieke', '0681728281', 0),
(37, 'Erika', '0644955758', 0),
(38, 'Emil', '0620223972', 0),
(39, 'Luc', '0620228084', 0),
(41, 'Jurjen', '0652147095', 0),
(42, 'Jesse', '0633706640', 1),
(43, 'Bernard', '0627204149', 0),
(44, 'Jasper', '0611565667', 1),
(45, 'Cynthia', '0619885100', 0),
(46, 'Bram', '0610724744', 0),
(47, 'Eliza', '0630182900', 0),
(50, 'Inge', '0634893125', 1),
(51, 'Pim', '0630595655', 1),
(52, 'Koen', '0623808360', 1),
(53, 'Suzanne', '0649839648', 1);

-- --------------------------------------------------------

--
-- Table structure for table `foto_opdrachten`
--

CREATE TABLE IF NOT EXISTS `foto_opdrachten` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `locatie` varchar(100) NOT NULL,
  `status` char(1) NOT NULL,
  `punten` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

-- --------------------------------------------------------

--
-- Table structure for table `hints`
--

CREATE TABLE IF NOT EXISTS `hints` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hintnaam` varchar(100) NOT NULL,
  `tijdstip` datetime NOT NULL,
  `alpha_opgelost` tinyint(4) NOT NULL,
  `bravo_opgelost` tinyint(4) NOT NULL,
  `charlie_opgelost` tinyint(4) NOT NULL,
  `delta_opgelost` tinyint(4) NOT NULL,
  `echo_opgelost` tinyint(4) NOT NULL,
  `foxtrot_opgelost` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

-- --------------------------------------------------------

--
-- Table structure for table `hunts`
--

CREATE TABLE IF NOT EXISTS `hunts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vossenteam` char(1) NOT NULL,
  `vossencode` varchar(100) NOT NULL,
  `tijdstip` datetime NOT NULL,
  `locatie` varchar(100) NOT NULL,
  `status` char(1) NOT NULL,
  `punten` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=10 ;

-- --------------------------------------------------------

--
-- Table structure for table `opdrachten`
--

CREATE TABLE IF NOT EXISTS `opdrachten` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `coordinator` int(11) NOT NULL,
  `deadline` datetime NOT NULL,
  `status` char(1) NOT NULL,
  `punten` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `coordinator` (`coordinator`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `opdrachten`
--

INSERT INTO `opdrachten` (`id`, `coordinator`, `deadline`, `status`, `punten`) VALUES
(2, 29, '2014-10-13 00:01:00', 'G', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tegenhunts`
--

CREATE TABLE IF NOT EXISTS `tegenhunts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gebeurtenis` varchar(100) NOT NULL,
  `tijdstip` datetime NOT NULL,
  `punten` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

-- --------------------------------------------------------

--
-- Table structure for table `vossenlocaties`
--

CREATE TABLE IF NOT EXISTS `vossenlocaties` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `coordinaat` varchar(20) NOT NULL,
  `adres` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `vossenlocaties`
--

INSERT INTO `vossenlocaties` (`id`, `coordinaat`, `adres`) VALUES
(6, '52.05210, 5.65575', '');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activiteiten`
--
ALTER TABLE `activiteiten`
  ADD CONSTRAINT `deelnemer_activiteit` FOREIGN KEY (`deelnemer`) REFERENCES `deelnemers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `autoritten`
--
ALTER TABLE `autoritten`
  ADD CONSTRAINT `bijrijder_1_autorit` FOREIGN KEY (`bijrijder_1`) REFERENCES `deelnemers` (`id`) ON DELETE SET NULL ON UPDATE SET NULL,
  ADD CONSTRAINT `bijrijder_2_autorit` FOREIGN KEY (`bijrijder_2`) REFERENCES `deelnemers` (`id`) ON DELETE SET NULL ON UPDATE SET NULL,
  ADD CONSTRAINT `bijrijder_3_autorit` FOREIGN KEY (`bijrijder_3`) REFERENCES `deelnemers` (`id`) ON DELETE SET NULL ON UPDATE SET NULL,
  ADD CONSTRAINT `chauffeur_autorit` FOREIGN KEY (`chauffeur`) REFERENCES `deelnemers` (`id`);

--
-- Constraints for table `opdrachten`
--
ALTER TABLE `opdrachten`
  ADD CONSTRAINT `coordinator_opdracht` FOREIGN KEY (`coordinator`) REFERENCES `deelnemers` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
