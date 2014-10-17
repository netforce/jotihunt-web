-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Oct 17, 2014 at 09:22 PM
-- Server version: 5.5.40-0ubuntu0.14.04.1
-- PHP Version: 5.5.9-1ubuntu4.4

-- Database: `jotihunt-web`



ALTER TABLE `vossenlocaties` ADD `vossenteam` char(1) NOT NULL;
ALTER TABLE `vossenlocaties` ADD `tijdstip` datetime NOT NULL;


