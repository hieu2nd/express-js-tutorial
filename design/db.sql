CREATE TABLE `account` (
  `id` int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `username` varchar(255),
  `password` varchar(255),
  `role_id` int(11),
  `is_active` integer,
  `created_at` timestamp,
  `updated_at` timestamp,
  `is_deleted` bool
);

CREATE TABLE `role` (
  `id` int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL UNIQUE,
  `description` text,
  `permissions` json,
  `is_active` bool DEFAULT true,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `user` (
  `id` int(11) PRIMARY KEY NOT NULL,
  `full_name` varchar(255),
  `phone_number` varchar(255),
  `email` varchar(255),
  `address` varchar(255),
  `dob` timestamp,
  `is_deleted` bool,
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `employee` (
  `id` int(11) PRIMARY KEY NOT NULL,
  `code` varchar(255) UNIQUE NOT NULL,
  `store_id` int(11)
);

CREATE TABLE `customer` (
  `id` int(11) PRIMARY KEY NOT NULL,
  `status` varchar(255),
  `created_at` timestamp
);

CREATE TABLE `category` (
  `id` int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255),
  `is_deleted` bool,
  `image_url` varchar(255),
  `is_shown` bool,
);

CREATE TABLE `product` (
  `id` int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `code` varchar(255) UNIQUE,
  `name` varchar(255),
  `image_url` varchar(255),
  `price` decimal,
  `unit` varchar(255),
  `description` varchar(255),
  `rating` integer,
  `created_at` timestamp,
  `updated_at` timestamp,
  `is_deleted` bool,
  `is_shown` bool,
  `promotion_id` int(11)
);

CREATE TABLE `order` (
  `id` int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `code` varchar(255) UNIQUE,
  `customer_id` int(11),
  `employee_id` int(11),
  `status` integer,
  `shipment_id` int(11),
  `total_money` decimal,
  `created_at` timestamp,
  `reason` varchar(255),
  `money_paid` integer,
  `number` integer,
  `is_deleted` bool
);

CREATE TABLE `cart` (
  `id` int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `customer_id` int(11),
  `product_id` int(11)
);

CREATE TABLE `order_history` (
  `id` int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `order_id` int(11),
  `action` varchar(255),
  `money_paid` integer,
  `created_at` long,
  `created_by` varchar(255),
  `last_updated_at` long,
  `last_updated_by` varchar(255)
);

CREATE TABLE `promotion` (
  `id` int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `code` varchar(255),
  `start_day` timestamp,
  `end_day` timestamp,
  `discount_percent` decimal,
  `money_deducted` integer,
  `number` integer,
  `is_deleted` bool,
  `coin` integer
);

CREATE TABLE `order_product` (
  `id` int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `order_id` int(11),
  `product_id` int(11),
  `product_code` varchar(255),
  `quantity` integer,
  `import_price` decimal,
  `export_price` decimal
);

CREATE TABLE `product_category` (
  `product_id` int(11),
  `category_id` int(11),
  PRIMARY KEY (`product_id`, `category_id`)
);

CREATE TABLE `store` (
  `id` int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `code` varchar(255) UNIQUE,
  `name` varchar(255),
  `is_deleted` bool,
  `phone_number` varchar(255),
  `address` varchar(255)
);

CREATE TABLE `shipment` (
  `id` int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `code` varchar(255),
  `name` varchar(255),
  `price` decimal,
  `method` varchar(255),
  `store_id` int(11)
);

CREATE TABLE `cart_product` (
  `cart_id` int(11),
  `product_id` int(11),
  `quantity` integer,
  `price` integer,
  PRIMARY KEY (`cart_id`, `product_id`)
);

ALTER TABLE `user` ADD FOREIGN KEY (`id`) REFERENCES `account` (`id`);

ALTER TABLE `customer` ADD FOREIGN KEY (`id`) REFERENCES `user` (`id`);

ALTER TABLE `employee` ADD FOREIGN KEY (`id`) REFERENCES `user` (`id`);

ALTER TABLE `cart` ADD FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`);

ALTER TABLE `product` ADD FOREIGN KEY (`promotion_id`) REFERENCES `promotion` (`id`);

ALTER TABLE `order_product` ADD FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

ALTER TABLE `order_product` ADD FOREIGN KEY (`order_id`) REFERENCES `order` (`id`);

ALTER TABLE `cart_product` ADD FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`);

ALTER TABLE `cart_product` ADD FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

ALTER TABLE `product_category` ADD FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

ALTER TABLE `product_category` ADD FOREIGN KEY (`category_id`) REFERENCES `category` (`id`);

ALTER TABLE `order` ADD FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`);

ALTER TABLE `order` ADD FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`);

ALTER TABLE `order_history` ADD FOREIGN KEY (`order_id`) REFERENCES `order` (`id`);

ALTER TABLE `employee` ADD FOREIGN KEY (`store_id`) REFERENCES `store` (`id`);

ALTER TABLE `order` ADD FOREIGN KEY (`shipment_id`) REFERENCES `shipment` (`id`);

ALTER TABLE `account` ADD FOREIGN KEY (`role_id`) REFERENCES `role` (`id`);
