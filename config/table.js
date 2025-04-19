// table.js
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

export const createListingsTable = async (connection) => {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS listings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      business_name VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      email VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      address TEXT NOT NULL,
      city VARCHAR(100) NOT NULL,
      state VARCHAR(100) NOT NULL,
      pincode VARCHAR(10) NOT NULL,
      website VARCHAR(255),
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("✅ Listings table ensured.");
};

export const createDoctorsTable = async (connection) => {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS doctors (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      specialty VARCHAR(255),
      description TEXT,
      address VARCHAR(255),
      contact VARCHAR(20),
      image VARCHAR(255),
      map_link TEXT
    );
  `);
  console.log("✅ Doctors table ensured.");
};

export const createContactMessagesTable = async (connection) => {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(20),
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("✅ Contact Messages table ensured.");
};

export const createReviewsTable = async (connection) => {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INT AUTO_INCREMENT PRIMARY KEY,
      doctor_id INT,
      rating FLOAT,
      comment TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
    );
  `);
  console.log("✅ Reviews table ensured.");
};

export const createDoctorTimingsTable = async (connection) => {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS doctor_timings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      doctor_id INT,
      day VARCHAR(20),
      opening_time TIME,
      closing_time TIME,
      FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
    );
  `);
  console.log("✅ Doctor Timings table ensured.");
};

export const createDoctorPersonalDetailsTable = async (connection) => {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS doctor_personal_details (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      photo_url VARCHAR(255),
      facebook_url VARCHAR(255),
      twitter_url VARCHAR(255),
      instagram_url VARCHAR(255),
      linkedin_url VARCHAR(255)
    );
  `);
  console.log("✅ Doctor Personal Details table ensured.");
};

export const createPhotosTable = async (connection) => {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS photos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      doctor_id INT,
      photo_url VARCHAR(255),
      description VARCHAR(255),
      FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
    );
  `);
  console.log("✅ Photos table ensured.");
};

export const createVideosTable = async (connection) => {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS videos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      doctor_id INT,
      video_url VARCHAR(255),
      FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
    );
  `);
  console.log("✅ Videos table ensured.");
};

export const createServicesTable = async (connection) => {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS services (
      id INT AUTO_INCREMENT PRIMARY KEY,
      doctor_id INT,
      service_name VARCHAR(255),
      service_description TEXT,
      FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
    );
  `);
  console.log("✅ Services table ensured.");
};

// Centralized init function
export const initializeTables = async (connection) => {
  await createUsersTable(connection);
  await createPlansTable(connection);
  await createEnquiryTable(connection);
  await createListingsTable(connection);
  await createDoctorsTable(connection);
  await createContactMessagesTable(connection);
  await createReviewsTable(connection);
  await createDoctorTimingsTable(connection);
  await createDoctorPersonalDetailsTable(connection);
  await createPhotosTable(connection);
  await createVideosTable(connection);
  await createServicesTable(connection);
  console.log("✅ All tables initialized.");
};
