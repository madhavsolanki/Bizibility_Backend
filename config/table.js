// USERS TABLE
export const createUsersTable = async (connection) => {
  try {
    // Step 1: Check if table exists
    const [rows] = await connection.execute(
      `
      SELECT COUNT(*) AS count
      FROM information_schema.tables 
      WHERE table_schema = ? 
      AND table_name = 'Users'
      LIMIT 1
    `,
      [process.env.DB_NAME]
    );

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
          full_name VARCHAR(255) NULL,

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

// PLANS TABLE
export const createPlansTable = async (connection) => {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS plans (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(50) NOT NULL,
      price INT NOT NULL,
      duration ENUM('monthly', 'yearly') NOT NULL,
      features JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // post JSON,
  // posting JSON,
  // duration_days INT NOT NULL,
  console.log("✅ Plans table ensured.");
};

// ENQUIRY TABLE
export const createEnquiryTable = async (connection) => {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS enquiry (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      plan_id INT,
      fullname VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      email VARCHAR(255) NOT NULL,
      category VARCHAR(255) NOT NULL,
      approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (plan_id) REFERENCES plans(id)
    );
  `);
  console.log("✅ Enquiry table ensured.");
};

// LISTINGS TABLE
export const createListingsTable = async (connection) => {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS listings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      plan_id INT(11) DEFAULT NULL,
      user_id INT(11) DEFAULT NULL,
      business_name VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      category VARCHAR(100) NOT NULL,
      address TEXT NOT NULL,
      city VARCHAR(100) NOT NULL,
      state VARCHAR(100) NOT NULL,
      pincode VARCHAR(10) NOT NULL,
      website VARCHAR(255) DEFAULT NULL,
      description TEXT DEFAULT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      googlemap LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(googlemap)),
      logo VARCHAR(255) DEFAULT NULL,
      image VARCHAR(255) DEFAULT NULL,
      video VARCHAR(255) DEFAULT NULL,
      faq LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(faq)),
      sociallinks LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(sociallinks)),
      business_hour LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(business_hour)),
      email_owner VARCHAR(255) DEFAULT NULL,
      video_link VARCHAR(500) DEFAULT NULL,
      tagline VARCHAR(255) DEFAULT NULL,
      custom_fields LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(custom_fields)),
      payment_status ENUM('success','pending') DEFAULT 'pending',
      gallery_images LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(gallery_images)),
      tags VARCHAR(255) DEFAULT NULL,
      profile_image VARCHAR(2083) DEFAULT NULL,
      price_details LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(price_details))
    );
  `);

  console.log("✅ Listings table ensured.");
};

export const createCarrersTable = async (connection) => {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS carrers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        title VARCHAR(255) NOT NULL,
        skills TEXT NOT NULL,
        experience VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        location VARCHAR(255) NOT NULL,
        employment_type VARCHAR(50),
        salary_range VARCHAR(100),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE
    );
  `);
  console.log("✅ Carreers table ensured.");
};

// Centralized init function
export const initializeTables = async (connection) => {
  await createUsersTable(connection);
  await createPlansTable(connection);
  await createEnquiryTable(connection);
  await createListingsTable(connection);
  await createCarrersTable(connection);

  console.log("✅ All tables initialized.");
};
