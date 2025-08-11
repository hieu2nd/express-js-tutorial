import type { Pool } from "mysql2/promise";
import { BaseMigration } from "../migration";

export class Migration004_SeedRoles extends BaseMigration {
  id = "004_seed_roles";
  name = "Seed default roles data";

  async up(db: Pool): Promise<void> {
    const queries = [
      // Insert default roles
      `INSERT INTO role (name, description, permissions) VALUES 
       ('admin', 'Administrator with full access', '{"all": true}'),
       ('employee', 'Store employee with limited access', '{"orders": ["read", "write"], "products": ["read"], "customers": ["read"]}'),
       ('customer', 'Customer with basic access', '{"profile": ["read", "write"], "orders": ["read"]}')`,
    ];

    await this.executeMultipleQueries(db, queries);
  }

  async down(db: Pool): Promise<void> {
    const queries = [
      // Remove default roles
      "DELETE FROM role WHERE name IN ('admin', 'employee', 'customer')",
    ];

    await this.executeMultipleQueries(db, queries);
  }
}
