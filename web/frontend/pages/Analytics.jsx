import React, { useState, useEffect, useMemo } from 'react';
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
    Backdrop,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Tooltip,
    Divider
} from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis
} from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PreviewIcon from '@mui/icons-material/Preview';
import InfoIcon from '@mui/icons-material/Info';

const otherApps = [
    { name: 'CartBoost AI', url: 'https://apps.shopify.com/cart-boost-ai?st_source=autocomplete&surface_detail=autocomplete_apps', image: 'https://cdn.shopify.com/app-store/listing_images/799deea5f642fac375dab8470d93bc5c/icon/CLjLqJ3WzY4DEAE=.jpeg' },
    { name: 'ABboost: A/B Testing', url: 'https://apps.shopify.com/boostab-a-b-testing?st_source=autocomplete&surface_detail=autocomplete_apps', image: 'https://cdn.shopify.com/app-store/listing_images/522f1c73dcc3a2505dddf4e16185da86/icon/CJbN0czL9o8DEAE=.jpeg' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#4ECDC4'];

export default function Analytics() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('all');
    const [storeData, setStoreData] = useState({});
    const [analytics, setAnalytics] = useState([]);
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
            console.log('Analytics Data:', arr);

            // Build products dropdown list
            setProducts([
                { id: 'all', title: 'All Products', handle: 'all' },
                ...arr.map(item => ({
                    id: item.productId,
                    title: item.productData?.title || "Unnamed Product",
                    handle: item.productData?.handle || "unnamed-product",
                    price: item.productData?.variants?.edges[0]?.node?.price || "0",
                    image: item.productData?.media?.edges[0]?.node?.preview?.image?.url
                }))
            ]);

            setAnalytics(arr);
        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setLoading(prev => ({ ...prev, analytics: false }));
        }
    };

    // Memoized computed data
    const processedData = useMemo(() => {
        if (!analytics.length) return null;

        let filteredAnalytics = analytics;
        if (selectedProduct !== 'all') {
            filteredAnalytics = analytics.filter(item => item.productId === selectedProduct);
        }

        // 1. Sticky Usage Data
        const stickyUsage = filteredAnalytics.map(item => ({
            product: item.productData?.title || item.productId,
            views: item.stickyViews ?? 0,
            stickyAddToCarts: item.stickyAddToCarts ?? 0,
            normalAddToCarts: item.normalAddToCarts ?? 0,
            totalAddToCarts: (item.stickyAddToCarts ?? 0) + (item.normalAddToCarts ?? 0)
        }));

        // 2. Conversion Uplift Data
        const conversionUplift = filteredAnalytics.map(item => {
            const stickyViews = item.stickyViews || 0;
            const stickyATC = item.stickyAddToCarts || 0;
            const normalATC = item.normalAddToCarts || 0;

            const withSticky = stickyViews > 0 ? (stickyATC / stickyViews) * 100 : 0;
            const withoutSticky = (stickyViews + normalATC) > 0 ?
                (normalATC / (stickyViews + normalATC)) * 100 : 0;

            return {
                product: item.productData?.title || item.productId,
                withSticky: Number(withSticky.toFixed(2)),
                withoutSticky: Number(withoutSticky.toFixed(2)),
                uplift: Number((withSticky - withoutSticky).toFixed(2))
            };
        });

        // 3. Click Distribution Data (for Pie Chart)
        const totalStickyClicks = filteredAnalytics.reduce((sum, item) => sum + (item.stickyAddToCarts || 0), 0);
        const totalNormalClicks = filteredAnalytics.reduce((sum, item) => sum + (item.normalAddToCarts || 0), 0);
        const clickDistribution = [
            { name: 'StickyCard Clicks', value: totalStickyClicks },
            { name: 'Product Button Clicks', value: totalNormalClicks },
        ];

        // 4. Performance Metrics
        const performanceMetrics = filteredAnalytics.map(item => {
            const stickyViews = item.stickyViews || 0;
            const stickyATC = item.stickyAddToCarts || 0;
            const normalATC = item.normalAddToCarts || 0;

            const stickyConversionRate = stickyViews > 0 ? (stickyATC / stickyViews) * 100 : 0;
            const totalConversionRate = (stickyViews + normalATC) > 0 ?
                ((stickyATC + normalATC) / (stickyViews + normalATC)) * 100 : 0;

            return {
                product: item.productData?.title || item.productId,
                stickyViews,
                stickyClicks: stickyATC,
                normalClicks: normalATC,
                stickyConversionRate: Number(stickyConversionRate.toFixed(2)),
                totalConversionRate: Number(totalConversionRate.toFixed(2))
            };
        });

        // 5. Radar Chart Data
        const radarData = filteredAnalytics.map(item => {
            const stickyViews = item.stickyViews || 0;
            const stickyATC = item.stickyAddToCarts || 0;
            const normalATC = item.normalAddToCarts || 0;

            return {
                subject: item.productData?.title?.substring(0, 15) + '...' || item.productId,
                'Sticky Views': Math.min(stickyViews, 100), // Normalize for radar chart
                'Sticky Clicks': Math.min(stickyATC * 10, 100),
                'Normal Clicks': Math.min(normalATC * 10, 100),
                'Conversion Rate': Math.min((stickyATC / (stickyViews || 1)) * 1000, 100)
            };
        });

        // 6. Summary Statistics
        const totalStickyViews = filteredAnalytics.reduce((sum, item) => sum + (item.stickyViews || 0), 0);
        const totalClicks = totalStickyClicks + totalNormalClicks;
        const avgConversionRate = filteredAnalytics.length > 0 ?
            (conversionUplift.reduce((sum, item) => sum + item.withSticky, 0) / filteredAnalytics.length) : 0;

        return {
            stickyUsage,
            conversionUplift,
            clickDistribution,
            performanceMetrics,
            radarData,
            summary: {
                totalProducts: filteredAnalytics.length,
                totalStickyViews,
                totalStickyClicks,
                totalNormalClicks,
                totalClicks,
                avgConversionRate: Number(avgConversionRate.toFixed(2))
            }
        };
    }, [analytics, selectedProduct]);

    const handlePreview = () => {
        if (!selectedProduct || selectedProduct === 'all') return;

        const selectedProductData = analytics.find(p => p.productId === selectedProduct);
        if (selectedProductData) {
            const productUrl = `${selectedProductData.productData.onlineStorePreviewUrl}?sticky_preview=true`;
            window.open(productUrl, "_blank");
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

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <Paper sx={{ p: 2, bgcolor: 'background.paper', boxShadow: 3 }}>
                    <Typography variant="subtitle2">{label}</Typography>
                    {payload.map((entry, index) => (
                        <Typography key={index} variant="body2" sx={{ color: entry.color }}>
                            {entry.name}: {entry.value}
                        </Typography>
                    ))}
                </Paper>
            );
        }
        return null;
    };

    return (
        <Box sx={{
            width: "100%",
            p: 3,
            bgcolor: '#f5f5f5',
            minHeight: '100vh'
        }}>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading.store || loading.analytics}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 600, color: '#1a237e', mb: 1 }}>
                    Analytics Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Track your StickyCard performance and conversion metrics
                </Typography>
            </Box>

            {/* Summary Cards */}
            {processedData && (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            height: '100%'
                        }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <VisibilityIcon sx={{ mr: 1 }} />
                                    <Typography variant="h6">Total Views</Typography>
                                </Box>
                                <Typography variant="h4">
                                    {processedData.summary.totalStickyViews}
                                </Typography>
                                <Typography variant="caption">
                                    StickyCard impressions
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{
                            bgcolor: 'secondary.main',
                            color: 'white',
                            height: '100%'
                        }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <ShoppingCartIcon sx={{ mr: 1 }} />
                                    <Typography variant="h6">Total Clicks</Typography>
                                </Box>
                                <Typography variant="h4">
                                    {processedData.summary.totalClicks}
                                </Typography>
                                <Typography variant="caption">
                                    {processedData.summary.totalStickyClicks} from StickyCard
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{
                            bgcolor: 'success.main',
                            color: 'white',
                            height: '100%'
                        }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <TrendingUpIcon sx={{ mr: 1 }} />
                                    <Typography variant="h6">Avg Conversion</Typography>
                                </Box>
                                <Typography variant="h4">
                                    {processedData.summary.avgConversionRate}%
                                </Typography>
                                <Typography variant="caption">
                                    Average conversion rate
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{
                            bgcolor: 'info.main',
                            color: 'white',
                            height: '100%'
                        }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <PreviewIcon sx={{ mr: 1 }} />
                                    <Typography variant="h6">Products</Typography>
                                </Box>
                                <Typography variant="h4">
                                    {processedData.summary.totalProducts}
                                </Typography>
                                <Typography variant="caption">
                                    Using StickyCard
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Product Selector Card */}
            <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Product Analytics
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Select a product to view detailed analytics
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                            <FormControl sx={{ minWidth: 250 }}>
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
                                disabled={!selectedProduct || selectedProduct === 'all' || loading.preview}
                                startIcon={<PreviewIcon />}
                                sx={{
                                    bgcolor: 'primary.main',
                                    '&:hover': { bgcolor: 'primary.dark' }
                                }}
                            >
                                Preview StickyCard
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Main Analytics Grid */}
            <Grid container spacing={3}>
                {/* Click Distribution Pie Chart */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <ShoppingCartIcon sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="h6">Click Distribution</Typography>
                                <Tooltip title="Distribution between StickyCard clicks and regular product button clicks">
                                    <IconButton size="small">
                                        <InfoIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            {loading.analytics ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={processedData?.clickDistribution || []}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {processedData?.clickDistribution?.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip formatter={(value) => [`${value} clicks`, 'Clicks']} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Conversion Uplift Line Chart */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <TrendingUpIcon sx={{ mr: 1, color: 'success.main' }} />
                                <Typography variant="h6">Conversion Rate Comparison</Typography>
                            </Box>
                            {loading.analytics ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={processedData?.conversionUplift || []}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                        <XAxis
                                            dataKey="product"
                                            angle={-45}
                                            textAnchor="end"
                                            height={60}
                                        />
                                        <YAxis label={{ value: 'Conversion Rate %', angle: -90, position: 'insideLeft' }} />
                                        <RechartsTooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="withSticky"
                                            stroke="#8884d8"
                                            name="With StickyCard"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="withoutSticky"
                                            stroke="#82ca9d"
                                            name="Without StickyCard"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Performance Bar Chart */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Performance Overview
                            </Typography>
                            {loading.analytics ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={processedData?.stickyUsage || []}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                        <XAxis
                                            dataKey="product"
                                            angle={-45}
                                            textAnchor="end"
                                            height={80}
                                        />
                                        <YAxis />
                                        <RechartsTooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Bar dataKey="views" fill="#0088FE" name="Sticky Views" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="stickyAddToCarts" fill="#00C49F" name="StickyCard Clicks" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="normalAddToCarts" fill="#FFBB28" name="Button Clicks" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Radar Chart for Detailed Metrics */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 2, boxShadow: 3, height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Product Performance Radar
                            </Typography>
                            {loading.analytics ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <ResponsiveContainer width="100%" height={400}>
                                    <RadarChart data={processedData?.radarData || []}>
                                        <PolarGrid />
                                        <PolarAngleAxis dataKey="subject" />
                                        <PolarRadiusAxis />
                                        <Radar name="Performance" dataKey="Sticky Views" stroke="#0088FE" fill="#0088FE" fillOpacity={0.6} />
                                        <Radar name="Performance" dataKey="Sticky Clicks" stroke="#00C49F" fill="#00C49F" fillOpacity={0.6} />
                                        <RechartsTooltip />
                                        <Legend />
                                    </RadarChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Detailed Table */}
                <Grid item xs={12}>
                    <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Detailed Performance Metrics
                            </Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: 'action.hover' }}>
                                            <TableCell><strong>Product</strong></TableCell>
                                            <TableCell align="right"><strong>Sticky Views</strong></TableCell>
                                            <TableCell align="right"><strong>StickyCard Clicks</strong></TableCell>
                                            <TableCell align="right"><strong>Button Clicks</strong></TableCell>
                                            <TableCell align="right"><strong>Sticky Conversion</strong></TableCell>
                                            <TableCell align="right"><strong>Total Conversion</strong></TableCell>
                                            <TableCell align="center"><strong>Status</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {processedData?.performanceMetrics?.map((row, index) => (
                                            <TableRow key={index} hover>
                                                <TableCell>{row.product}</TableCell>
                                                <TableCell align="right">{row.stickyViews}</TableCell>
                                                <TableCell align="right">{row.stickyClicks}</TableCell>
                                                <TableCell align="right">{row.normalClicks}</TableCell>
                                                <TableCell align="right">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                        {row.stickyConversionRate}%
                                                        {row.stickyConversionRate > 10 ? (
                                                            <TrendingUpIcon sx={{ ml: 1, color: 'success.main', fontSize: 16 }} />
                                                        ) : (
                                                            <TrendingDownIcon sx={{ ml: 1, color: 'error.main', fontSize: 16 }} />
                                                        )}
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="right">{row.totalConversionRate}%</TableCell>
                                                <TableCell align="center">
                                                    <Chip
                                                        label={row.stickyConversionRate > row.totalConversionRate ? "Performing" : "Needs Attention"}
                                                        color={row.stickyConversionRate > row.totalConversionRate ? "success" : "warning"}
                                                        size="small"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Other Apps Section */}
            {/* <Card sx={{ mt: 4, borderRadius: 2, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Boost Your Store with These Apps
                    </Typography>
                    <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mt: 2 }}>
                        {otherApps.map((app) => (
                            <Card
                                key={app.name}
                                sx={{
                                    width: 280,
                                    cursor: "pointer",
                                    borderRadius: 2,
                                    boxShadow: 3,
                                    transition: "transform 0.2s, box-shadow 0.2s",
                                    "&:hover": {
                                        transform: "translateY(-4px)",
                                        boxShadow: 6,
                                    },
                                }}
                                onClick={() => window.open(app.url, "_blank")}
                            >
                                <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                                    <img
                                        src={app.image}
                                        alt={app.name}
                                        style={{
                                            width: "100%",
                                            height: 160,
                                            objectFit: "cover",
                                            borderTopLeftRadius: "8px",
                                            borderTopRightRadius: "8px",
                                        }}
                                    />
                                </Box>
                                <Box sx={{ p: 2 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, textAlign: "center" }}>
                                        {app.name}
                                    </Typography>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        sx={{ mt: 2 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(app.url, "_blank");
                                        }}
                                    >
                                        View App
                                    </Button>
                                </Box>
                            </Card>
                        ))}
                    </Box>
                </CardContent>
            </Card> */}
        </Box>
    );
}