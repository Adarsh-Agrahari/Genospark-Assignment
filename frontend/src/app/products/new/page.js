"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch("http://localhost:5000/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                desc,
                createdBy: "frontend",
                status: "Draft",
            }),
        });
        router.push("/products");
    };

    return (
        <div>
            <h1>Add Product</h1>
            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <br />
                <textarea
                    placeholder="Description"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                />
                <br />
                <button type="submit">Create</button>
            </form>
        </div>
    );
}
