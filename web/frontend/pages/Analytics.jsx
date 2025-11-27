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
    Paper,
    Dialog,
    DialogContent,
    CircularProgress,
    Backdrop
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
    const [storeData, setStoreData] = useState({});
    const [analytics, setAnalytics] = useState([]);
    const [analyticsData, setAnalyticsData] = useState(mockAnalyticsData);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState({
        store: true,
        analytics: true,
        preview: false
    });

    const getStore = async () => {
        try {
            setLoading(prev => ({ ...prev, store: true }));
            const response = await fetch("/api/get-store");
            const data = await response.json();
            setStoreData(data);
        } catch (error) {
            console.error("Error fetching store data:", error);
        } finally {
            setLoading(prev => ({ ...prev, store: false }));
        }
    };

    const fetchAnalytics = async () => {
        if (!storeData?.domain) return;

        try {
            setLoading(prev => ({ ...prev, analytics: true }));
            const response = await fetch(`/api/get-analytics/${storeData.domain}`);
            const json = await response.json();

            if (!json?.data) return;

            const arr = json.data;

            // Build products dropdown list
            setProducts(
                arr.map(item => ({
                    id: item.productId,
                    title: item.productData?.title || "Unnamed Product",
                    handle: generateHandle(item.productData?.title || "Unnamed Product")
                }))
            );

            // Sticky Usage Graph
            const stickyUsage = arr.map(item => ({
                product: item.productData?.title || item.productId,
                views: item.stickyViews ?? 0,
                addToCartClicks: item.stickyAddToCarts ?? 0
            }));

            // Conversion Graph
            const conversionUplift = arr.map(item => {
                const stickyViews = item.stickyViews || 0;
                const stickyATC = item.stickyAddToCarts || 0;
                const normalATC = item.normalAddToCarts || 0;

                const withSticky = stickyViews > 0 ? (stickyATC / stickyViews) * 100 : 0;
                const withoutSticky = (normalATC > 0)
                    ? (normalATC / (stickyViews + normalATC + stickyATC)) * 100
                    : 0;

                return {
                    product: item.productData?.title || item.productId,
                    withSticky: Number(withSticky.toFixed(2)),
                    withoutSticky: Number(withoutSticky.toFixed(2))
                };
            });

            // Set graph data
            setAnalyticsData({
                stickyUsage,
                conversionUplift
            });

            setAnalytics(arr);
        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setLoading(prev => ({ ...prev, analytics: false }));
        }
    };

    const generateHandle = (title) => {
        return title
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, '-');
    };


    const handlePreview = () => {
        if (!selectedProduct) return;

        const selectedProductData = analytics.find(p => p.productId === selectedProduct);
        if (selectedProductData) {
            const productUrl = `${selectedProductData.productData.onlineStorePreviewUrl}?sticky_preview=true`;
            window.open(productUrl, "_blank"); // Opens in new tab
        }
    };


    useEffect(() => {
        getStore();
    }, []);

    useEffect(() => {
        if (storeData?.domain) {
            fetchAnalytics();
        }
    }, [storeData]);

    const handleClosePreview = () => {
        setPreviewOpen(false);
        setPreviewUrl('');
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
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading.store || loading.analytics}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <Typography variant="h4" gutterBottom>
                Analytics Dashboard
            </Typography>

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
                                disabled={loading.analytics}
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
                            disabled={!selectedProduct || loading.preview}
                            startIcon={loading.preview ? <CircularProgress size={20} /> : null}
                        >
                            {loading.preview ? 'Loading Preview...' : 'Preview StickyCard'}
                        </Button>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        See how the StickyCard looks on real product pages.
                    </Typography>
                </CardContent>
            </Card>

            {/* Sticky Usage */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        StickyCard Usage & Performance
                    </Typography>
                    {loading.analytics ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
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
                    )}
                </CardContent>
            </Card>

            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Conversion Rate Uplift
                    </Typography>
                    {loading.analytics ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
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
                    )}
                </CardContent>
            </Card>

            <Dialog
                open={previewOpen}
                onClose={handleClosePreview}
                maxWidth="lg"
                fullWidth
                sx={{
                    '& .MuiDialog-paper': {
                        height: '80vh'
                    }
                }}
            >
                <DialogContent sx={{ p: 0, height: '100%' }}>
                    {loading.preview ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <iframe
                            src={previewUrl}
                            style={{
                                width: '100%',
                                height: '100%',
                                border: 'none',
                                borderRadius: '4px'
                            }}
                            title="StickyCard Preview"
                            allow="fullscreen"
                        />
                    )}
                </DialogContent>
            </Dialog>

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