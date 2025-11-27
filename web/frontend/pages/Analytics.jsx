import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Box,
    Paper
} from '@mui/material';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';

// --------------------------
// Mock Data (replace with API)
// --------------------------
const mockAnalyticsData = {
    stickyUsage: [
        { product: 'Product A', views: 1200, addToCartClicks: 150, conversionRate: 12.5 },
        { product: 'Product B', views: 800, addToCartClicks: 90, conversionRate: 11.3 },
        { product: 'Product C', views: 1500, addToCartClicks: 210, conversionRate: 14.0 },
        { product: 'Product D', views: 600, addToCartClicks: 45, conversionRate: 7.5 },
    ],
    conversionUplift: [
        { product: 'Product A', withSticky: 12.5, withoutSticky: 8.2 },
        { product: 'Product B', withSticky: 11.3, withoutSticky: 7.1 },
        { product: 'Product C', withSticky: 14.0, withoutSticky: 9.3 },
        { product: 'Product D', withSticky: 7.5, withoutSticky: 5.8 },
    ],
};

const otherApps = [
    { name: 'Upsell Manager', url: 'https://apps.shopify.com/upsell-manager' },
    { name: 'Cart Booster', url: 'https://apps.shopify.com/cart-booster' },
    { name: 'Email Automations', url: 'https://apps.shopify.com/email-automations' }
];

export default function Analytics() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [analyticsData, setAnalyticsData] = useState(mockAnalyticsData);

    // -----------------------------------------
    // Fetch store products (Replace with API)
    // -----------------------------------------
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const mockProducts = [
                    { id: 1, title: 'Product A' },
                    { id: 2, title: 'Product B' },
                    { id: 3, title: 'Product C' },
                    { id: 4, title: 'Product D' },
                ];
                setProducts(mockProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    // -----------------------------------------
    // Preview Button Handler
    // -----------------------------------------
    const handlePreview = () => {
        if (!selectedProduct) return;

        const selectedProductData = products.find(p => p.id === selectedProduct);
        if (selectedProductData) {
            const shopDomain =
                window.Shopify?.shop ||
                window.Shopify?.shopDomain ||
                "your-store.myshopify.com";

            const productHandle = selectedProductData.title.toLowerCase().replace(/\s+/g, "-");

            const productUrl = `https://${shopDomain}/products/${productHandle}?sticky_preview=true`;

            window.open(productUrl, "_blank");
        }
    };

    return (
        <div
            style={{
                width: "100vw",
                marginLeft: "calc(-50vw + 50%)",
                padding: "20px",
                boxSizing: "border-box"
            }}
        >
            <Typography variant="h4" gutterBottom>
                Analytics Dashboard
            </Typography>

            {/* ------------------ Preview Card ------------------ */}
            <Card sx={{ mb: 4, p: 2 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        StickyCard Preview
                    </Typography>

                    <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>Select Product</InputLabel>
                            <Select
                                value={selectedProduct}
                                label="Select Product"
                                onChange={(e) => setSelectedProduct(e.target.value)}
                            >
                                {products.map((product) => (
                                    <MenuItem key={product.id} value={product.id}>
                                        {product.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Button
                            variant="contained"
                            onClick={handlePreview}
                            disabled={!selectedProduct}
                        >
                            Preview StickyCard
                        </Button>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        See how the StickyCard looks on real product pages.
                    </Typography>
                </CardContent>
            </Card>

            {/* ------------------ Graphs ------------------ */}
            {/* Sticky Usage */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        StickyCard Usage & Performance
                    </Typography>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={analyticsData.stickyUsage}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="product" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="views" fill="#8884d8" name="Total Views" />
                            <Bar dataKey="addToCartClicks" fill="#82ca9d" name="Add to Cart Clicks" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Conversion Rate Uplift */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Conversion Rate Uplift
                    </Typography>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={analyticsData.conversionUplift}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="product" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="withSticky" stroke="#8884d8" name="With StickyCard" />
                            <Line type="monotone" dataKey="withoutSticky" stroke="#82ca9d" name="Without StickyCard" />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* ------------------ Cross Promotion ------------------ */}
            <Card sx={{ mt: 4 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Check Out Our Other Apps
                    </Typography>

                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 1 }}>
                        {otherApps.map((app) => (
                            <Paper
                                key={app.name}
                                sx={{
                                    flex: "1 1 30%",
                                    minWidth: 200,
                                    p: 2,
                                    textAlign: "center",
                                    cursor: "pointer",
                                    "&:hover": { backgroundColor: "#eee" }
                                }}
                                onClick={() => window.open(app.url, "_blank")}
                            >
                                <Typography fontWeight="medium">{app.name}</Typography>
                            </Paper>
                        ))}
                    </Box>
                </CardContent>
            </Card>
        </div>
    );
}
