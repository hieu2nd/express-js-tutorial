import type { Pool } from "mysql2/promise";
import { BaseMigration } from "../migration";

export class Migration003_AddIndexes extends BaseMigration {
  id = "003_add_indexes";
  name = "Add database indexes for performance";

  async up(db: Pool): Promise<void> {
    const queries = [
      // Account table indexes
      "CREATE INDEX idx_account_username ON account(username)",
      "CREATE INDEX idx_account_is_active ON account(is_active)",
      "CREATE INDEX idx_account_created_at ON account(created_at)",

      // User table indexes
      "CREATE INDEX idx_user_email ON user(email)",
      "CREATE INDEX idx_user_phone_number ON user(phone_number)",
      "CREATE INDEX idx_user_is_deleted ON user(is_deleted)",
      "CREATE INDEX idx_user_created_at ON user(created_at)",

      // Product table indexes
      "CREATE INDEX idx_product_code ON product(code)",
      "CREATE INDEX idx_product_name ON product(name)",
      "CREATE INDEX idx_product_price ON product(price)",
      "CREATE INDEX idx_product_is_deleted ON product(is_deleted)",
      "CREATE INDEX idx_product_is_shown ON product(is_shown)",
      "CREATE INDEX idx_product_rating ON product(rating)",
      "CREATE INDEX idx_product_created_at ON product(created_at)",

      // Category table indexes
      "CREATE INDEX idx_category_name ON category(name)",
      "CREATE INDEX idx_category_is_deleted ON category(is_deleted)",
      "CREATE INDEX idx_category_is_shown ON category(is_shown)",

      // Order table indexes
      "CREATE INDEX idx_order_code ON `order`(code)",
      "CREATE INDEX idx_order_status ON `order`(status)",
      "CREATE INDEX idx_order_created_at ON `order`(created_at)",
      "CREATE INDEX idx_order_total_money ON `order`(total_money)",
      "CREATE INDEX idx_order_is_deleted ON `order`(is_deleted)",
      "CREATE INDEX idx_order_customer_id ON `order`(customer_id)",
      "CREATE INDEX idx_order_employee_id ON `order`(employee_id)",

      // Store table indexes
      "CREATE INDEX idx_store_code ON store(code)",
      "CREATE INDEX idx_store_name ON store(name)",
      "CREATE INDEX idx_store_is_deleted ON store(is_deleted)",

      // Employee table indexes
      "CREATE INDEX idx_employee_code ON employee(code)",
      "CREATE INDEX idx_employee_store_id ON employee(store_id)",

      // Customer table indexes
      "CREATE INDEX idx_customer_status ON customer(status)",
      "CREATE INDEX idx_customer_created_at ON customer(created_at)",

      // Promotion table indexes
      "CREATE INDEX idx_promotion_code ON promotion(code)",
      "CREATE INDEX idx_promotion_start_day ON promotion(start_day)",
      "CREATE INDEX idx_promotion_end_day ON promotion(end_day)",
      "CREATE INDEX idx_promotion_is_deleted ON promotion(is_deleted)",

      // Order history table indexes
      "CREATE INDEX idx_order_history_order_id ON order_history(order_id)",
      "CREATE INDEX idx_order_history_created_at ON order_history(created_at)",
      "CREATE INDEX idx_order_history_action ON order_history(action)",

      // Cart table indexes
      "CREATE INDEX idx_cart_customer_id ON cart(customer_id)",
      "CREATE INDEX idx_cart_product_id ON cart(product_id)",

      // Shipment table indexes
      "CREATE INDEX idx_shipment_code ON shipment(code)",
      "CREATE INDEX idx_shipment_store_id ON shipment(store_id)",
    ];

    await this.executeMultipleQueries(db, queries);
  }

  async down(db: Pool): Promise<void> {
    const queries = [
      // Drop shipment indexes
      "DROP INDEX idx_shipment_store_id ON shipment",
      "DROP INDEX idx_shipment_code ON shipment",

      // Drop cart indexes
      "DROP INDEX idx_cart_product_id ON cart",
      "DROP INDEX idx_cart_customer_id ON cart",

      // Drop order history indexes
      "DROP INDEX idx_order_history_action ON order_history",
      "DROP INDEX idx_order_history_created_at ON order_history",
      "DROP INDEX idx_order_history_order_id ON order_history",

      // Drop promotion indexes
      "DROP INDEX idx_promotion_is_deleted ON promotion",
      "DROP INDEX idx_promotion_end_day ON promotion",
      "DROP INDEX idx_promotion_start_day ON promotion",
      "DROP INDEX idx_promotion_code ON promotion",

      // Drop customer indexes
      "DROP INDEX idx_customer_created_at ON customer",
      "DROP INDEX idx_customer_status ON customer",

      // Drop employee indexes
      "DROP INDEX idx_employee_store_id ON employee",
      "DROP INDEX idx_employee_code ON employee",

      // Drop store indexes
      "DROP INDEX idx_store_is_deleted ON store",
      "DROP INDEX idx_store_name ON store",
      "DROP INDEX idx_store_code ON store",

      // Drop order indexes
      "DROP INDEX idx_order_employee_id ON `order`",
      "DROP INDEX idx_order_customer_id ON `order`",
      "DROP INDEX idx_order_is_deleted ON `order`",
      "DROP INDEX idx_order_total_money ON `order`",
      "DROP INDEX idx_order_created_at ON `order`",
      "DROP INDEX idx_order_status ON `order`",
      "DROP INDEX idx_order_code ON `order`",

      // Drop category indexes
      "DROP INDEX idx_category_is_shown ON category",
      "DROP INDEX idx_category_is_deleted ON category",
      "DROP INDEX idx_category_name ON category",

      // Drop product indexes
      "DROP INDEX idx_product_created_at ON product",
      "DROP INDEX idx_product_rating ON product",
      "DROP INDEX idx_product_is_shown ON product",
      "DROP INDEX idx_product_is_deleted ON product",
      "DROP INDEX idx_product_price ON product",
      "DROP INDEX idx_product_name ON product",
      "DROP INDEX idx_product_code ON product",

      // Drop user indexes
      "DROP INDEX idx_user_created_at ON user",
      "DROP INDEX idx_user_is_deleted ON user",
      "DROP INDEX idx_user_phone_number ON user",
      "DROP INDEX idx_user_email ON user",

      // Drop account indexes
      "DROP INDEX idx_account_created_at ON account",
      "DROP INDEX idx_account_is_active ON account",
      "DROP INDEX idx_account_username ON account",
    ];

    await this.executeMultipleQueries(db, queries);
  }
}
