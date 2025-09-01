import pool from "../config/db.js";

export async function getAllProducts() {
    const res = await pool.query(
        "SELECT * FROM products WHERE is_deleted = FALSE"
    );
    return res.rows;
}

export async function getProductById(id) {
    const res = await pool.query(
        "SELECT * FROM products WHERE product_id = $1 AND is_deleted = FALSE",
        [id]
    );
    return res.rows[0];
}

export async function createProduct({ name, desc, createdBy, status }) {
    const res = await pool.query(
        "INSERT INTO products (product_name, product_desc, created_by, status) VALUES ($1, $2, $3, $4) RETURNING product_id",
        [name, desc, createdBy, status]
    );
    return res.rows[0].product_id;
}

export async function updateProduct(id, { name, desc, updatedBy, status }) {
    await pool.query(
        "UPDATE products SET product_name=$1, product_desc=$2, updated_by=$3, status=$4 WHERE product_id=$5",
        [name, desc, updatedBy, status, id]
    );
}

export async function deleteProduct(id) {
    await pool.query(
        "UPDATE products SET is_deleted = TRUE WHERE product_id=$1",
        [id]
    );
}
