CREATE TABLE Hiyoko_core.Count_summary_table (
  `userId` VARCHAR(50) NOT NULL,
  `countCategory` ENUM('adding_vocabulary_list', 'taking_quiz'),
  `date` DATE NOT NULL,
  `count` BIGINT unsigned NOT NULL,
  PRIMARY KEY (`userId`, `countCategory`, `date`),
  KEY `date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE Hiyoko_core.Count_summary_table
  MODIFY COLUMN `countCategory` ENUM(
    'addingVocabularyList',
    'takingQuiz',
    'planAddingVocabularyList',
    'planTakingQuiz'
  ) NOT NULL;
