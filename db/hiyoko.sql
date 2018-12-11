CREATE DATABASE IF NOT EXISTS Hiyoko_core;

USE Hiyoko_core;

DROP TABLE IF EXISTS Hiyoko_core.Users;
CREATE TABLE Hiyoko_core.Users (
  `userId` VARCHAR(50) NOT NULL, -- same with line id
  `createdAt` datetime NOT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS Hiyoko_core.User_products;
CREATE TABLE Hiyoko_core.User_products (
  `userId` VARCHAR(50) NOT NULL,
  `productId` TINYINT(1) UNSIGNED DEFAULT 0, -- 1 -> v1, 2 -> v2
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS Hiyoko_core.Vocabularies;
CREATE TABLE Hiyoko_core.Vocabularies (
  `vocaId` BIGINT(20) unsigned AUTO_INCREMENT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`vocaId`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS Hiyoko_core.Vocabulary_lists;
CREATE TABLE Hiyoko_core.Vocabulary_lists (
  `vocaListId` BIGINT(20) unsigned AUTO_INCREMENT NOT NULL,
  `userId` VARCHAR(50) NOT NULL,
  `vocaId` BIGINT(20) unsigned NOT NULL,
  `meaning` VARCHAR(200) DEFAULT NULL,
  `contextSentence` VARCHAR(500) DEFAULT NULL,
  `contextPictureURL` VARCHAR(500) DEFAULT NULL,
  `priority` INTEGER(3) DEFAULT 100,
  `createdAt` datetime NOT NULL,
  PRIMARY KEY (`vocaListId`),
  UNIQUE KEY `userId_vocaId_createdAt` (`userId`, `vocaId`, `createdAt`),
  KEY `userId_createdAt` (`userId`, `createdAt`),
  KEY `userId_priority_createdAt` (`userId`, `priority`, `createdAt`),
  KEY `vocaId` (`vocaId`),
  KEY `createdAt` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS Hiyoko_core.Count_summary_table;
CREATE TABLE Hiyoko_core.Count_summary_table (
  `userId` VARCHAR(50) NOT NULL,
  `countCategory` ENUM('adding_vocabulary_list', 'taking_quiz'),
  `date` DATE NOT NULL,
  `count` BIGINT unsigned NOT NULL,
  PRIMARY KEY (`userId`, `countCategory`, `date`),
  KEY `date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

SHOW TABLES;