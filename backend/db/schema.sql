-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    salary DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO employees (name, position, department, salary) VALUES
    ('John Doe', 'Software Engineer', 'Engineering', 75000.00),
    ('Jane Smith', 'Product Manager', 'Product', 85000.00),
    ('Mike Johnson', 'Data Analyst', 'Analytics', 65000.00),
    ('Sarah Wilson', 'UX Designer', 'Design', 70000.00),
    ('David Brown', 'DevOps Engineer', 'Engineering', 80000.00)
ON CONFLICT DO NOTHING; 