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
    const [updatedBy, setUpdatedBy] = useState("admin");

    useEffect(() => {
        fetch(`http://localhost:5000/api/products/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setName(data.product_name);
                setDesc(data.product_desc);
                setStatus(data.status);
                if (data.updated_by) {
                    // Extract only the "user" part if format is "MM/DD/YYYY by user"
                    const parts = data.updated_by.split(" by ");
                    setUpdatedBy(parts[1] || "admin");
                }
            });
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();

        const now = new Date();
        const formattedDate = `${
            now.getMonth() + 1
        }/${now.getDate()}/${now.getFullYear()} by ${updatedBy}`;

        await fetch(`http://localhost:5000/api/products/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                desc,
                status,
                updatedBy: formattedDate,
            }),
        });

        router.push("/");
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
                <h1 className="text-xl font-semibold mb-4">Edit Product</h1>

                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            placeholder="Enter product name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full border rounded p-2 mt-1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">
                            Description
                        </label>
                        <textarea
                            placeholder="Enter product description"
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            className="w-full border rounded p-2 mt-1"
                            rows="3"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">
                            Status
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full border rounded p-2 mt-1"
                        >
                            <option>Draft</option>
                            <option>Published</option>
                            <option>Archived</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">
                            Updated By
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your name (e.g., admin, editor)"
                            value={updatedBy}
                            onChange={(e) => setUpdatedBy(e.target.value)}
                            className="w-full border rounded p-2 mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Date will be added automatically
                        </p>
                    </div>

                    <div className="flex justify-between mt-6">
                        <button
                            type="button"
                            onClick={() => router.push("/")}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Update Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
