import "./Index.css"
import React, { useState } from "react";
import CustomizerPanel from "../components/CustomizerPanel"
import CustomizerPreview from "../components/CustomizerPreview";




const Tabs = () => {
    const [selectedValues, setSelectedValues] = useState({});
    const handleChange = (name, value) => {
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