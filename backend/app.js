require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const { body, validationResult } = require("express-validator");

const app = express();
app.use(cors()); // adjust origin in production
app.use(express.json());

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "sql12345",
    database: "cmsdb",
    port: 3306,
});

// Health
app.get("/health", (req, res) => res.json({ ok: true }));

// Create product
app.post(
    "/api/products",
    [
        body("product_name").isString().trim().isLength({ min: 1, max: 100 }),
        body("product_desc").optional().isString(),
        body("status").optional().isIn(["Draft", "Published", "Archived"]),
        body("created_by").isString().trim().isLength({ min: 1, max: 50 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        const {
            product_name,
            product_desc = null,
            status = "Draft",
            created_by,
        } = req.body;

        try {
            const [result] = await pool.execute(
                `INSERT INTO Products (product_name, product_desc, status, created_by)
         VALUES (?, ?, ?, ?)`,
                [product_name, product_desc, status, created_by]
            );
            const insertId = result.insertId;
            const [rows] = await pool.execute(
                `SELECT * FROM Products WHERE product_id = ?`,
                [insertId]
            );
            res.status(201).json(rows[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "DB error" });
        }
    }
);

// Update product (name/desc/status) - sets updated_by
app.put(
    "/api/products/:id",
    [
        body("product_name")
            .optional()
            .isString()
            .trim()
            .isLength({ min: 1, max: 100 }),
        body("product_desc").optional().isString(),
        body("status").optional().isIn(["Draft", "Published", "Archived"]),
        body("updated_by").isString().trim().isLength({ min: 1, max: 50 }),
    ],
    async (req, res) => {
        const { id } = req.params;
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        const { product_name, product_desc, status, updated_by } = req.body;

        try {
            // Build dynamic update
            const updates = [];
            const params = [];

            if (product_name !== undefined) {
                updates.push("product_name = ?");
                params.push(product_name);
            }
            if (product_desc !== undefined) {
                updates.push("product_desc = ?");
                params.push(product_desc);
            }
            if (status !== undefined) {
                updates.push("status = ?");
                params.push(status);
            }

            updates.push("updated_by = ?");
            params.push(updated_by);

            if (updates.length === 0)
                return res.status(400).json({ error: "No fields to update" });

            params.push(id);

            const sql = `UPDATE Products SET ${updates.join(
                ", "
            )} WHERE product_id = ? AND is_deleted = FALSE`;
            const [result] = await pool.execute(sql, params);

            if (result.affectedRows === 0)
                return res.status(404).json({ error: "Product not found" });

            const [rows] = await pool.execute(
                `SELECT * FROM Products WHERE product_id = ?`,
                [id]
            );
            res.json(rows[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "DB error" });
        }
    }
);

// Soft delete
app.delete("/api/products/:id", async (req, res) => {
    const { id } = req.params;
    const updated_by = req.query.by || "system"; // or from auth
    try {
        const [result] = await pool.execute(
            `UPDATE Products SET is_deleted = TRUE, updated_by = ? WHERE product_id = ? AND is_deleted = FALSE`,
            [updated_by, id]
        );
        if (result.affectedRows === 0)
            return res
                .status(404)
                .json({ error: "Product not found or already deleted" });
        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
});

// Get single product (including draft/archived) - for CMS editing
app.get("/api/products/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.execute(
            `SELECT * FROM Products WHERE product_id = ?`,
            [id]
        );
        if (!rows.length) return res.status(404).json({ error: "Not found" });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
});

// List products for CMS (include drafts & archived but not deleted) with simple pagination
app.get("/api/products", async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const pageSize = Math.min(100, parseInt(req.query.size || "20", 10));
    const offset = (page - 1) * pageSize;

    try {
        const [rows] = await pool.execute(
            `SELECT product_id, product_name, status, created_by, created_at, updated_by, updated_at
       FROM Products
       WHERE is_deleted = FALSE
       ORDER BY updated_at DESC
       LIMIT ? OFFSET ?`,
            [pageSize, offset]
        );
        res.json({ page, pageSize, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
});

// Public: fetch live published products (for website)
app.get("/public/products", async (req, res) => {
    try {
        const [rows] = await pool.execute(
            `SELECT product_id, product_name, product_desc
       FROM Products
       WHERE status = 'Published' AND is_deleted = FALSE
       ORDER BY updated_at DESC`
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Products API listening on ${PORT}`));
