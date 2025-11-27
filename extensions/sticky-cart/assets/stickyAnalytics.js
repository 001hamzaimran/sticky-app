const createandUpdateStickyAnalytics = async (shop, body) => {
    try {
        const response = await fetch(`https://${shop}/apps/Sticky/create-analytics`, { method: "POST", body: JSON.stringify(body) });
        const data = await response.json();
        console.log("Analytics data:", data);

        return data;
    } catch (error) {
        console.error("Error fetching analytics data:", error);
    }
}

export { createandUpdateStickyAnalytics };