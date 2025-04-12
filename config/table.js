
export const createUsersTable = async (connection) => {
  try {
    // Step 1: Check if table exists
    const [rows] = await connection.execute(`
      SELECT COUNT(*) AS count
      FROM information_schema.tables 
      WHERE table_schema = ? 
      AND table_name = 'Users'
      LIMIT 1
    `, [process.env.DB_NAME]);

    const tableExists = rows[0].count > 0;

    if (tableExists) {
      return;
    } else {
      // Step 2: Create the table
      await connection.execute(`
        CREATE TABLE Users (
          id INT PRIMARY KEY AUTO_INCREMENT,
          profile_image LONGBLOB,

          first_name VARCHAR(100) NULL,
          last_name VARCHAR(100) NULL,
          full_name VARCHAR(100) NOT NULL,  

          email VARCHAR(150) NOT NULL UNIQUE,
          password VARCHAR(150) NOT NULL,
          phone VARCHAR(20) NOT NULL UNIQUE,

          address_line_1 VARCHAR(255),
          address_line_2 VARCHAR(255),
          city VARCHAR(100) NOT NULL,
          pincode VARCHAR(20) NOT NULL,
          state VARCHAR(100) NOT NULL,
          country VARCHAR(100) NOT NULL,  

          about TEXT,

          facebook VARCHAR(255),
          twitter VARCHAR(255),
          linkedin VARCHAR(255),
          instagram VARCHAR(255),
          pinterest VARCHAR(255),

          user_type ENUM('user', 'admin', 'superadmin') DEFAULT 'user',

          otp VARCHAR(6),                   
          is_verified BOOLEAN DEFAULT false,  

          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
      `);

      console.log("✅ Users table created.");
    }
  } catch (error) {
    console.error("❌ Error creating Users table:", error.message);
  }
};
