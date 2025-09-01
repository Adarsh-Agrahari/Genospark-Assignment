import * as ProductModel from "../models/product.model.js";

export async function getProducts(req, res) {
    try {
        const products = await ProductModel.getAllProducts();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function getProduct(req, res) {
    try {
        const product = await ProductModel.getProductById(req.params.id);
        if (!product) return res.status(404).json({ message: "Not found" });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function createProduct(req, res) {
    try {
        const { name, desc, createdBy, updatedBy, status } = req.body;
        const id = await ProductModel.createProduct({
            name,
            desc,
            createdBy,
            updatedBy,
            status,
        });
        res.status(201).json({ id, message: "Product created" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function updateProduct(req, res) {
    try {
        const { name, desc, updatedBy, status } = req.body;
        await ProductModel.updateProduct(req.params.id, {
            name,
            desc,
            updatedBy,
            status,
        });
        res.json({ message: "Product updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function deleteProduct(req, res) {
    try {
        await ProductModel.deleteProduct(req.params.id);
        res.json({ message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
