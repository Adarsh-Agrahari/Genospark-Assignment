"use client";
import "./globals.css";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function HomePage() {
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
        <div className="px-10 py-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-white p-6 rounded-lg shadow mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Products Management</h1>
                    <p className="text-gray-600">
                        Manage your product catalog and publishing status
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                        </svg>
                        View Live Site
                    </button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        Add New Product
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-100">
                <h2 className="text-lg font-bold p-4">All Products</h2>
                <table className="w-full text-left border-collapse">
                    <thead className="m-8">
                        <tr className="text-gray-600 bg-gray-50 p-8 text-xs border-y border-y-gray-50">
                            <td className="p-2 pl-8">PRODUCT</td>
                            <td className="p-2">STATUS</td>
                            <td className="p-2">CREATED BY</td>
                            <td className="p-2">LAST UPDATED</td>
                            <td className="p-2">ACTIONS</td>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.product_id} className="border-b border-gray-200 text-xs">
                                <td className="py-3">
                                    <div className="pl-8">
                                        <p className="font-medium text-xs pb-1">
                                            {product.product_name}
                                        </p>
                                        <p className="text-gray-500 text-xs">
                                            {product.product_desc}
                                        </p>
                                    </div>
                                </td>
                                <td className="py-3">
                                    {product.status === "Published" && (
                                        <span className="bg-green-100 text-green-600 px-3 py-1 text-xs rounded-full">
                                            Published
                                        </span>
                                    )}
                                    {product.status === "Draft" && (
                                        <span className="bg-gray-200 text-gray-600 px-3 py-1 text-xs rounded-full">
                                            Draft
                                        </span>
                                    )}
                                    {product.status === "Archived" && (
                                        <span className="bg-gray-200 text-gray-600 px-3 py-1 text-xs rounded-full">
                                            Archived
                                        </span>
                                    )}
                                </td>
                                <td className="py-3 pl-4">{product.created_by}</td>
                                <td className="py-3 pl-4">{product.updated_by}</td>
                                <td className="py-3 pl-4 space-x-3">
                                    <button className="text-blue-600 hover:underline">
                                        Edit
                                    </button>
                                    <button className="text-red-600 hover:underline">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
