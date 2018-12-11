CREATE TABLE Hiyoko_core.Vocabulary_lists_added_count (
  `userId` VARCHAR(50) NOT NULL,
  `date` DATE NOT NULL,
  `count` BIGINT unsigned NOT NULL,
  PRIMARY KEY (`userId`, `date`),
  KEY `date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;