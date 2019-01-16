CREATE TABLE Hiyoko_core.Material_messages (
  `materialMessageId` INT(20) UNSIGNED AUTO_INCREMENT NOT NULL,
  `materialId` INT(20) UNSIGNED NOT NULL,
  `pushMessage` TEXT NOT NULL,
  `createdAt` DATETIME NOT NULL,
  PRIMARY KEY (`materialMessageId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;