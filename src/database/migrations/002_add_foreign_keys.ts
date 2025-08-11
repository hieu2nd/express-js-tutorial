import type { Pool } from "mysql2/promise";
import { BaseMigration } from "../migration";

export class Migration002_AddForeignKeys extends BaseMigration {
  id = "002_add_foreign_keys";
  name = "Add foreign key constraints";

  async up(db: Pool): Promise<void> {
    const queries = [
      // Account references role (many-to-one)
      `ALTER TABLE account 
       ADD CONSTRAINT fk_account_role 
       FOREIGN KEY (role_id) REFERENCES role(id) 
       ON DELETE SET NULL 
       ON UPDATE CASCADE`,

      // User references account (one-to-one)
      `ALTER TABLE user 
       ADD CONSTRAINT fk_user_account 
       FOREIGN KEY (id) REFERENCES account(id) 
       ON DELETE CASCADE 
       ON UPDATE CASCADE`,

      // Customer references user (one-to-one)
      `ALTER TABLE customer 
       ADD CONSTRAINT fk_customer_user 
       FOREIGN KEY (id) REFERENCES user(id) 
       ON DELETE CASCADE 
       ON UPDATE CASCADE`,

      // Employee references user (one-to-one)
      `ALTER TABLE employee 
       ADD CONSTRAINT fk_employee_user 
       FOREIGN KEY (id) REFERENCES user(id) 
       ON DELETE CASCADE 
       ON UPDATE CASCADE`,

      // Employee references store (many-to-one)
      `ALTER TABLE employee 
       ADD CONSTRAINT fk_employee_store 
       FOREIGN KEY (store_id) REFERENCES store(id) 
       ON DELETE SET NULL 
       ON UPDATE CASCADE`,

      // Cart references customer (many-to-one)
      `ALTER TABLE cart 
       ADD CONSTRAINT fk_cart_customer 
       FOREIGN KEY (customer_id) REFERENCES customer(id) 
       ON DELETE CASCADE 
       ON UPDATE CASCADE`,

      // Product references promotion (many-to-one, optional)
      `ALTER TABLE product 
       ADD CONSTRAINT fk_product_promotion 
       FOREIGN KEY (promotion_id) REFERENCES promotion(id) 
       ON DELETE SET NULL 
       ON UPDATE CASCADE`,

      // Order references customer (many-to-one, optional)
      `ALTER TABLE \`order\` 
       ADD CONSTRAINT fk_order_customer 
       FOREIGN KEY (customer_id) REFERENCES customer(id) 
       ON DELETE SET NULL 
       ON UPDATE CASCADE`,

      // Order references employee (many-to-one, optional)
      `ALTER TABLE \`order\` 
       ADD CONSTRAINT fk_order_employee 
       FOREIGN KEY (employee_id) REFERENCES employee(id) 
       ON DELETE SET NULL 
       ON UPDATE CASCADE`,

      // Order references shipment (many-to-one, optional)
      `ALTER TABLE \`order\` 
       ADD CONSTRAINT fk_order_shipment 
       FOREIGN KEY (shipment_id) REFERENCES shipment(id) 
       ON DELETE SET NULL 
       ON UPDATE CASCADE`,

      // Shipment references store (many-to-one)
      `ALTER TABLE shipment 
       ADD CONSTRAINT fk_shipment_store 
       FOREIGN KEY (store_id) REFERENCES store(id) 
       ON DELETE CASCADE 
       ON UPDATE CASCADE`,

      // Order history references order (many-to-one)
      `ALTER TABLE order_history 
       ADD CONSTRAINT fk_order_history_order 
       FOREIGN KEY (order_id) REFERENCES \`order\`(id) 
       ON DELETE CASCADE 
       ON UPDATE CASCADE`,

      // Order product references order (many-to-one)
      `ALTER TABLE order_product 
       ADD CONSTRAINT fk_order_product_order 
       FOREIGN KEY (order_id) REFERENCES \`order\`(id) 
       ON DELETE CASCADE 
       ON UPDATE CASCADE`,

      // Order product references product (many-to-one)
      `ALTER TABLE order_product 
       ADD CONSTRAINT fk_order_product_product 
       FOREIGN KEY (product_id) REFERENCES product(id) 
       ON DELETE CASCADE 
       ON UPDATE CASCADE`,

      // Product category references product (many-to-many)
      `ALTER TABLE product_category 
       ADD CONSTRAINT fk_product_category_product 
       FOREIGN KEY (product_id) REFERENCES product(id) 
       ON DELETE CASCADE 
       ON UPDATE CASCADE`,

      // Product category references category (many-to-many)
      `ALTER TABLE product_category 
       ADD CONSTRAINT fk_product_category_category 
       FOREIGN KEY (category_id) REFERENCES category(id) 
       ON DELETE CASCADE 
       ON UPDATE CASCADE`,

      // Cart product references cart (many-to-many)
      `ALTER TABLE cart_product 
       ADD CONSTRAINT fk_cart_product_cart 
       FOREIGN KEY (cart_id) REFERENCES cart(id) 
       ON DELETE CASCADE 
       ON UPDATE CASCADE`,

      // Cart product references product (many-to-many)
      `ALTER TABLE cart_product 
       ADD CONSTRAINT fk_cart_product_product 
       FOREIGN KEY (product_id) REFERENCES product(id) 
       ON DELETE CASCADE 
       ON UPDATE CASCADE`,
    ];

    await this.executeMultipleQueries(db, queries);
  }

  async down(db: Pool): Promise<void> {
    const queries = [
      "ALTER TABLE cart_product DROP FOREIGN KEY fk_cart_product_product",
      "ALTER TABLE cart_product DROP FOREIGN KEY fk_cart_product_cart",
      "ALTER TABLE product_category DROP FOREIGN KEY fk_product_category_category",
      "ALTER TABLE product_category DROP FOREIGN KEY fk_product_category_product",
      "ALTER TABLE order_product DROP FOREIGN KEY fk_order_product_product",
      "ALTER TABLE order_product DROP FOREIGN KEY fk_order_product_order",
      "ALTER TABLE order_history DROP FOREIGN KEY fk_order_history_order",
      "ALTER TABLE shipment DROP FOREIGN KEY fk_shipment_store",
      "ALTER TABLE `order` DROP FOREIGN KEY fk_order_shipment",
      "ALTER TABLE `order` DROP FOREIGN KEY fk_order_employee",
      "ALTER TABLE `order` DROP FOREIGN KEY fk_order_customer",
      "ALTER TABLE product DROP FOREIGN KEY fk_product_promotion",
      "ALTER TABLE cart DROP FOREIGN KEY fk_cart_customer",
      "ALTER TABLE employee DROP FOREIGN KEY fk_employee_store",
      "ALTER TABLE employee DROP FOREIGN KEY fk_employee_user",
      "ALTER TABLE customer DROP FOREIGN KEY fk_customer_user",
      "ALTER TABLE user DROP FOREIGN KEY fk_user_account",
      "ALTER TABLE account DROP FOREIGN KEY fk_account_role",
    ];

    await this.executeMultipleQueries(db, queries);
  }
}
