"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [status, setStatus] = useState("Draft");
    const [createdBy, setCreatedBy] = useState("admin");

    const now = new Date();
    const formattedDate = `${
        now.getMonth() + 1
    }/${now.getDate()}/${now.getFullYear()} by admin`;

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch("http://localhost:5000/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                desc,
                createdBy,
                updatedBy: formattedDate,
                status,
            }),
        });
        router.push("/");
    };

    return (
        <div>
            <div className="fixed inset-0 flex items-center justify-center ">
                <div className="bg-white rounded-lg shadow-lg w-[400px] p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">
                            Add New Product
                        </h2>
                        <button
                            onClick={() => router.push("/")}
                            className="text-gray-500 hover:text-black"
                        >
                            ✕
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
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
                                Created By
                            </label>
                            <input
                                type="text"
                                value={createdBy}
                                readOnly
                                className="w-full border rounded p-2 mt-1 bg-gray-100"
                            />
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
                                Create Product
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
