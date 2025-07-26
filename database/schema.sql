CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(120) UNIQUE NOT NULL,
  `password_hash` VARCHAR(128) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `google_id` VARCHAR(120) UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `profiles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNIQUE NOT NULL,
  `bio` TEXT,
  `photo_url` VARCHAR(255),
  `availability` VARCHAR(255),
  `location` VARCHAR(100),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);

CREATE TABLE IF NOT EXISTS `skills` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS `user_offered_skills` (
  `user_id` INT NOT NULL,
  `skill_id` INT NOT NULL,
  PRIMARY KEY (`user_id`, `skill_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`skill_id`) REFERENCES `skills`(`id`)
);

CREATE TABLE IF NOT EXISTS `user_required_skills` (
  `user_id` INT NOT NULL,
  `skill_id` INT NOT NULL,
  PRIMARY KEY (`user_id`, `skill_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`skill_id`) REFERENCES `skills`(`id`)
);

CREATE TABLE IF NOT EXISTS `portfolios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `description` TEXT NOT NULL,
  `project_url` VARCHAR(255),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);

CREATE TABLE IF NOT EXISTS `barter_sessions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `requester_id` INT NOT NULL,
  `provider_id` INT NOT NULL,
  `offered_skill_id` INT NOT NULL,
  `requested_skill_id` INT NOT NULL,
  `status` ENUM('pending', 'accepted', 'rejected', 'completed', 'cancelled') DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`requester_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`provider_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`offered_skill_id`) REFERENCES `skills`(`id`),
  FOREIGN KEY (`requested_skill_id`) REFERENCES `skills`(`id`)
);

CREATE TABLE IF NOT EXISTS `messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `sender_id` INT NOT NULL,
  `receiver_id` INT NOT NULL,
  `content` TEXT NOT NULL,
  `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`)
);

CREATE TABLE IF NOT EXISTS `feedback` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `session_id` INT NOT NULL,
  `reviewer_id` INT NOT NULL,
  `reviewee_id` INT NOT NULL,
  `rating` INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  `comment` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`session_id`) REFERENCES `barter_sessions`(`id`),
  FOREIGN KEY (`reviewer_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`reviewee_id`) REFERENCES `users`(`id`)
);
