-- phpMyAdmin SQL Dump
-- version 3.4.5deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Mar 23, 2014 at 09:09 AM
-- Server version: 5.1.58
-- PHP Version: 5.3.6-13ubuntu3.10

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `hinter`
--

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE IF NOT EXISTS `category` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(1000) NOT NULL,
  `order` int(11) NOT NULL,
  `parentId` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `category_parentId` (`parentId`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `title`, `description`, `order`, `parentId`) VALUES
(1, 'Категория 1', 'Некоторая категория 1', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `mainanswer`
--

CREATE TABLE IF NOT EXISTS `mainanswer` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(1000) NOT NULL,
  `questionId` int(10) unsigned NOT NULL,
  `createDate` int(10) unsigned NOT NULL,
  `order` int(11) NOT NULL,
  `userId` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `mainanswer_questionId` (`questionId`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `mainanswer`
--

INSERT INTO `mainanswer` (`id`, `title`, `description`, `questionId`, `createDate`, `order`, `userId`) VALUES
(1, 'Ответ 1', 'Основной ответ', 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `mainquestion`
--

CREATE TABLE IF NOT EXISTS `mainquestion` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(1000) NOT NULL,
  `parentId` int(10) unsigned NOT NULL,
  `createDate` int(10) unsigned NOT NULL,
  `userId` int(10) unsigned NOT NULL,
  `categoryId` int(10) unsigned NOT NULL,
  `order` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `mainquestion_parentId` (`parentId`),
  KEY `mainquestion_userId` (`userId`),
  KEY `mainquestion_categoryId` (`categoryId`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=10 ;

--
-- Dumping data for table `mainquestion`
--

INSERT INTO `mainquestion` (`id`, `title`, `description`, `parentId`, `createDate`, `userId`, `categoryId`, `order`) VALUES
(1, '___?', 'Подробный текст на тему какой ноутбук купить было бы круче', 2, 0, 0, 1, 3),
(3, 'abc', 'descr', 0, 0, 0, 0, 0),
(4, '', 'descr', 0, 0, 0, 0, 0),
(5, 'abc', 'descr', 0, 0, 2, 1, 0),
(6, '', 'descr', 0, 0, 0, 0, 0),
(7, '___?', '123456', 2, 0, 0, 1, 3);

-- --------------------------------------------------------

--
-- Table structure for table `secondaryanswer`
--

CREATE TABLE IF NOT EXISTS `secondaryanswer` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(1000) NOT NULL,
  `questionId` int(10) unsigned NOT NULL,
  `createDate` int(10) unsigned NOT NULL,
  `order` int(11) NOT NULL,
  `userId` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `secondaryanswer_questionId` (`questionId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `secondaryquestion`
--

CREATE TABLE IF NOT EXISTS `secondaryquestion` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(1000) NOT NULL,
  `parentId` int(10) unsigned NOT NULL,
  `createDate` int(10) unsigned NOT NULL,
  `userId` int(10) unsigned NOT NULL,
  `categoryId` int(10) unsigned NOT NULL,
  `order` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `secondaryquestion_parentId` (`parentId`),
  KEY `secondaryquestion_userId` (`userId`),
  KEY `secondaryquestion_categoryId` (`categoryId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `login` varchar(20) NOT NULL,
  `password` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `session` varchar(32) NOT NULL,
  `role` int(11) NOT NULL DEFAULT '0',
  `createdate` int(11) NOT NULL,
  `logindate` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `login` (`login`),
  UNIQUE KEY `session` (`session`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=45 ;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `login`, `password`, `email`, `session`, `role`, `createdate`, `logindate`) VALUES
(44, 'user', 'a5ebc0ddd7c65efbddd9', 'user', 'PG/ttMuRwXnD3B0vUHvKggxMZXaj', 0, 1395310436, 1395310436),
(43, 'admin', 'c5a8a6b75685da2b599c', 'admin', 'VaM+X5WsASAbVIyVn3PMF0Kezsxw', 2, 1395310436, 1395310436);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
