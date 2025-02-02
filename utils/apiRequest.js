export async function apiRequest(endpoint, method = "GET", body = null) {
    try {
        const API = `${process.env.NEXT_PUBLIC_API}/${endpoint}`;
        const response = await fetch(API, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: body ? JSON.stringify(body) : undefined, 
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("API Request Error:", error);
        return null;
    }
}
