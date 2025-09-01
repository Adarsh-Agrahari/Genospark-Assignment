export const metadata = {
    title: "Product CMS",
    description: "Frontend for Product CMS",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body style={{ fontFamily: "sans-serif", margin: "20px" }}>
                <nav style={{ marginBottom: "20px" }}>
                    <a href="/">Home</a> | <a href="/products">Products</a> |{" "}
                    <a href="/products/new">Add Product</a>
                </nav>
                {children}
            </body>
        </html>
    );
}
