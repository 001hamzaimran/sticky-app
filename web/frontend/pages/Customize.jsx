import "./Index.css"
import React, { useState } from "react";
import CustomizerPanel from "../components/CustomizerPanel"
import CustomizerPreview from "../components/CustomizerPreview";




const Tabs = () => {
    const [selectedValues, setSelectedValues] = useState({});
    return (
        <main className="customizer-container">
            <CustomizerPanel 
                selectedValues={selectedValues} 
                setSelectedValues={setSelectedValues} 
            />
            <CustomizerPreview
                selectedValues={selectedValues}/>
        </main>
    );
};

export default Tabs;