import pool from "../config/db.js";

export async function getAllProducts() {
    const [rows] = await pool.query(
        "SELECT * FROM Products WHERE is_deleted = FALSE"
    );
    return rows;
}

export async function getProductById(id) {
    const [rows] = await pool.query(
        "SELECT * FROM Products WHERE product_id = ? AND is_deleted = FALSE",
        [id]
    );
    return rows[0];
}

export async function createProduct({ name, desc, createdBy, status }) {
    const [result] = await pool.query(
        "INSERT INTO Products (product_name, product_desc, created_by, status) VALUES (?, ?, ?, ?)",
        [name, desc, createdBy, status]
    );
    return result.insertId;
}

export async function updateProduct(id, { name, desc, updatedBy, status }) {
    await pool.query(
        "UPDATE Products SET product_name=?, product_desc=?, updated_by=?, status=? WHERE product_id=?",
        [name, desc, updatedBy, status, id]
    );
}

export async function deleteProduct(id) {
    await pool.query(
        "UPDATE Products SET is_deleted = TRUE WHERE product_id=?",
        [id]
    );
}
