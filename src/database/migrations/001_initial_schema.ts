import type { Pool } from "mysql2/promise";
import { BaseMigration } from "../migration";

export class Migration001_InitialSchema extends BaseMigration {
  id = "001_initial_schema";
  name = "Create initial database schema";

  async up(db: Pool): Promise<void> {
    const queries = [
      // Account table
      `CREATE TABLE IF NOT EXISTS account (
        id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
        username VARCHAR(255),
        password VARCHAR(255),
        role_id INT(11),
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        is_deleted TINYINT(1) DEFAULT 0
      )`,

      // Role table
      `CREATE TABLE IF NOT EXISTS role (
        id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        permissions JSON,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      // User table
      `CREATE TABLE IF NOT EXISTS user (
        id INT(11) PRIMARY KEY NOT NULL,
        full_name VARCHAR(255),
        phone_number VARCHAR(255),
        email VARCHAR(255),
        address VARCHAR(255),
        dob TIMESTAMP NULL,
        is_deleted TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      // Store table
      `CREATE TABLE IF NOT EXISTS store (
        id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
        code VARCHAR(255) UNIQUE,
        name VARCHAR(255),
        is_deleted TINYINT(1) DEFAULT 0,
        phone_number VARCHAR(255),
        address VARCHAR(255)
      )`,

      // Employee table
      `CREATE TABLE IF NOT EXISTS employee (
        id INT(11) PRIMARY KEY NOT NULL,
        code VARCHAR(255) UNIQUE NOT NULL,
        store_id INT(11)
      )`,

      // Customer table
      `CREATE TABLE IF NOT EXISTS customer (
        id INT(11) PRIMARY KEY NOT NULL,
        status VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      // Category table
      `CREATE TABLE IF NOT EXISTS category (
        id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
        name VARCHAR(255),
        is_deleted TINYINT(1) DEFAULT 0,
        image_url VARCHAR(255),
        is_shown TINYINT(1) DEFAULT 1
      )`,

      // Promotion table
      `CREATE TABLE IF NOT EXISTS promotion (
        id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
        code VARCHAR(255),
        start_day TIMESTAMP NULL,
        end_day TIMESTAMP NULL,
        discount_percent DECIMAL(5,2),
        money_deducted INT(11),
        number INT(11),
        is_deleted TINYINT(1) DEFAULT 0,
        coin INT(11)
      )`,

      // Product table
      `CREATE TABLE IF NOT EXISTS product (
        id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
        code VARCHAR(255) UNIQUE,
        name VARCHAR(255),
        image_url VARCHAR(255),
        price DECIMAL(10,2),
        unit VARCHAR(255),
        description TEXT,
        rating INT(11),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        is_deleted TINYINT(1) DEFAULT 0,
        is_shown TINYINT(1) DEFAULT 1,
        promotion_id INT(11)
      )`,

      // Shipment table
      `CREATE TABLE IF NOT EXISTS shipment (
        id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
        code VARCHAR(255),
        name VARCHAR(255),
        price DECIMAL(10,2),
        method VARCHAR(255),
        store_id INT(11)
      )`,

      // Order table
      `CREATE TABLE IF NOT EXISTS \`order\` (
        id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
        code VARCHAR(255) UNIQUE,
        customer_id INT(11),
        employee_id INT(11),
        status INT(11),
        shipment_id INT(11),
        total_money DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reason VARCHAR(255),
        money_paid INT(11),
        number INT(11),
        is_deleted TINYINT(1) DEFAULT 0
      )`,

      // Cart table
      `CREATE TABLE IF NOT EXISTS cart (
        id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
        customer_id INT(11),
        product_id INT(11)
      )`,

      // Order history table
      `CREATE TABLE IF NOT EXISTS order_history (
        id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
        order_id INT(11),
        action VARCHAR(255),
        money_paid INT(11),
        created_at BIGINT,
        created_by VARCHAR(255),
        last_updated_at BIGINT,
        last_updated_by VARCHAR(255)
      )`,

      // Order product table
      `CREATE TABLE IF NOT EXISTS order_product (
        id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
        order_id INT(11),
        product_id INT(11),
        product_code VARCHAR(255),
        quantity INT(11),
        import_price DECIMAL(10,2),
        export_price DECIMAL(10,2)
      )`,

      // Product category table
      `CREATE TABLE IF NOT EXISTS product_category (
        product_id INT(11),
        category_id INT(11),
        PRIMARY KEY (product_id, category_id)
      )`,

      // Cart product table
      `CREATE TABLE IF NOT EXISTS cart_product (
        cart_id INT(11),
        product_id INT(11),
        quantity INT(11),
        price INT(11),
        PRIMARY KEY (cart_id, product_id)
      )`,
    ];

    await this.executeMultipleQueries(db, queries);
  }

  async down(db: Pool): Promise<void> {
    const queries = [
      "DROP TABLE IF EXISTS cart_product",
      "DROP TABLE IF EXISTS product_category",
      "DROP TABLE IF EXISTS order_product",
      "DROP TABLE IF EXISTS order_history",
      "DROP TABLE IF EXISTS cart",
      "DROP TABLE IF EXISTS `order`",
      "DROP TABLE IF EXISTS shipment",
      "DROP TABLE IF EXISTS product",
      "DROP TABLE IF EXISTS promotion",
      "DROP TABLE IF EXISTS category",
      "DROP TABLE IF EXISTS customer",
      "DROP TABLE IF EXISTS employee",
      "DROP TABLE IF EXISTS store",
      "DROP TABLE IF EXISTS user",
      "DROP TABLE IF EXISTS account",
      "DROP TABLE IF EXISTS role",
    ];

    await this.executeMultipleQueries(db, queries);
  }
}
