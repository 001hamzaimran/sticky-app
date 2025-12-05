import React, { useState, useEffect } from "react";
import { TextField, Button, Text, Card, Thumbnail } from "@shopify/polaris";
import "./ProductSearchSelect.css";

const ProductSearchSelect = ({
  productsData,
  selectedProductId,
  onProductSelect,
  onProductRemove
}) => {

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showResults, setShowResults] = useState(false);

  
  // Real-time search filter
  useEffect(() => {
    if (productsData && searchQuery.trim() !== "") {
      const filtered = productsData.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
      setShowResults(true);
    } else {
      setFilteredProducts([]);
      setShowResults(false);
    }
  }, [searchQuery, productsData]);

  // Find selected product when ID changes
  useEffect(() => {
    if (selectedProductId && productsData) {
      const product = productsData.find(p => p.id === selectedProductId);
      setSelectedProduct(product);
      setSearchQuery("");
      setShowResults(false);
    } else {
      setSelectedProduct(null);
    }
  }, [selectedProductId, productsData]);

  const handleProductClick = (product) => {
    onProductSelect(product.id, product);
  };

  const handleRemove = () => {
    onProductRemove();
    setSearchQuery("");
  };

  // If product is selected, show preview
  if (selectedProduct) {
    return (
      <div className="selected-product-preview">
        <Card>
          <div className="product-search-container">
            <div className="product-search-item">
              <Thumbnail
                source={
                  selectedProduct.images?.edges[0]?.node?.originalSrc ||
                  "https://cdn.shopify.com/s/assets/no-image-75c5e3d6b1.png"
                }
                alt={selectedProduct.title}
                size="medium"
              />
              <div>
                <Text variant="bodyMd" fontWeight="bold">
                  {selectedProduct.title}
                </Text>
              </div>
            </div>
            <Button destructive onClick={handleRemove} variant="primary" tone="critical">
              Remove
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Show search field
  return (
    <div className="product-search-container" style={{width:"100%"}}>
        <div className="product-search-field" style={{width:"100%"}}>
            <TextField
                label=""
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Type product name..."
                autoComplete="off"
            />
        </div>
      
      
      {/* Search Results Dropdown */}
      {showResults && filteredProducts.length > 0 && (
        <div className="search-results-dropdown">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="search-result-item"
              onClick={() => handleProductClick(product)}
              style={{
                padding: "10px",
                borderBottom: "1px solid #eee",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}
            >
              <Thumbnail
                source={
                  product.images?.edges[0]?.node?.originalSrc ||
                  "https://cdn.shopify.com/s/assets/no-image-75c5e3d6b1.png"
                }
                alt={product.title}
                size="small"
              />
              <div style={{ flex: 1 }}>
                <Text variant="bodyMd">{product.title}</Text>
              </div>
            </div>
          ))}
        </div>
      )}

      {showResults && searchQuery && filteredProducts.length === 0 && (
        <div className="no-results">
          <Text variant="bodySm" color="subdued">
            No products found for "{searchQuery}"
          </Text>
        </div>
      )}
    </div>
  );
};

export default ProductSearchSelect;