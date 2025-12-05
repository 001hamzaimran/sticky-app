import "./Index.css"
import React, { useState, useEffect } from "react";
import CustomizerPanel from "../components/CustomizerPanel"
import CustomizerPreview from "../components/CustomizerPreview";




const Tabs = () => {
    const [selectedValues, setSelectedValues] = useState({});
    const handleChange = (name, value) => {

        // If range slider change hua → px me convert karo
        if (name === "width") {
          // Limit value to max 25%
          let limitedValue = Math.min(value, 25); // agar value >25 hai to 25 set ho
          let px = Math.round((limitedValue / 25) * 800); // 0–25% ko 0–800px me convert

          setSelectedValues(prev => ({
            ...prev,
            width: limitedValue, 
            customWidth: px
          }));
          return;
        }

        // If text field change hua → slider update karo
        if (name === "customWidth") {
          let pxValue = Number(value);
          if (pxValue > 800) pxValue = 800;

          // px → percentage convert
          let percent = Math.round((pxValue / 800) * 100);
          if (percent > 100) percent = 100;

          setSelectedValues(prev => ({
            ...prev,
            customWidth: pxValue,
            width: percent
          }));
          return;
        }


        


        setSelectedValues((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
      const template = selectedValues.template;

      if (!template) return;

      setSelectedValues(prev => {
        if (template === "white") {
          return {
            ...prev,
            bgType: "single",
            bgColor: "#ffffff",
            productNameColor: "#000000",
            productCompareColor: "#000000",
            productPriceColor: "#000000",
            variantBgColor: "#000000",
            variantTextColor: "#ffffff",
          };
        }

        if (template === "dark") {
          return {
            ...prev,
            bgType: "single",
            bgColor: "#303030",
            productNameColor: "#ffffff",
            productCompareColor: "#ffffff",
            productPriceColor: "#ffffff",
            variantBgColor: "#ffffff",
            variantTextColor: "#000000",
          };
        }

        return prev;
      });
    }, [selectedValues.template]);

    const [selectedProductId, setSelectedProductId] = useState(null);
    const [selectedProductData, setSelectedProductData] = useState(null);
    
    // ✅ Naya function banayein product remove ke liye
    const handleProductRemoveFromPanel = () => {
      setSelectedProductId(null);
      setSelectedProductData(null);
      
      // Agar aap selectedValues me bhi store kar rahe hain to wahan bhi clear karo
      setSelectedValues(prev => ({
        ...prev,
        selectedProductId: null
      }));
      
      console.log("Product removed in Customize component");
    };

    const handleProductSelectFromPanel = (productId, productData) => {
      // CHANGED CODE - product data CustomizerPreview ko pass karo
      setSelectedProductId(productId);
      setSelectedProductData(productData);
    };



    return (
        <main className={`customizer-container ${selectedValues.visibilyDevice === "showMobile" ? "mobile-customizer-container": ""}`}>
            <CustomizerPanel
                onProductSelect={handleProductSelectFromPanel}
                onProductRemove={handleProductRemoveFromPanel}
                selectedValues={selectedValues} 
                setSelectedValues={setSelectedValues} 
                handleChange={handleChange}
            />
            <CustomizerPreview
                productId={selectedProductId}
                productData={selectedProductData}
                selectedValues={selectedValues}
                handleChange={handleChange}
            />
        </main>
    );
};

export default Tabs;