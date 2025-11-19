import "./Index.css"
import React, { useState } from "react";
import CustomizerPanel from "../components/CustomizerPanel"
import CustomizerPreview from "../components/CustomizerPreview";




const Tabs = () => {
    const [selectedValues, setSelectedValues] = useState({});
    const handleChange = (name, value) => {
        // If range slider change hua → px me convert karo
  if (name === "width") {
    let px = Math.round((value / 100) * 800);
    if (px > 1440) px = 800;
    setSelectedValues(prev => ({
      ...prev,
      width: value,
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
    return (
        <main className="customizer-container">
            <CustomizerPanel 
                selectedValues={selectedValues} 
                setSelectedValues={setSelectedValues} 
                handleChange={handleChange}
            />
            <CustomizerPreview
                selectedValues={selectedValues}
                handleChange={handleChange}
            />
        </main>
    );
};

export default Tabs;