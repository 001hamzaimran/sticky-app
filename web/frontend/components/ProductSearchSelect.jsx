// import React, { useState, useEffect } from "react";
// import { TextField, Button, Text, Card, Thumbnail } from "@shopify/polaris";
// import "./ProductSearchSelect.css";

// const ProductSearchSelect = ({
//   productsData,
//   selectedProductId,
//   onProductSelect,
//   onProductRemove
// }) => {

//   const [searchQuery, setSearchQuery] = useState("");
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [showResults, setShowResults] = useState(false);

  
//   // Real-time search filter
//   useEffect(() => {
//     if (productsData && searchQuery.trim() !== "") {
//       const filtered = productsData.filter(product =>
//         product.title.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//       setFilteredProducts(filtered);
//       setShowResults(true);
//     } else {
//       setFilteredProducts([]);
//       setShowResults(false);
//     }
//   }, [searchQuery, productsData]);

//   // Find selected product when ID changes
//   useEffect(() => {
//     if (selectedProductId && productsData) {
//       const product = productsData.find(p => p.id === selectedProductId);
//       setSelectedProduct(product);
//       setSearchQuery("");
//       setShowResults(false);
//     } else {
//       setSelectedProduct(null);
//     }
//   }, [selectedProductId, productsData]);

//   const handleProductClick = (product) => {
//     onProductSelect(product.id, product);
//   };

//   const handleRemove = () => {
//     onProductRemove();
//     setSearchQuery("");
//   };

//   // If product is selected, show preview
//   if (selectedProduct) {
//     return (
//       <div className="selected-product-preview">
//         <Card>
//           <div className="product-search-container">
//             <div className="product-search-item">
//               <Thumbnail
//                 source={
//                   selectedProduct.images?.edges[0]?.node?.originalSrc ||
//                   "https://cdn.shopify.com/s/assets/no-image-75c5e3d6b1.png"
//                 }
//                 alt={selectedProduct.title}
//                 size="medium"
//               />
//               <div>
//                 <Text variant="bodyMd" fontWeight="bold">
//                   {selectedProduct.title}
//                 </Text>
//               </div>
//             </div>
//             <Button destructive onClick={handleRemove} variant="primary" tone="critical">
//               Remove
//             </Button>
//           </div>
//         </Card>
//       </div>
//     );
//   }

//   // Show search field
//   return (
//     <div className="product-search-container" style={{width:"100%"}}>
//         <div className="product-search-field" style={{width:"100%"}}>
//             <TextField
//                 label=""
//                 value={searchQuery}
//                 onChange={setSearchQuery}
//                 placeholder="Type product name..."
//                 autoComplete="off"
//             />
//         </div>
      
      
//       {/* Search Results Dropdown */}
//       {showResults && filteredProducts.length > 0 && (
//         <div className="search-results-dropdown">
//           {filteredProducts.map(product => (
//             <div
//               key={product.id}
//               className="search-result-item"
//               onClick={() => handleProductClick(product)}
//               style={{
//                 padding: "10px",
//                 borderBottom: "1px solid #eee",
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "10px"
//               }}
//             >
//               <Thumbnail
//                 source={
//                   product.images?.edges[0]?.node?.originalSrc ||
//                   "https://cdn.shopify.com/s/assets/no-image-75c5e3d6b1.png"
//                 }
//                 alt={product.title}
//                 size="small"
//               />
//               <div style={{ flex: 1 }}>
//                 <Text variant="bodyMd">{product.title}</Text>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {showResults && searchQuery && filteredProducts.length === 0 && (
//         <div className="no-results">
//           <Text variant="bodySm" color="subdued">
//             No products found for "{searchQuery}"
//           </Text>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductSearchSelect;




// import React, { useState, useEffect, useCallback } from "react";
// import { Select, Text, Thumbnail, Badge } from "@shopify/polaris";
// import "./ProductSearchSelect.css";

// const ProductSearchSelect = ({
//   productsData,
//   selectedProductId,
//   onProductSelect,
//   onProductRemove
// }) => {
//   const [selectedOption, setSelectedOption] = useState(selectedProductId || "");
//   const [dropdownOptions, setDropdownOptions] = useState([]);

//   // Convert products to dropdown options
//   useEffect(() => {
//     if (productsData && productsData.length > 0) {
//       const options = productsData.map(product => ({
//         label: product.title,
//         value: product.id,
//         metadata: {
//           image: product.images?.edges[0]?.node?.originalSrc || null,
//           vendor: product.vendor || "",
//           status: product.status || "ACTIVE"
//         }
//       }));
      
//       // Add empty option for "Select a product"
//       options.unshift({
//         label: "Select a product...",
//         value: ""
//       });
      
//       setDropdownOptions(options);
//     }
//   }, [productsData]);

//   // Update selected option when prop changes
//   useEffect(() => {
//     setSelectedOption(selectedProductId || "");
//   }, [selectedProductId]);

//   const handleSelectChange = useCallback((value) => {
//     setSelectedOption(value);
    
//     if (value === "") {
//       // Empty selection - remove product
//       onProductRemove();
//     } else {
//       // Find selected product
//       const selectedProduct = productsData?.find(p => p.id === value);
//       if (selectedProduct) {
//         onProductSelect(value, selectedProduct);
//       }
//     }
//   }, [productsData, onProductSelect, onProductRemove]);

//   // Custom render option with product image
//   const renderOption = useCallback((option) => {
//     // For empty option
//     if (option.value === "") {
//       return option.label;
//     }

//     return (
//       <div style={{ 
//         display: "flex", 
//         alignItems: "center", 
//         gap: "8px",
//         padding: "4px 0"
//       }}>
//         {option.metadata?.image && (
//           <Thumbnail
//             source={option.metadata.image}
//             alt={option.label}
//             size="small"
//           />
//         )}
//         <div style={{ 
//           display: "flex", 
//           flexDirection: "column",
//           gap: "2px"
//         }}>
//           <Text variant="bodyMd" as="span">
//             {option.label}
//           </Text>
//           {option.metadata?.vendor && (
//             <Text variant="bodySm" color="subdued" as="span">
//               {option.metadata.vendor}
//             </Text>
//           )}
//         </div>
//       </div>
//     );
//   }, []);

//   // Custom render selected value
//   const renderSelected = useCallback((selected) => {
//     const selectedOption = dropdownOptions.find(opt => opt.value === selected);
//     if (!selectedOption || selectedOption.value === "") {
//       return "Select a product...";
//     }

//     return (
//       <div style={{ 
//         display: "flex", 
//         alignItems: "center", 
//         gap: "8px"
//       }}>
//         {selectedOption.metadata?.image && (
//           <Thumbnail
//             source={selectedOption.metadata.image}
//             alt={selectedOption.label}
//             size="small"
//           />
//         )}
//         <div style={{ 
//           display: "flex", 
//           flexDirection: "column",
//           gap: "2px"
//         }}>
//           <div style={{ 
//             display: "flex", 
//             alignItems: "center", 
//             gap: "4px"
//           }}>
//             <Text variant="bodyMd" as="span" fontWeight="medium">
//               {selectedOption.label}
//             </Text>
//             {selectedOption.metadata?.status && (
//               <Badge tone={selectedOption.metadata.status === 'ACTIVE' ? 'success' : 'warning'}>
//                 {selectedOption.metadata.status}
//               </Badge>
//             )}
//           </div>
//           {selectedOption.metadata?.vendor && (
//             <Text variant="bodySm" color="subdued" as="span">
//               {selectedOption.metadata.vendor}
//             </Text>
//           )}
//         </div>
//       </div>
//     );
//   }, [dropdownOptions]);

//   // For search functionality inside dropdown
//   const handleSearchChange = useCallback((searchValue) => {
//     // If you want to implement search inside dropdown
//     // You can filter dropdownOptions here
//     console.log("Searching:", searchValue);
//   }, []);

//   return (
//     <div className="product-search-select" style={{ width: "100%" }}>
//       <Select
//         label=""
//         options={dropdownOptions}
//         onChange={handleSelectChange}
//         value={selectedOption}
//         placeholder="Select a product..."
//         disabled={!productsData || productsData.length === 0}
//         helpText={!productsData || productsData.length === 0 ? "Loading products..." : undefined}
        
//         // Optional: Enable search in dropdown
//         filterable={true}
//         onSearchChange={handleSearchChange}
//       />
//     </div>
//   );
// };

// export default ProductSearchSelect;



import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Autocomplete, Thumbnail, Text, Badge } from "@shopify/polaris";
import "./ProductSearchSelect.css";

const ProductSearchSelect = ({
  productsData,
  selectedProductId,
  onProductSelect,
  onProductRemove
}) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);

  // Update when selectedProductId changes
  useEffect(() => {
    if (selectedProductId && productsData) {
      const product = productsData.find(p => p.id === selectedProductId);
      if (product) {
        setSelectedOptions([selectedProductId]);
        setInputValue(product.title); // Show selected product in input
      }
    } else {
      setSelectedOptions([]);
      setInputValue('');
    }
  }, [selectedProductId, productsData]);

  // Convert products to options format
  useEffect(() => {
    if (productsData && productsData.length > 0) {
      const formattedOptions = productsData.map(product => ({
        value: product.id,
        label: product.title,
        image: product.images?.edges[0]?.node?.originalSrc || null,
        vendor: product.vendor || '',
        status: product.status || 'ACTIVE'
      }));
      setOptions(formattedOptions);
    }
  }, [productsData]);

  const updateText = useCallback((value) => {
    setInputValue(value);
  }, []);

  const updateSelection = useCallback((selected) => {
    const selectedValue = selected[0];
    
    if (!selectedValue) {
      // Remove product
      onProductRemove();
      setSelectedOptions([]);
      setInputValue('');
      return;
    }

    // Find selected product
    const selectedProduct = productsData?.find(p => p.id === selectedValue);
    if (selectedProduct) {
      // Check if already selected (clicking same item toggles)
      if (selectedOptions.includes(selectedValue)) {
        onProductRemove();
        setSelectedOptions([]);
        setInputValue('');
      } else {
        onProductSelect(selectedValue, selectedProduct);
        setSelectedOptions([selectedValue]);
        setInputValue(selectedProduct.title);
      }
    }
  }, [productsData, onProductSelect, onProductRemove, selectedOptions]);

  // Filter options based on search
  const filteredOptions = useMemo(() => {
    if (!inputValue.trim()) {
      return options.slice(0, 20); // Show first 20 when empty
    }
    
    const searchLower = inputValue.toLowerCase();
    return options.filter(option => 
      option.label.toLowerCase().includes(searchLower) ||
      (option.vendor && option.vendor.toLowerCase().includes(searchLower))
    ).slice(0, 20); // Limit to 20 results
  }, [options, inputValue]);

  // TextField for Autocomplete
  const textField = (
    <Autocomplete.TextField
      onChange={updateText}
      label="Search and select a product"
      value={inputValue}
      placeholder="Type product name..."
      autoComplete="off"
    />
  );

  // Custom render function for options
  const renderOption = useCallback((option) => {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 12px',
        gap: '12px',
        cursor: 'pointer'
      }}>
        {option.image && (
          <div style={{ flexShrink: 0 }}>
            <Thumbnail
              source={option.image}
              alt={option.label}
              size="small"
            />
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            marginBottom: '4px'
          }}>
            <Text variant="bodyMd" fontWeight="medium" truncate>
              {option.label}
            </Text>
            {option.status && option.status !== 'ACTIVE' && (
              <Badge tone="warning">
                {option.status}
              </Badge>
            )}
          </div>
          {option.vendor && (
            <Text variant="bodySm" color="subdued" truncate>
              {option.vendor}
            </Text>
          )}
        </div>
      </div>
    );
  }, []);

  return (
    <div style={{ width: '100%' }}>
      <Autocomplete
        options={filteredOptions}
        selected={selectedOptions}
        onSelect={updateSelection}
        textField={textField}
        loading={!productsData}
        willLoadMoreResults={false}
        emptyState={
          <div style={{ padding: '12px' }}>
            <Text variant="bodySm" color="subdued">
              No products found
            </Text>
          </div>
        }
        preferredPosition="below"
        allowMultiple={false}
        listTitle="Products"
      />
      
      {/* Selected product info */}
      {selectedProductId && productsData && (
        <div style={{ marginTop: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #dfe3e8'
          }}>
            {productsData.find(p => p.id === selectedProductId)?.images?.edges[0]?.node?.originalSrc && (
              <Thumbnail
                source={productsData.find(p => p.id === selectedProductId).images.edges[0].node.originalSrc}
                alt={productsData.find(p => p.id === selectedProductId).title}
                size="medium"
              />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Text variant="bodyMd" fontWeight="bold">
                  {productsData.find(p => p.id === selectedProductId)?.title}
                </Text>
                <Badge tone="success">Selected</Badge>
              </div>
              {productsData.find(p => p.id === selectedProductId)?.vendor && (
                <Text variant="bodySm" color="subdued">
                  Vendor: {productsData.find(p => p.id === selectedProductId).vendor}
                </Text>
              )}
              <button
                onClick={onProductRemove}
                style={{
                  marginTop: '8px',
                  padding: '3px 7px',
                  backgroundColor: '#bf0711',
                  color: '#fff',
                  border: '1px solid #bf0711',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  width: "60px"
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSearchSelect;