CREATE TABLE `account` (
  `id` varchar(255) PRIMARY KEY,
  `username` varchar(255),
  `password` varchar(255),
  `is_actived` integer,
  `created_at` timestamp,
  `updated_at` timestamp,
  `is_deleted` bool
);

CREATE TABLE `user` (
  `id` varchar(255) PRIMARY KEY,
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
  `id` varchar(255) PRIMARY KEY,
  `code` varchar(255) UNIQUE,
  `store_id` varchar(255)
);

CREATE TABLE `customer` (
  `id` varchar(255) PRIMARY KEY,
  `status` varchar(255),
  `created_at` timestamp
);

CREATE TABLE `category` (
  `id` varchar(255) PRIMARY KEY,
  `name` varchar(255),
  `is_deleted` bool,
  `url_image` varchar(255)
);

CREATE TABLE `product` (
  `id` varchar(255) PRIMARY KEY,
  `code` varchar(255) UNIQUE,
  `name` varchar(255),
  `price` decimal,
  `unit` varchar(255),
  `origin` varchar(255),
  `description` varchar(255),
  `rating` integer,
  `created_at` timestamp,
  `updated_at` timestamp,
  `is_deleted` bool,
  `promotion_id` varchar(255)
);

CREATE TABLE `order` (
  `id` varchar(255) PRIMARY KEY,
  `code` varchar(255) UNIQUE,
  `customer_id` varcharÏ,
  `employee_id` varchar(255),
  `status` integer,
  `shipment_id` varchar(255),
  `total_money` decimal,
  `created_at` timestamp,
  `reason` varchar(255),
  `money_paid` integer,
  `number` integer,
  `is_deleted` bool
);

CREATE TABLE `cart` (
  `id` varchar(255) PRIMARY KEY,
  `customer_id` varchar(255),
  `product_id` varchar(255)
);

CREATE TABLE `order_history` (
  `id` varchar(255) PRIMARY KEY,
  `order_id` varchar(255),
  `action` varchar(255),
  `money_paid` integer,
  `created_at` long,
  `created_by` varchar(255),
  `last_updated_at` long,
  `last_updated_by` varchar(255)
);

CREATE TABLE `promotion` (
  `id` varchar(255) PRIMARY KEY,
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
  `id` varchar(255) PRIMARY KEY,
  `order_id` varchar(255),
  `product_id` varchar(255),
  `product_code` varchar(255),
  `quantity` integer,
  `import_price` decimal,
  `export_price` decimal
);

CREATE TABLE `product_category` (
  `product_id` varchar(255),
  `category_id` varchar(255),
  PRIMARY KEY (`product_id`, `category_id`)
);

CREATE TABLE `store` (
  `id` varchar(255) PRIMARY KEY,
  `code` varchar(255) UNIQUE,
  `name` varchar(255),
  `is_deleted` bool,
  `phone_number` varchar(255),
  `address_id` varchar(255)
);

CREATE TABLE `shipment` (
  `id` varchar(255) PRIMARY KEY,
  `code` varchar(255),
  `name` varchar(255),
  `price` decimal,
  `method` varchar(255),
  `store_id` varchar(255)
);

CREATE TABLE `cart_product` (
  `cart_id` varchar(255),
  `product_id` varchar(255),
  `quantity` integer,
  `price` integer,
  PRIMARY KEY (`cart_id`, `product_id`)
);

ALTER TABLE `user` ADD FOREIGN KEY (`id`) REFERENCES `account` (`id`);

ALTER TABLE `customer` ADD FOREIGN KEY (`id`) REFERENCES `user` (`id`);

ALTER TABLE `user` ADD FOREIGN KEY (`id`) REFERENCES `employee` (`id`);

ALTER TABLE `cart` ADD FOREIGN KEY (`id`) REFERENCES `customer` (`id`);

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
