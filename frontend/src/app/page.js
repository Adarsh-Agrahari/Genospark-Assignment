"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Delete Modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [username, setUsername] = useState("admin");

    // Add Product Modal
    const [showAddModal, setShowAddModal] = useState(false);
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [status, setStatus] = useState("Draft");
    const [createdBy, setCreatedBy] = useState("admin");

    // Edit Product Modal
    const [showEditModal, setShowEditModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [editName, setEditName] = useState("");
    const [editDesc, setEditDesc] = useState("");
    const [editStatus, setEditStatus] = useState("Draft");
    const [updatedBy, setUpdatedBy] = useState("admin");

    const fetchProducts = () => {
        setLoading(true);
        fetch("https://genospark-assignment-sigma.vercel.app/api/products")
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    };

    // Delete Product Handlers
    const handleDeleteClick = (product) => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedProduct) return;

        try {
            const res = await fetch(
                `https://genospark-assignment-sigma.vercel.app/api/products/${selectedProduct.product_id}`,
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

    // Add Product Handler
    const handleAddProduct = async (e) => {
        e.preventDefault();
        const now = new Date();
        const formattedDate = `${
            now.getMonth() + 1
        }/${now.getDate()}/${now.getFullYear()} by ${createdBy}`;

        try {
            const res = await fetch(
                "https://genospark-assignment-sigma.vercel.app/api/products",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name,
                        desc,
                        createdBy,
                        updatedBy: formattedDate,
                        status,
                    }),
                }
            );

            if (!res.ok) throw new Error("Failed to create product");

            // Reset form
            setName("");
            setDesc("");
            setStatus("Draft");
            setCreatedBy("admin");

            setShowAddModal(false);
            fetchProducts();
        } catch (error) {
            console.error("Add product error:", error);
            alert("Something went wrong while adding the product.");
        }
    };

    // Edit Product Handlers
    const handleEditClick = (product) => {
        setEditProduct(product);
        setEditName(product.product_name);
        setEditDesc(product.product_desc);
        setEditStatus(product.status);

        if (product.updated_by) {
            const parts = product.updated_by.split(" by ");
            setUpdatedBy(parts[1] || "admin");
        }

        setShowEditModal(true);
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();

        const now = new Date();
        const formattedDate = `${
            now.getMonth() + 1
        }/${now.getDate()}/${now.getFullYear()} by ${updatedBy}`;

        try {
            const res = await fetch(
                `https://genospark-assignment-sigma.vercel.app/api/products/${editProduct.product_id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: editName,
                        desc: editDesc,
                        status: editStatus,
                        updatedBy: formattedDate,
                    }),
                }
            );

            if (!res.ok) throw new Error("Failed to update product");

            setShowEditModal(false);
            setEditProduct(null);
            setUpdatedBy("admin");
            fetchProducts();
        } catch (error) {
            console.error("Update error:", error);
            alert("Something went wrong while updating.");
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
        <div className="md:px-10 md:py-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow mb-6 flex flex-col justify-between items-center md:flex-row">
                <div>
                    <h1 className="text-2xl font-bold">Products Management</h1>
                    <p className="text-gray-600">
                        Manage your product catalog and publishing status
                    </p>
                </div>
                <div className="flex gap-3 flex-col md:flex-row mt-4 w-full md:w-auto">
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex justify-center items-center gap-2 hover:bg-green-700">
                        <Link href="/live">
                            <div className="flex items-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-5 h-5"
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
                                <span>View Live Site</span>
                            </div>
                        </Link>
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Add New Product
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-100">
                <h2 className="text-lg font-bold p-4">All Products</h2>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-gray-600 bg-gray-50 text-xs border-y border-y-gray-50 hidden md:table-row">
                            <td className="p-2 pl-8">PRODUCT</td>
                            <td className="p-2">STATUS</td>
                            <td className="p-2">CREATED BY</td>
                            <td className="p-2">LAST UPDATED</td>
                            <td className="p-2">ACTIONS</td>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <>
                                <tr
                                    key={product.product_id}
                                    className="border-b border-gray-200 text-xs hidden md:table-row"
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
                                        <button
                                            onClick={() =>
                                                handleEditClick(product)
                                            }
                                            className="text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </button>
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
                                <div className="md:hidden flex flex-col gap-2 border-t border-gray-200 p-4">
                                    <div>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium">
                                                    {product.product_name}
                                                </p>
                                                <p className="text-gray-500 text-sm">
                                                    {product.product_desc}
                                                </p>
                                            </div>
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
                                        </div>

                                        <p className="text-xs text-gray-500 pt-4">
                                            Created by: {product.created_by}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Updated by: {product.updated_by}
                                        </p>
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() =>
                                                handleEditClick(product)
                                            }
                                            className="text-blue-600 hover:underline bg-blue-50 px-4 py-2 w-1/2 rounded-lg text-center"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDeleteClick(product)
                                            }
                                            className="text-red-600 hover:underline bg-red-50 px-4 py-2 w-1/2 rounded-lg text-center"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && selectedProduct && (
                <div className="fixed inset-0 bg-gray-700 bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
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
                        <div className="flex items-start gap-3 mb-4">
                            <div className="text-red-500 text-2xl">⚠️</div>
                            <p className="text-sm text-gray-600">
                                This will <strong>soft-delete</strong> the
                                product “{selectedProduct.product_name}”.
                            </p>
                        </div>
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

            {/* Add Product Modal */}
            {showAddModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-40 z-50">
                    <div className="bg-white rounded-lg shadow-lg w-[400px] p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">
                                Add New Product
                            </h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-gray-500 hover:text-black"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleAddProduct} className="space-y-4">
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
                                    rows={3}
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
                                    onChange={(e) =>
                                        setCreatedBy(e.target.value)
                                    }
                                    className="w-full border rounded p-2 mt-1"
                                />
                            </div>
                            <div className="flex justify-between mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
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
            )}

            {/* Edit Product Modal */}
            {showEditModal && editProduct && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-40 z-50">
                    <div className="bg-white rounded-lg shadow-lg w-[400px] p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">
                                Edit Product
                            </h2>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="text-gray-500 hover:text-black"
                            >
                                ✕
                            </button>
                        </div>

                        <form
                            onSubmit={handleUpdateProduct}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium">
                                    Product Name *
                                </label>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) =>
                                        setEditName(e.target.value)
                                    }
                                    required
                                    className="w-full border rounded p-2 mt-1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">
                                    Description
                                </label>
                                <textarea
                                    value={editDesc}
                                    onChange={(e) =>
                                        setEditDesc(e.target.value)
                                    }
                                    className="w-full border rounded p-2 mt-1"
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">
                                    Status
                                </label>
                                <select
                                    value={editStatus}
                                    onChange={(e) =>
                                        setEditStatus(e.target.value)
                                    }
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
                                    value={updatedBy}
                                    onChange={(e) =>
                                        setUpdatedBy(e.target.value)
                                    }
                                    className="w-full border rounded p-2 mt-1"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Date will be added automatically
                                </p>
                            </div>
                            <div className="flex justify-between mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
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
            )}
        </div>
    );
}
