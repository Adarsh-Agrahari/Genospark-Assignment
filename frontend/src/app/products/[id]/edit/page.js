"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [status, setStatus] = useState("Draft");

    useEffect(() => {
        fetch(`http://localhost:5000/api/products/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setName(data.product_name);
                setDesc(data.product_desc);
                setStatus(data.status);
            });
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        await fetch(`http://localhost:5000/api/products/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                desc,
                status,
                updatedBy: "frontend",
            }),
        });
        router.push("/products");
    };

    return (
        <div>
            <h1>Edit Product</h1>
            <form onSubmit={handleUpdate}>
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
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option>Draft</option>
                    <option>Published</option>
                    <option>Archived</option>
                </select>
                <br />
                <button type="submit">Update</button>
            </form>
        </div>
    );
}
