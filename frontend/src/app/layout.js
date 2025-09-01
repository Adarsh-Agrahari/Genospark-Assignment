export const metadata = {
    title: "Product CMS",
    description: "Frontend for Product CMS",
};

export default function RootLayout({ children }) {
    return (
        <html>
            <body style={{ fontFamily: "sans-serif", margin: "20px" }}>
                {children}
            </body>
        </html>
    );
}
