"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [username, setUsername] = useState("admin");

    const fetchProducts = () => {
        setLoading(true);
        fetch("http://localhost:5000/api/products")
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    };

    const handleDeleteClick = (product) => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedProduct) return;

        try {
            const res = await fetch(
                `http://localhost:5000/api/products/${selectedProduct.product_id}`,
                {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ deleted_by: username }),
                }
            );

            if (!res.ok) {
                throw new Error("Failed to delete product");
            }

            setShowDeleteModal(false);
            setSelectedProduct(null);
            setUsername("admin");
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
                        <Link href={`/products/new`}>Add New Product</Link>
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
                                            handleDeleteClick(product)
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

            {/* Delete Modal */}
            {showDeleteModal && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">
                                Delete Product
                            </h2>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="text-gray-500 hover:text-gray-800"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Warning */}
                        <div className="flex items-start gap-3 mb-4">
                            <div className="text-red-500 text-2xl">⚠️</div>
                            <p className="text-sm text-gray-600">
                                This will <strong>soft-delete</strong> the
                                product “{selectedProduct.product_name}”. The
                                product will be hidden from the main view but
                                can be recovered if needed.
                            </p>
                        </div>

                        {/* Product Details */}
                        <div className="bg-gray-50 border rounded-lg p-3 mb-4 text-sm">
                            <p>
                                <span className="font-medium">Name:</span>{" "}
                                {selectedProduct.product_name}
                            </p>
                            <p>
                                <span className="font-medium">Status:</span>{" "}
                                {selectedProduct.status}
                            </p>
                            <p>
                                <span className="font-medium">Created by:</span>{" "}
                                {selectedProduct.created_by}
                            </p>
                        </div>

                        {/* Username input */}
                        <div className="mb-4">
                            <label className="text-sm font-medium">
                                Your Name/Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 bg-gray-200 rounded-md text-sm hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
