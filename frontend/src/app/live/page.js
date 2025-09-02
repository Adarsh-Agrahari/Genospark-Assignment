"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const now = new Date().toLocaleDateString();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(
                    "https://genospark-assignment-sigma.vercel.app/api/products"
                );
                const data = await res.json();

                // ✅ Only published products
                const publishedProducts = data.filter(
                    (product) => product.status === "Published"
                );

                setProducts(publishedProducts);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    console.log("products", products);

    return (
        <div className="w-full bg-gray-50">
            <div className="container mx-auto md:px-8 md:py-12 relative">
                {/* Top-right button */}
                <button
                    onClick={() => router.push("/")}
                    className="absolute top-6 right-6 px-4 py-2 text-blue text-blue-600 hover:text-blue-800 text-sm font-medium rounded-lg transition hidden md:block"
                >
                    ← Back to Admin
                </button>

                {/* Header */}
                <div className="flex flex-col text-center w-full mb-12">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Our Products
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Discover our latest published products
                    </p>
                    <button
                        onClick={() => router.push("/")}
                        className="px-4 py-2 text-blue text-blue-600 hover:text-blue-800 text-sm font-medium rounded-lg transition md:hidden"
                    >
                        ← Back to Admin
                    </button>
                </div>

                {/* Published Products */}
                <div className="rounded-2xl md:p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Published Products ({products.length})
                    </h2>
                    <p className="text-gray-500 mb-6">
                        These products are currently live and visible to the
                        public.
                    </p>

                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="ml-3 text-gray-500">
                                Loading products...
                            </span>
                        </div>
                    ) : products.length === 0 ? (
                        <p className="text-gray-500">
                            No products published yet.
                        </p>
                    ) : (
                        <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="p-6 rounded-xl shadow-sm hover:shadow-md transition bg-white"
                                >
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {product.product_name}
                                        </h3>
                                        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                                            Live
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-sm mt-2">
                                        {product.product_desc}
                                    </p>
                                    <hr className="my-4 opacity-10" />
                                    <div className="mt-4 flex-col md:flex-row flex justify-between text-xs text-gray-500">
                                        <span>Published</span>
                                        <span>ID: {product.product_id}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {/* Footer */}
            <div className="text-center mt-12 text-gray-500 text-sm bg-white p-4">
                <p>Products Management System – Live View</p>
                <p>Last updated: {now}</p>
            </div>
        </div>
    );
}
