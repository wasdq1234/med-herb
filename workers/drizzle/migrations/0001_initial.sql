-- Create admin table
CREATE TABLE `admin` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);

CREATE UNIQUE INDEX `admin_username_unique` ON `admin` (`username`);

-- Create symptom table
CREATE TABLE `symptom` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`category` text,
	`display_order` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);

CREATE INDEX `idx_symptom_active_order` ON `symptom` (`is_active`, `display_order`);

-- Create question table
CREATE TABLE `question` (
	`id` text PRIMARY KEY NOT NULL,
	`symptom_id` text,
	`question_text` text NOT NULL,
	`question_type` text NOT NULL,
	`options` text,
	`slider_min` integer,
	`slider_max` integer,
	`display_order` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`symptom_id`) REFERENCES `symptom`(`id`) ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE INDEX `idx_question_active_order` ON `question` (`is_active`, `display_order`);
CREATE INDEX `idx_question_symptom` ON `question` (`symptom_id`);

-- Create syndrome table
CREATE TABLE `syndrome` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`category` text,
	`characteristics` text,
	`is_active` integer DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);

CREATE INDEX `idx_syndrome_active` ON `syndrome` (`is_active`);

-- Create treatment_axis table
CREATE TABLE `treatment_axis` (
	`id` text PRIMARY KEY NOT NULL,
	`syndrome_id` text,
	`name` text NOT NULL,
	`description` text,
	`display_order` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`syndrome_id`) REFERENCES `syndrome`(`id`) ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE INDEX `idx_treatment_axis_syndrome` ON `treatment_axis` (`syndrome_id`);

-- Create herb table
CREATE TABLE `herb` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`scientific_name` text,
	`effect` text,
	`category` text,
	`is_active` integer DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);

CREATE INDEX `idx_herb_active` ON `herb` (`is_active`);
CREATE INDEX `idx_herb_name` ON `herb` (`name`);

-- Create syndrome_herb table
CREATE TABLE `syndrome_herb` (
	`id` text PRIMARY KEY NOT NULL,
	`syndrome_id` text NOT NULL,
	`herb_id` text NOT NULL,
	`relevance_score` real DEFAULT 1.0 NOT NULL,
	`evidence` text,
	`reference_url` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`syndrome_id`) REFERENCES `syndrome`(`id`) ON UPDATE NO ACTION ON DELETE NO ACTION,
	FOREIGN KEY (`herb_id`) REFERENCES `herb`(`id`) ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE INDEX `idx_syndrome_herb_syndrome` ON `syndrome_herb` (`syndrome_id`);
CREATE INDEX `idx_syndrome_herb_herb` ON `syndrome_herb` (`herb_id`);
CREATE UNIQUE INDEX `idx_syndrome_herb_unique` ON `syndrome_herb` (`syndrome_id`, `herb_id`);

-- Create diagnosis_rule table
CREATE TABLE `diagnosis_rule` (
	`id` text PRIMARY KEY NOT NULL,
	`syndrome_id` text NOT NULL,
	`rule_type` text NOT NULL,
	`condition` text NOT NULL,
	`weight` real DEFAULT 1.0 NOT NULL,
	`is_active` integer DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`syndrome_id`) REFERENCES `syndrome`(`id`) ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE INDEX `idx_diagnosis_rule_syndrome` ON `diagnosis_rule` (`syndrome_id`);
CREATE INDEX `idx_diagnosis_rule_active` ON `diagnosis_rule` (`is_active`);

-- Create diagnosis_log table
CREATE TABLE `diagnosis_log` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`selected_symptoms` text NOT NULL,
	`answers` text NOT NULL,
	`results` text NOT NULL,
	`created_at` text NOT NULL
);

CREATE INDEX `idx_diagnosis_log_created` ON `diagnosis_log` (`created_at` DESC);
CREATE INDEX `idx_diagnosis_log_session` ON `diagnosis_log` (`session_id`);
