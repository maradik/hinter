-- phpMyAdmin SQL Dump
-- version 3.4.5deb1
-- http://www.phpmyadmin.net
--
-- Хост: localhost
-- Время создания: Апр 04 2014 г., 22:46
-- Версия сервера: 5.1.58
-- Версия PHP: 5.3.6-13ubuntu3.10

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- База данных: `hinter`
--

-- --------------------------------------------------------

--
-- Структура таблицы `category`
--

CREATE TABLE IF NOT EXISTS `category` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(1000) NOT NULL,
  `order` int(11) NOT NULL,
  `parentId` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `category_parentId` (`parentId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=8 ;

--
-- Дамп данных таблицы `category`
--

INSERT INTO `category` (`id`, `title`, `description`, `order`, `parentId`) VALUES
(4, 'Автомобили', 'Автомобили, мотоциклы', 1, 0),
(5, 'Дом, семья', 'Дом, семья, отношения', 2, 0),
(6, 'Компьютеры', 'Компьютерная техника', 3, 0),
(7, 'Животные', 'Животные, рыбы', 4, 0);

-- --------------------------------------------------------

--
-- Структура таблицы `mainanswer`
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=96 ;

--
-- Дамп данных таблицы `mainanswer`
--

INSERT INTO `mainanswer` (`id`, `title`, `description`, `questionId`, `createDate`, `order`, `userId`) VALUES
(3, 'Главный ответ 1.1', 'Главный ответ 1.1 - описание', 10, 0, 0, 44),
(4, 'Главный ответ 1.2', 'Главный ответ 1.2 - описание', 10, 0, 0, 44),
(5, 'Главный ответ 2.1', 'Главный ответ 2.1 - описание', 11, 0, 0, 44),
(6, 'Главный ответ 2.2', 'Главный ответ 2.2 - описание', 11, 0, 0, 44),
(7, '111', '111', 37, 0, 0, 0),
(8, '111', '222', 38, 0, 0, 0),
(9, 'tyuty', 'tyutyu', 39, 0, 0, 0),
(10, 'sdfgsdg', 'dfgsdfgsd', 44, 0, 0, 0),
(11, 'dfgdfg', 'dfgsdgsdg', 44, 0, 0, 0),
(12, 'hgfdhdf', 'hdfhdfhdfh', 44, 0, 0, 0),
(13, 'dfhdf', 'sdfgsdg', 44, 0, 0, 0),
(14, 'sdfg', 'sdfg', 44, 0, 0, 0),
(15, 'dsfg', 'dsfg', 44, 0, 0, 0),
(16, '', '', 45, 0, 0, 0),
(17, 'df', 'df', 45, 0, 0, 0),
(18, 'asdfsdf', 'sdafasdf', 46, 0, 0, 0),
(19, 'sdgdsfg', 'sdgsdg', 47, 0, 0, 0),
(20, 'sdgsdg', 'sdfgsdfg', 48, 0, 0, 0),
(21, 'dsgsdf', 'dfgsd', 49, 0, 0, 0),
(22, 'wetewr', 'wertwert', 50, 0, 0, 0),
(23, 'dfgdf', 'dfgdfg', 52, 0, 0, 0),
(24, 'dfgdg', 'dfgdg', 52, 0, 0, 0),
(25, 'dfhdg', 'dfgdfgdg', 53, 0, 0, 0),
(26, 'dgdfg', 'dfgdfgd', 53, 0, 0, 0),
(27, 'dgdfg', 'dfgdfg', 53, 0, 0, 0),
(28, 'rewwe', 'wewer', 63, 0, 0, 0),
(29, 'werwer', 'wrew', 63, 0, 0, 0),
(30, '', '', 63, 0, 0, 0),
(31, '', '', 63, 0, 0, 0),
(32, '111', '', 65, 0, 0, 0),
(33, '333', '', 65, 0, 0, 0),
(34, '444', '', 65, 0, 0, 0),
(35, '222', '', 65, 0, 0, 0),
(36, '111', '', 66, 0, 0, 0),
(37, '222', '', 66, 0, 0, 0),
(38, '555', '', 66, 0, 0, 0),
(39, '333', '', 66, 0, 0, 0),
(40, '444', '', 66, 0, 0, 0),
(41, 'asdf', '', 67, 0, 0, 0),
(42, '', '', 68, 0, 0, 0),
(43, 'asdf', 'sdaf', 69, 0, 0, 0),
(44, 'asdf', 'asdf', 69, 0, 0, 0),
(45, '', '', 70, 0, 0, 0),
(46, '', '', 71, 0, 0, 0),
(47, '', '', 72, 0, 0, 0),
(48, '', '', 73, 0, 0, 0),
(49, 'asd', 'asd', 74, 0, 0, 0),
(50, 'B', 'B', 75, 0, 0, 0),
(51, 'A', 'A', 75, 0, 0, 0),
(52, '', '', 76, 0, 0, 0),
(53, 'ewtwe', 'wet', 77, 0, 0, 0),
(54, 'wert', 'wert', 77, 0, 0, 0),
(55, 'wert', 'wert', 77, 0, 0, 0),
(56, 'wert', 'wert', 77, 0, 0, 0),
(57, 'wert', 'wert', 77, 0, 0, 0),
(58, '', '', 78, 0, 0, 0),
(59, '', '', 79, 0, 0, 0),
(60, 'asdf', 'asdf', 80, 0, 0, 0),
(61, 'asdf', 'asdf', 80, 0, 0, 0),
(62, 'afd', 'asdf', 80, 0, 0, 0),
(63, '', '', 80, 0, 0, 0),
(64, 'asdf', 'asdf', 80, 0, 0, 0),
(65, 'Основной ответ1', 'Основной ответ1 - описание', 81, 0, 0, 0),
(66, 'Основной ответ3', 'Основной ответ3 - описание', 81, 0, 0, 0),
(67, 'Основной ответ2', 'Основной ответ2 - описание', 81, 0, 0, 0),
(68, 'Основной ответ4', 'Основной ответ4 - описание', 81, 0, 0, 0),
(69, 'aaa', 'aaa', 82, 0, 0, 0),
(70, 'asdfasd', 'asdfaf', 82, 0, 0, 0),
(71, 'asdfas', 'asasdf', 82, 0, 0, 0),
(72, 'dfhdfg', 'fdhdfh', 83, 0, 0, 0),
(73, 'try', 'y', 84, 0, 0, 0),
(74, 'eryr', 'eryer', 85, 0, 0, 0),
(75, '123412412', '', 86, 0, 0, 0),
(76, '123412', '', 86, 0, 0, 0),
(77, 'sdf', 'fdgs', 87, 0, 0, 0),
(78, '', '', 88, 0, 0, 0),
(79, '', '', 89, 0, 0, 0),
(80, '', '', 90, 0, 0, 0),
(81, '', '', 91, 0, 0, 0),
(82, '', '', 92, 0, 0, 0),
(83, 'asdf', '', 93, 0, 0, 0),
(84, 'fsdg', 'sdfg', 94, 0, 0, 0),
(85, '', '', 95, 0, 0, 0),
(86, 'rtwetwe', '', 96, 0, 0, 0),
(87, '1111111', '', 97, 0, 0, 0),
(88, '1111111', '', 97, 0, 0, 0),
(89, '1111111', '', 97, 0, 0, 0),
(90, 'Ответ1', '', 98, 0, 0, 0),
(91, 'Ответ2', '', 98, 0, 0, 0),
(92, 'Ответ3', '', 98, 0, 0, 0),
(93, 'aaa', 'aaa', 99, 0, 0, 0),
(94, 'bbb', 'bbb', 99, 0, 1, 0),
(95, 'ccc', 'ccc', 99, 0, 2, 0);

-- --------------------------------------------------------

--
-- Структура таблицы `mainquestion`
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=100 ;

--
-- Дамп данных таблицы `mainquestion`
--

INSERT INTO `mainquestion` (`id`, `title`, `description`, `parentId`, `createDate`, `userId`, `categoryId`, `order`) VALUES
(10, 'Главный вопрос 1', 'Главный вопрос 1 - описание', 0, 0, 44, 4, 0),
(11, 'Главный вопрос 2', 'Главный вопрос 2 - описание', 0, 0, 44, 5, 0),
(12, 'Главный вопрос 3', 'Описание главного вопроса 3', 0, 0, 44, 4, 3),
(13, 'Главный вопрос 4', 'Описание главного вопроса 4', 0, 0, 44, 4, 4),
(16, 'Сaм вопрос', 'Поясняющя информaция к вопросу', 0, 1396351108, 44, 5, 0),
(17, 'ertrt', 'erert', 0, 1396352203, 44, 4, 0),
(18, 'Вопросег', 'Вопрос с ормы', 0, 1396410181, 44, 7, 0),
(19, 'AAAA', 'BBB', 0, 1396423668, 44, 7, 0),
(20, 'ggg', 'ggg', 0, 1396431636, 44, 7, 0),
(21, 'hhh', 'hhh', 0, 1396431673, 44, 7, 0),
(22, 'jjj', 'jjj', 0, 1396431747, 44, 7, 0),
(23, 'dfhdfh', 'fghdfh', 0, 1396432172, 44, 7, 0),
(24, 'asdfasf', 'asfasf', 0, 1396432658, 44, 0, 0),
(25, 'eryre', 'tryrt', 0, 1396433637, 44, 7, 0),
(26, 'dsfgsdfg', 'dfsgdsfgs', 0, 1396433736, 44, 7, 0),
(27, 'werwerewwerwe', 'werwerwerwe', 0, 1396435660, 44, 7, 0),
(28, 'asdf', 'asdf', 0, 1396437069, 44, 7, 0),
(29, 'wertwe', 'wertwer', 0, 1396437169, 44, 7, 0),
(30, 'wertwert', 'ewrtwert', 0, 1396437275, 44, 7, 0),
(31, 'aaa', 'aaa', 0, 1396437784, 44, 7, 0),
(32, 'wetwet', 'wertwer', 0, 1396437857, 44, 7, 0),
(33, 'tyityi', 'iyui', 0, 1396437945, 44, 7, 0),
(34, 'asdfasd', 'sdfasfa', 0, 1396438028, 44, 7, 0),
(35, '123123', '123123', 0, 1396490554, 44, 7, 0),
(36, 'sdfsd', 'sdfsd', 0, 1396491255, 44, 7, 0),
(37, 'dasfasdf', 'asdfasf', 0, 1396491691, 44, 7, 0),
(38, 'wertwert', 'erwtwe', 0, 1396491788, 44, 7, 0),
(39, 'dsdff', 'sdfsdf', 0, 1396492365, 44, 7, 0),
(40, 'gh', 'ghjgh', 0, 1396492547, 44, 7, 0),
(41, 'fgjfggj', 'fgjfgj', 0, 1396505561, 44, 7, 0),
(42, 'tfh', 'dgdf', 0, 1396507389, 44, 7, 0),
(43, 'sdfsd', 'sdfsdf', 0, 1396508778, 44, 7, 0),
(44, 'sdfgsdfg', 'dsgdsg', 0, 1396509725, 44, 7, 0),
(45, 'asda', 'asda', 0, 1396510313, 44, 7, 0),
(46, 'dsgsd', 'sdgsdf', 0, 1396511127, 44, 7, 0),
(47, 'sdgsd', 'dsgsd', 0, 1396522922, 44, 7, 0),
(48, 'fgasdg', 'sdgsdfg', 0, 1396523081, 44, 7, 0),
(49, 'sdfgdsf', 'dfgdsg', 0, 1396523102, 44, 7, 0),
(50, 'wertewrt', 'erwrtwet', 0, 1396523118, 44, 7, 0),
(51, 'wete', 'wert', 0, 1396523398, 44, 7, 0),
(52, 'fdgd', 'dfgd', 0, 1396576847, 44, 7, 0),
(53, 'dfgdfg', 'dfgdfg', 0, 1396577202, 44, 7, 0),
(54, 'dfghdf', 'fghdfgh', 0, 1396577281, 44, 7, 0),
(55, 'yuiouio', 'uiouio', 0, 1396577472, 44, 7, 0),
(56, 'tyuityi', 'ytiyti', 0, 1396577536, 44, 7, 0),
(57, 'yuiyt', 'jkhj', 0, 1396577611, 44, 7, 0),
(58, 'dfg', 'dfg', 0, 1396578208, 44, 7, 0),
(59, 'werterwt', 'ertewrt', 0, 1396578739, 44, 7, 0),
(60, 'sadf', 'sf', 0, 1396579071, 44, 7, 0),
(61, 'ad', 'asdas', 0, 1396579436, 44, 7, 0),
(62, 'wet', '', 0, 1396579589, 44, 7, 0),
(63, 'wert', '', 0, 1396579738, 44, 7, 0),
(64, 'wertwer', 'ert', 0, 1396581021, 44, 7, 0),
(65, 'wert', '', 0, 1396581089, 44, 7, 0),
(66, 'qqqq', '', 0, 1396581153, 44, 7, 0),
(67, '', '', 0, 1396581693, 44, 7, 0),
(68, 'asf', '', 0, 1396581710, 44, 7, 0),
(69, 'asfs', 'asd', 0, 1396585904, 44, 7, 0),
(70, 'asdf', 'asdf', 0, 1396586027, 44, 7, 0),
(71, '', '', 0, 1396586095, 44, 7, 0),
(72, '', '', 0, 1396586240, 44, 7, 0),
(73, 'w', '', 0, 1396586368, 44, 7, 0),
(74, 'sda', 'asd', 0, 1396586558, 44, 7, 0),
(75, 'Test', 'Test', 0, 1396589212, 44, 7, 0),
(76, '', '', 0, 1396589335, 44, 7, 0),
(77, 'df', 'erw', 0, 1396590982, 44, 7, 0),
(78, '', '', 0, 1396591502, 44, 7, 0),
(79, '', '', 0, 1396591672, 44, 7, 0),
(80, 'asdfas', 'sadfasdf', 0, 1396592090, 44, 7, 0),
(81, 'Человеческий вопрос', 'Человеческий вопрос - описание', 0, 1396592279, 44, 7, 0),
(82, 'aaa', 'aaa', 0, 1396593029, 44, 7, 0),
(83, 'ghgfh', 'fghfg', 0, 1396597891, 44, 7, 0),
(84, '', '', 0, 1396597947, 44, 4, 0),
(85, '', '', 0, 1396598071, 44, 7, 0),
(86, 'turt', '', 0, 1396598182, 44, 7, 0),
(87, '', '', 0, 1396598239, 44, 7, 0),
(88, '', '', 0, 1396598339, 44, 6, 0),
(89, '', '', 0, 1396598499, 44, 7, 0),
(90, '', '', 0, 1396598543, 44, 7, 0),
(91, '', '', 0, 1396598585, 44, 7, 0),
(92, '', '', 0, 1396598671, 44, 7, 0),
(93, '', '', 0, 1396598713, 44, 7, 0),
(94, '', '', 0, 1396598887, 44, 7, 0),
(95, 'wer', '', 0, 1396598924, 44, 0, 0),
(96, 'wert', 'erwt', 0, 1396599041, 44, 7, 0),
(97, '4334534', '', 0, 1396600355, 44, 7, 0),
(98, 'Вопрос', '', 0, 1396604747, 44, 7, 0),
(99, 'afdasdf', '', 0, 1396605473, 44, 0, 0);

-- --------------------------------------------------------

--
-- Структура таблицы `relationanswers`
--

CREATE TABLE IF NOT EXISTS `relationanswers` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `parentId` int(10) unsigned NOT NULL,
  `childId` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `relationanswers_parentId` (`parentId`),
  KEY `relationanswers_childId` (`childId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=9 ;

--
-- Дамп данных таблицы `relationanswers`
--

INSERT INTO `relationanswers` (`id`, `parentId`, `childId`) VALUES
(5, 2, 3),
(6, 3, 4),
(7, 4, 3),
(8, 5, 4);

-- --------------------------------------------------------

--
-- Структура таблицы `secondaryanswer`
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=38 ;

--
-- Дамп данных таблицы `secondaryanswer`
--

INSERT INTO `secondaryanswer` (`id`, `title`, `description`, `questionId`, `createDate`, `order`, `userId`) VALUES
(2, 'Наводящий ответ 1.1.1', 'Наводящий ответ 1.1.1 - описание', 3, 0, 0, 44),
(3, 'Наводящий ответ 1.1.2', 'Наводящий ответ 1.1.2 - описание', 3, 0, 0, 44),
(4, 'Наводящий ответ 1.2.1', 'Наводящий ответ 1.2.1 - описание', 4, 0, 0, 44),
(5, 'Наводящий ответ 1.2.2', 'Наводящий ответ 1.2.2 - описание', 4, 0, 0, 44),
(6, 'Наводящий ответ 2.1.1', 'Наводящий ответ 2.1.1 - описание', 5, 0, 0, 44),
(7, 'Наводящий ответ 2.1.2', 'Наводящий ответ 2.1.2 - описание', 5, 0, 1, 44),
(8, 'Наводящий ответ 2.2.1', 'Наводящий ответ 2.2.1 - описание', 6, 0, 0, 44),
(9, 'Наводящий ответ 2.2.2', 'Наводящий ответ 2.2.2 - описание', 6, 0, 1, 44),
(10, 'wert', 'wtr', 0, 0, 0, 0),
(11, 'wet', 'wert', 0, 0, 0, 0),
(12, 'asd', 'asd', 0, 0, 0, 0),
(13, 'asd', 'asd', 0, 0, 0, 0),
(14, 'asd', 'asd', 0, 0, 0, 0),
(15, 'asdf', 'asdf', 0, 0, 0, 0),
(16, 'sdaf', 'aasdf', 0, 0, 0, 0),
(17, 'asda', 'adasd', 0, 0, 0, 0),
(18, 'adasd', 'asdasd', 0, 0, 0, 0),
(19, 'asdfas', 'asdfas', 0, 0, 0, 0),
(20, 'asdfasd', 'asdf', 0, 0, 0, 0),
(21, 'wer', 'wer', 0, 0, 0, 0),
(22, 'wer', 'wer', 0, 0, 0, 0),
(23, 'sdf', '', 0, 0, 0, 0),
(24, 'ery', 'ery', 14, 0, 0, 0),
(25, 'ery', 'ery', 15, 0, 0, 0),
(26, 'ghk', 'ghjk', 16, 0, 0, 0),
(27, '', '', 17, 0, 0, 0),
(28, 'eryery', 'yerty', 18, 0, 0, 0),
(29, 'ery', 'ey', 18, 0, 0, 0),
(30, 'eryert', 'yrtyrtrt', 18, 0, 0, 0),
(31, 'ertyerty', 'ertyy', 19, 0, 0, 0),
(32, 'eryery', 'eryrtyrt', 19, 0, 0, 0),
(33, 'eryerty', 'ertyery', 20, 0, 0, 0),
(34, '34563456', '3463456', 20, 0, 0, 0),
(35, 'Ответ1', 'Ответ', 21, 0, 0, 0),
(36, 'Ответ3', '', 21, 0, 0, 0),
(37, 'Ответ2', 'Ответ', 21, 0, 0, 0);

-- --------------------------------------------------------

--
-- Структура таблицы `secondaryquestion`
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=22 ;

--
-- Дамп данных таблицы `secondaryquestion`
--

INSERT INTO `secondaryquestion` (`id`, `title`, `description`, `parentId`, `createDate`, `userId`, `categoryId`, `order`) VALUES
(3, 'Наводящий вопрос 1.1', 'Наводящий вопрос 1.1 - описание', 10, 0, 44, 4, 0),
(4, 'Наводящий вопрос 1.2', 'Наводящий вопрос 1.2 - описание', 10, 0, 44, 4, 1),
(5, 'Наводящий вопрос 2.1', 'Наводящий вопрос 2.1 - описание', 11, 0, 44, 5, 0),
(6, 'Наводящий вопрос 2.2', 'Наводящий вопрос 2.2 - описание', 11, 0, 44, 5, 1),
(7, 'wert', 'wer', 73, 1396586383, 44, 0, 0),
(8, 'asd', 'asd', 74, 1396586574, 44, 0, 0),
(9, 'asd', 'asd', 74, 1396586598, 44, 0, 0),
(10, 'aaaa', 'aaaa', 75, 1396589292, 44, 0, 0),
(11, 'safasf', 'asfsad', 75, 1396589302, 44, 0, 0),
(12, 'ew', '', 76, 1396589378, 44, 0, 0),
(13, 'ssef', '', 76, 1396589593, 44, 0, 0),
(14, 'rey', 'y', 78, 1396591531, 44, 0, 0),
(15, 'rey', 'rey', 78, 1396591538, 44, 0, 0),
(16, 'jhk', '', 78, 1396591549, 44, 0, 0),
(17, '', '', 78, 1396591559, 44, 0, 0),
(18, 'reyert', 'ertyeryerty', 82, 1396593075, 44, 0, 0),
(19, 'eryrey', 'yeryer', 82, 1396593088, 44, 0, 0),
(20, 'eyertyrt', 'rteryerty', 82, 1396593103, 44, 0, 0),
(21, 'Вспо вопрос', '', 98, 1396604826, 44, 0, 0);

-- --------------------------------------------------------

--
-- Структура таблицы `user`
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=45 ;

--
-- Дамп данных таблицы `user`
--

INSERT INTO `user` (`id`, `login`, `password`, `email`, `session`, `role`, `createdate`, `logindate`) VALUES
(43, 'admin', 'c5a8a6b75685da2b599c', 'admin', 'VaM+X5WsASAbVIyVn3PMF0Kezsxw', 2, 1395310436, 1395310436),
(44, 'user', 'a5ebc0ddd7c65efbddd9', 'user', 'PG/ttMuRwXnD3B0vUHvKggxMZXaj', 0, 1395310436, 1395310436);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
