-- noinspection SqlDialectInspectionForFile

-- noinspection SqlNoDataSourceInspectionForFile

#MySQL

CREATE DATABASE IF NOT EXISTS furigana;

USE furigana;

CREATE TABLE IF NOT EXISTS ruby_table(
  word VARCHAR(20) NOT NULL PRIMARY KEY,
  origin_form VARCHAR(20) NOT NULL,
  kanji_part VARCHAR(10) NOT NULL,
  ruby VARCHAR(20) NOT NULL,
  replacement VARCHAR(30) NOT NULL
);
