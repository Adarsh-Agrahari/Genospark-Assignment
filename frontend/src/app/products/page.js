"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);

    const fetchProducts = () => {
        fetch("http://localhost:5000/api/products")
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.error(err));
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure?")) return;
        await fetch(`http://localhost:5000/api/products/${id}`, {
            method: "DELETE",
        });
        fetchProducts();
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div>
            <h1>Products</h1>
            <Link href="/products/new">➕ Add New</Link>
            <ul>
                {products.map((p) => (
                    <li key={p.product_id}>
                        <b>{p.product_name}</b> ({p.status}){" "}
                        <Link href={`/products/${p.product_id}/edit`}>
                            ✏️ Edit
                        </Link>{" "}
                        <button onClick={() => handleDelete(p.product_id)}>
                            🗑️ Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
