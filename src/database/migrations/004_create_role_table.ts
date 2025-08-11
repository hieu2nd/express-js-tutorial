import type { Pool } from "mysql2/promise";
import { BaseMigration } from "../migration";

export class Migration004_CreateRoleTable extends BaseMigration {
  id = "004_create_role_table";
  name = "Create role table and add role_id to account";

  async up(db: Pool): Promise<void> {
    const queries = [
      // Create role table
      "CREATE TABLE IF NOT EXISTS role (" +
        "id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT, " +
        "name VARCHAR(255) NOT NULL UNIQUE, " +
        "description TEXT, " +
        "permissions JSON, " +
        "is_active BOOLEAN DEFAULT TRUE, " +
        "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
        "updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" +
        ")",

      // Add role_id column to account table
      "ALTER TABLE account ADD COLUMN role_id INT(11) DEFAULT NULL",

      // Add foreign key constraint from account to role
      "ALTER TABLE account ADD CONSTRAINT fk_account_role " +
        "FOREIGN KEY (role_id) REFERENCES role(id) " +
        "ON DELETE SET NULL ON UPDATE CASCADE",

      // Insert default roles
      "INSERT INTO role (name, description, permissions) VALUES " +
        "('admin', 'Administrator with full access', '{\"all\": true}'), " +
        '(\'employee\', \'Store employee with limited access\', \'{"orders": ["read", "write"], "products": ["read"], "customers": ["read"]}\'), ' +
        '(\'customer\', \'Customer with basic access\', \'{"profile": ["read", "write"], "orders": ["read"]}\')',

      // Add index for better performance
      "CREATE INDEX idx_account_role_id ON account(role_id)",
      "CREATE INDEX idx_role_name ON role(name)",
      "CREATE INDEX idx_role_is_active ON role(is_active)",
    ];

    await this.executeMultipleQueries(db, queries);
  }

  async down(db: Pool): Promise<void> {
    const queries = [
      // Drop indexes
      "DROP INDEX IF EXISTS idx_role_is_active ON role",
      "DROP INDEX IF EXISTS idx_role_name ON role",
      "DROP INDEX IF EXISTS idx_account_role_id ON account",

      // Drop foreign key constraint
      "ALTER TABLE account DROP FOREIGN KEY IF EXISTS fk_account_role",

      // Drop role_id column from account
      "ALTER TABLE account DROP COLUMN IF EXISTS role_id",

      // Drop role table
      "DROP TABLE IF EXISTS role",
    ];

    await this.executeMultipleQueries(db, queries);
  }
}
