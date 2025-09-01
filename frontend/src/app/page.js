"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true); // track loading state

    const fetchProducts = () => {
        setLoading(true);
        fetch("http://localhost:5000/api/products")
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            const res = await fetch(
                `http://localhost:5000/api/products/${id}`,
                {
                    method: "DELETE",
                }
            );

            if (!res.ok) {
                throw new Error("Failed to delete product");
            }

            fetchProducts();
        } catch (error) {
            console.error("Delete error:", error);
            alert("Something went wrong while deleting.");
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600 font-medium">
                        Loading products...
                    </p>
                </div>
            </div>
        );
    }

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
                    <thead>
                        <tr className="text-gray-600 bg-gray-50 text-xs border-y border-y-gray-50">
                            <td className="p-2 pl-8">PRODUCT</td>
                            <td className="p-2">STATUS</td>
                            <td className="p-2">CREATED BY</td>
                            <td className="p-2">LAST UPDATED</td>
                            <td className="p-2">ACTIONS</td>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr
                                key={product.product_id}
                                className="border-b border-gray-200 text-xs"
                            >
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
                                        <span className="bg-green-100 text-green-800 px-3 py-1 text-xs rounded-full">
                                            Published
                                        </span>
                                    )}
                                    {product.status === "Draft" && (
                                        <span className="bg-gray-100 text-gray-800 px-3 py-1 text-xs rounded-full">
                                            Draft
                                        </span>
                                    )}
                                    {product.status === "Archived" && (
                                        <span className="bg-red-100 text-red-800 px-3 py-1 text-xs rounded-full">
                                            Archived
                                        </span>
                                    )}
                                </td>
                                <td className="py-3 pl-4">
                                    {product.created_by}
                                </td>
                                <td className="py-3 pl-4">
                                    {product.updated_by}
                                </td>
                                <td className="py-3 pl-4 space-x-3">
                                    <Link
                                        href={`/products/${product.product_id}/edit`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() =>
                                            handleDelete(product.product_id)
                                        }
                                        className="text-red-600 hover:underline"
                                    >
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
