"use client";

import { useEffect, useState } from "react";

export default function LivePage() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch("https://genospark-assignment-sigma.vercel.app/")
            .then((res) => res.text())
            .then((data) => setMessage(data))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div>
            <h1>Live Backend Status</h1>
            <p>{message || "Loading..."}</p>
        </div>
    );
}
