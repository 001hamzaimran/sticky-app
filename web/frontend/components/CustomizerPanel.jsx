
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Modal,
  Checkbox,
  RadioButton,
  TextField,
  Button,
  Text,
  RangeSlider,
  Select,
} from "@shopify/polaris";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import tabsData from "../assets/TabsData.js";
import "../assets/style.css";

export default function CustomizerPanel({ selectedValues, setSelectedValues, handleChange }) {
  const [activeTab, setActiveTab] = useState(null);
  const [activeModal, setActiveModal] = useState(false);
  const [storeData, setStoreData] = useState(null);
  const [productsData, setProductsData] = useState(null);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [excludedProductsIds, setexcludedProductsIds] = useState([]);
  const [saving, setSaving] = useState(false);
  const [stickyCartSettings, setStickyCartSettings] = useState({});
  const [loading, setLoading] = useState(false);





  const handleColorChange = (name, value) => {
    let newValue = value;

    // Agar value HEX text input se aa rahi hai
    if (typeof value === "string" && value.startsWith("#") && value.length === 7) {
      newValue = value.toLowerCase();
    }

    setSelectedValues((prev) => {
      const updated = { ...prev, [name]: newValue };

      // Agar ye picker field hai aur corresponding Code field hai, sync karo
      if (!name.endsWith("Code") && prev.hasOwnProperty(name + "Code")) {
        updated[name + "Code"] = newValue;
      }

      // Agar ye Code field hai, toh corresponding picker bhi update karo
      if (name.endsWith("Code")) {
        const pickerField = name.replace(/Code$/, "");
        if (prev.hasOwnProperty(pickerField)) {
          updated[pickerField] = newValue;
        }
      }

      return updated;
    });
  };

  const getStickyCartSettings = async () => {
    setLoading(true);
    try {
      if (!storeData?.domain) {
        console.warn("Store domain not available yet.");
        return;
      }
      const response = await fetch(`/api/get-sticky-cart/${storeData.domain}`);
      const result = await response.json();
      const settings = result.data;

      if (!settings || !settings.enabled) {
        parent.style.display = 'none';
        return;
      }

      console.log("Fetched sticky cart settings:", settings);

      setStickyCartSettings(settings);
    } catch (error) {
      console.error("Error fetching sticky cart settings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStickyCartSettings();
  }, [storeData?.domain]);

  const getProducts = async () => {
    try {
      const response = await fetch("/api/get-products");
      const data = await response.json();
      // console.log("Products data:", data);
      setProductsData(data.data.map(item => item.node));

    } catch (error) {
      console.error("Error fetching products data:", error);
    }
  }


  const toggleProductSelection = (productId) => {
    console.log("Toggling product selection for ID:", productId);
    // const snippedID = productId.split("/").pop();
    // console.log("Snipped ID:", snippedID);
    setSelectedProductIds((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };
  const toggleExcludedProductSelection = (productId) => {
    // const productId = productId.split("/").pop();

    setexcludedProductsIds((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };



  const getStore = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/get-store");
      const data = await response.json();
      setStoreData(data);
      // console.log("Store data:", data);
    } catch (error) {
      console.error("Error fetching store data:", error);
    }
  }

  const handleSaveSettings = async () => {
    if (!storeData?.domain) {
      alert("Store data not found!");
      return;
    }

    setSaving(true);
    // Construct schema-aligned payload
    console.log(selectedValues.counterVisibilty)
    const payload = {
      shop: storeData.domain,
      enabled: true,
      displayMode: selectedValues.showBar || "always",
      // displayScope should match schema enum
      displayScope:
        selectedValues.stickyCart === "always"
          ? "all_products"
          : selectedValues.stickyCart === "specific-products"
            ? "selected_products"
            : selectedValues.stickyCart === "exclude-products"
              ? "exclude_products"
              : "all_products",

      selectedProducts:
        selectedValues.stickyCart === "specific-products"
          ? selectedProductIds.map(id => id.split("/").pop())
          : [],
      excludedProducts:
        selectedValues.stickyCart === "exclude-products"
          ? excludedProductsIds.map(id => id.split("/").pop())
          : [],

      selectedCollections: [],

      banner: {
        show: !!selectedValues.announcementEnabled,
        text: selectedValues.announcementText || "Get it while it lasts",
        backgroundColor: selectedValues.announcementBgColor || "#14FFC4",
        textColor: selectedValues.announcementFontColor || "#ffffff",
        // fontWeight: ["normal", "bold"].includes(selectedValues.announcementFontWeight)
        //   ? selectedValues.announcementFontWeight
        //   : "bold",
        // fontStyle: ["normal", "italic"].includes(selectedValues.announcementFontStyle)
        //   ? selectedValues.announcementFontStyle
        //   : "normal",
        fontWeight: selectedValues.announcementFontWeight || true,
        fontStyle: selectedValues.announcementFontStyle || false,
        underline: !!selectedValues.announcementFontDecoration,
        Countdown: selectedValues.counterVisibilty,
        coundownDate: selectedValues.timerType === "countdown-to-date" ? selectedValues.countdownDate + " " + selectedValues.countdownTime : null,
        fixedminute: selectedValues.timerType === "fixed-minutes" ? selectedValues.timerDays + " " + selectedValues.timerHour + " " + selectedValues.timerMinutes + " " + selectedValues.timerSeconds : null,
        TimerEnd: selectedValues.counterVisibilty,
      },

      productDetails: {
        showTitle: !!selectedValues.showName,
        titleBold: selectedValues.productNameWeight === "bold",
        titleColor: selectedValues.productNameColor || "#ffffff",
        titleSize: Number(selectedValues.productNameSize) || 16,

        showPrice: !!selectedValues.showPrice,
        priceColor: selectedValues.productPriceColor || "#ffffff",
        priceSize: Number(selectedValues.productPriceSize) || 14,
        priceBold: selectedValues.productPriceWeight === "bold",

        showComparePrice: !!selectedValues.showComparedPrice,
        comparePriceColor: selectedValues.productCompareColor || "#a1a1a1",
        comparePriceSize: Number(selectedValues.productCompareSize) || 14,
        comparePriceBold: selectedValues.productCompareFont === "bold",

        showImage: !!selectedValues.showImage,
      },

      variantSelector: {
        show: !!selectedValues.showVariant,
        backgroundColor: selectedValues.variantBgColor || " #000000",
        textColor: selectedValues.variantTextColor || "#ffffff",
        fontSize: Number(selectedValues.variantTextSize) || 14,
        isBold: selectedValues.variantTextFont === "bold",
      },

      quantitySelector: {
        show: !!selectedValues.showQuantity,
        fontSize: Number(selectedValues.qtyTextSize) || 14,
        textColor: selectedValues.qtyTextColor || "#FFFFFF",
        borderColor: selectedValues.qtyBorderColor || "#CCCCCC",
        borderSize: Number(selectedValues.qtyBorderSize) || 0,
        backgroundColor: selectedValues.qtyBgColor || " #000000",
        iconColor: selectedValues.qtyIconColor || "#EEEEEE",
        // iconBackgroundColor: selectedValues.qtyIconBgColor || " #000000",
        borderRadius: Number(selectedValues.qtyBorderRadius) || 0,
      },

      addToCartButton: {
        text: selectedValues.buttonText || "Add to Cart",
        backgroundColor: selectedValues.buttonBgColor || "#007CDB",
        textColor: selectedValues.buttonTextColor || "#FFFFFF",
        action: ["cart", "checkout", "stay"].includes(selectedValues.buttonAction)
          ? selectedValues.buttonAction
          : "cart",
        fontSize: Number(selectedValues.buttonTextSize) || 16,
        borderSize: Number(selectedValues.buttonBorderWidth) || 0,
        borderRadius: Number(selectedValues.buttonBorderRadius) || 4,
        borderColor: selectedValues.buttonBorderColor || "#000000",
        soldOutText: selectedValues.soldOutText || "Sold Out",
        soldOutBackgroundColor: selectedValues.soldOutBgColor || "#000000",
        soldOutBorderSize: Number(selectedValues.soldOutBorderSize) || 0,
        soldOutBorderColor: selectedValues.soldOutBorderColor || "#000000",
        soldOutBorderRadius: Number(selectedValues.buttonBorderRadius) || 0,
      },
      container: {
        onDesktop: selectedValues.showDektopDevice || true,
        onMobile: selectedValues.showMobileDevice || true,
        borderSize: Number(selectedValues.borderSize) || 0,
        borderColor: selectedValues.borderColor || "#000000",
        shadow: !!selectedValues.dropShadow,
        position: selectedValues.positionVertical || "bottom",
        backgroundColor:
          selectedValues.bgType === "gradient"
            ? `linear-gradient(${selectedValues.gradientAngle ?? 0}deg, ${selectedValues.gradientColor1}, ${selectedValues.gradientColor2})`
            : selectedValues.bgColor || "#000000",
        fontFamily: selectedValues.fontFamily || "Arial, sans-serif",
        size: selectedValues.size || "full",
        CondensedValue: selectedValues.customWidth || 800,
        horizontalPosition: selectedValues.positionHorizontal === "right" ? "right" : "left" || "left",
        BottomOffset: Number(selectedValues.bottomOffset) || 0,
        TopOffset: Number(selectedValues.topOffset) || 0,
        RightOffset: Number(selectedValues.rightOffset) || 0,
        LeftOffset: Number(selectedValues.leftOffset) || 0,
        Template: selectedValues.template || "dark",
      },



    };

    try {
      console.log("Saving sticky cart with payload:", payload);
      console.log("Selected Values:", selectedProductIds, excludedProductsIds);
      const response = await fetch("/api/add-sticky-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Sticky cart saved:", data);
      alert(data.message || "Settings saved successfully!");
    } catch (error) {
      console.error("Error saving sticky cart:", error);
      alert("Error saving settings!");
    } finally {
      setSaving(false);
    }
  };

  // Helper to safely parse gradient or color
  const getContainerBgColor = (container) => {
    if (!container) return "#000000";

    const bg = container.backgroundColor?.trim() || "#000000";

    // Check if gradient is valid
    if (bg.startsWith("linear-gradient")) {
      if (
        bg.includes("undefined") // if any undefined
      ) {
        return "#000000"; // fallback to solid color
      }
      return bg;
    }

    // otherwise assume it's a solid color
    return bg;
  };



  useEffect(() => {
    getStore();
    getProducts();
  }, []);

  useEffect(() => {
    const {
      banner,
      productDetails,
      variantSelector,
      quantitySelector,
      addToCartButton,
      container,
    } = stickyCartSettings;

    if (!container?.backgroundColor) return;

    let bgType = "single";
    let bgColor = "#000000";
    let gradientAngle = 0;
    let gradientColor1 = "#000000";
    let gradientColor2 = "#ffffff";

    const bg = container.backgroundColor;

    if (bg.startsWith("linear-gradient")) {
      bgType = "gradient";
      const matches = bg.match(
        /linear-gradient\((\d+)deg,\s*(#[0-9a-fA-F]+),\s*(#[0-9a-fA-F]+|undefined)\)/
      );
      gradientAngle = matches ? Number(matches[1]) : 0;
      gradientColor1 = matches && matches[2] ? matches[2] : "#000000";
      gradientColor2 = matches && matches[3] && matches[3] !== "undefined" ? matches[3] : "#ffffff";
      bgColor = gradientColor1; // fallback for single-color picker
    } else {
      bgType = "single";
      bgColor = bg;
    }

    setSelectedValues((prev) => ({
      ...prev,
      // Gradient / background
      bgType,
      bgColor,
      gradientAngle,
      gradientColor1,
      gradientColor2,

      // Setting
      hideSoldOut: addToCartButton?.soldOutText ? true : false,
      showBar: stickyCartSettings.displayMode ?? "scroll",
      stickyCart: stickyCartSettings.displayScope === "all_products" ? "all-products" : stickyCartSettings.displayScope === "specific_products" ? "specific-products" : stickyCartSettings.displayScope ?? "all-products",


      // Banner
      counterVisibilty: banner?.TimerEnd ?? "hide",
      announcementFontSize: banner?.fontSize ?? "14",
      announcementFontStyle: banner?.fontStyle ?? true,
      announcementFontWeight: banner?.fontWeight ?? true,
      announcementFontDecoration: banner?.underline ?? false,
      announcementEnabled: banner?.show ?? false,
      announcementText: banner?.text ?? "Get it while it lasts",
      announcementBgColor: banner?.backgroundColor ?? "#00FFC2",
      announcementFontColor: banner?.textColor ?? "#000000",
      timerType:
        banner?.coundownDate && banner.coundownDate !== "" && banner.coundownDate !== null
          ? "countdown-to-date"
          : "fixed-minutes",

      countdownDate: banner?.coundownDate
        ? banner.coundownDate.split(" ")[0]
        : "",

      countdownTime: banner?.coundownDate
        ? banner.coundownDate.split(" ")[1]
        : "",

      // FIXED SAFE SPLIT
      ...(() => {
        const fixedParts = banner?.fixedminute
          ? banner.fixedminute.split(" ")
          : ["0", "0", "0", "1"];

        return {
          timerDays: fixedParts[0],
          timerHour: fixedParts[1],
          timerMinutes: fixedParts[2],
          timerSeconds: fixedParts[3],
        };
      })(),



      // Product details
      showImage: productDetails?.showImage ?? true,
      showName: productDetails?.showTitle ?? true,
      showPrice: productDetails?.showPrice ?? true,
      showComparedPrice: productDetails?.showComparePrice ?? false,
      productNameColor: productDetails?.titleColor ?? "#FFFFFF",
      productNameWeight: productDetails?.titleBold ?? true,
      productNameSize: productDetails?.titleSize ?? 14,
      productPriceColor: productDetails?.priceColor ?? "#FFFFFF",
      productCompareFont: productDetails?.comparePriceBold ?? false,
      productCompareColor: productDetails?.comparePriceColor ?? "#aaa",
      productPriceSize: productDetails?.priceSize ?? 14,
      productCompareSize: productDetails?.comparePriceSize ?? 14,
      productNameSize: productDetails?.titleSize ?? 14,
      productPriceWeight: productDetails?.priceBold ?? true,

      // Variant
      showVariant: variantSelector?.show ?? true,
      variantTextSize: variantSelector?.fontSize ?? 14,
      variantTextColor: variantSelector?.textColor ?? "#FFFFFF",
      variantBgColor: variantSelector?.backgroundColor ?? "transparent",
      variantTextWeight: variantSelector?.isBold ?? false,
      variantBorderColor: quantitySelector?.borderColor ?? "#000000",
      variantBorderSize: quantitySelector?.borderSize ?? 1,
      variantBorderRadius: quantitySelector?.borderRadius ?? 0,

      // Quantity
      showQuantity: quantitySelector?.show ?? true,
      qtyTextSize: quantitySelector?.fontSize ?? 14,
      qtyTextColor: quantitySelector?.textColor ?? "#FFFFFF",
      qtyIconColor: quantitySelector?.iconColor ?? "#000000",
      // qtyBorderColor: quantitySelector?.borderColor ?? "#CCCCCC",
      qtyBorderRadius: quantitySelector?.borderRadius ?? 0,

      // Button
      buttonText: addToCartButton?.text ?? "Add to Cart",
      buttonTextSize: addToCartButton?.fontSize ?? 16,
      buttonFontWeight: addToCartButton?.fontWeight ?? "bold",
      buttonTextColor: addToCartButton?.textColor ?? "#FFFFFF",
      buttonBgColor: addToCartButton?.backgroundColor ?? "#007CDB",
      buttonBorderColor: addToCartButton?.borderColor ?? "#000000",
      buttonBorderWidth: addToCartButton?.borderSize ?? 0,
      buttonBorderRadius: addToCartButton?.borderRadius ?? 4,
      buttonAction: addToCartButton?.action ?? "cart",
      soldOutText: addToCartButton?.soldOutText ?? "Sold Out",
      soldOutBgColor: addToCartButton?.soldOutBackgroundColor ?? "#FFFFFF",
      soldOutBorderColor: addToCartButton?.soldOutBorderColor ?? "#000000",

      // Containers
      dropShadow: container?.shadow ?? false,
      containerBorderRadius: container?.borderRadius ?? 8,
      position: container?.position ?? "bottom",
      borderSize: container?.borderSize ?? 0,
      borderColor: container?.borderColor ?? "#000000",
      fontFamily: container?.fontFamily ?? "Arial, sans-serif",
      bottomOffset: container?.BottomOffset ?? 0,
      customWidth: container?.CondensedValue ?? 800,
      leftOffset: container?.LeftOffset ?? 0,
      rightOffset: container?.RightOffset ?? 0,
      topOffset: container?.TopOffset ?? 0,
      template: container?.Template ?? "dark",
      positionVertical: container?.position ?? "bottom",
      positionHorizontal: container?.positionHorizontal ?? "left",
      showDektopDevice: container?.onDesktop ?? true,
      showMobileDevice: container?.onMobile ?? true,
      size: container?.size ?? "full",

    }));
  }, [stickyCartSettings]);


  // Set default values
  useEffect(() => {
    setSelectedValues((prev) => ({
      ...prev,
      hideSoldOut: true,
      topOffset: 0,
      bottomOffset: 0,
      leftOffset: 0,
      rightOffset: 0,

      // produt default values
      showImage: true,
      showName: true,
      showPrice: true,
      showComparedPrice: true,
      productCompareColor: "#aaa",
      productCompareWeight: false,
      // Quantity + Variant
      variantTextWeight: true,
      showQuantity: true,
      showVariant: true,
      variantTextColor: "#fff",


      // Announcement
      announcementHasTimer: false,
      announcementFontSize: "14",
      announcementEnabled: true,
      announcementFontColor: "#635F5F",
      announcementFontWeight: true,
      announcementFontStyle: false,
      announcementFontDecoration: false,

      announcementText: "ðŸ”¥ Hello Wolrd!",
      visibilyDevice: "showDesktop",
      showDektopDevice: true,
      showMobileDevice: true,
      positionVertical: "bottom",
      positionHorizontal: "right",
      size: "full",
      position: "bottom",
      bgType: "single",
      bgColor: "#1a1a1a",
      qtyIconColor: "#000000",
      buttonAction: "stay",
      showBar: "always",
      productNameWeight: true,
      productPriceWeight: true,
      productCompareFont: false,
      counterVisibilty: "hide",
    }));
  }, []);

  const toggleTab = (index) => {
    setActiveTab((prev) => (prev === index ? null : index));
  };


  const toggleModal = () => setActiveModal(!activeModal);
  const handleAddButtonClick = () => toggleModal();


  return (
    <>
      {loading && (
        <div className="loading-overlay">
          <p>Loading...</p>
        </div>
      )}
      <div className="customizer-panel">


        <div className="save-settings">
          {/* <button type="button">Save Settings</button> */}
          <Button primary disabled={saving} onClick={() => handleSaveSettings()}>Save Settings</Button>
        </div>
        {tabsData.map((tab, index) => (
          <div key={index} className={`customizer-panel-tab tab-${index}`}>
            <button type="button" onClick={() => toggleTab(index)}>
              <span className="tab-bnt">{tab.title}</span>
              <span className="tab-icon">{activeTab === index ? "-" : "+"}</span>
            </button>

            <AnimatePresence>
              {activeTab === index && (
                <motion.div
                  className={`customizer-panel-tab-content ${tab.title
                    .replace(/\s+/g, "-")
                    .toLowerCase()}-content`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {tab.fields.map((field, i) => (
                    <div key={i} className={`field-item inp-${field.class}`}>
                      {field.title && <h4>{field.title}</h4>}

                      {field.items?.map((item, j) => {

                        // POSITION OFFSET LOGIC (vertical/horizontal)
                        if (item.conditionalFieldFor) {
                          const isVertical = item.conditionalFieldFor === "vertical";
                          const activeValue = isVertical
                            ? selectedValues.positionVertical
                            : selectedValues.positionHorizontal;

                          // Only show when matched
                          if (activeValue !== item.activeWhen) {
                            return null; // hide
                          }
                        }


                        const isActive = selectedValues[item.name] === item.value;
                        const activeConditionalFields = isActive
                          ? item.conditionalFields ?? field.conditionalFields?.[item.value] ?? []
                          : [];

                        return (
                          <div key={j} className={`custom-radio ${isActive ? "active" : ""} inp-${item.type}-inner`}>
                            {/* Radio Button */}
                            {item.type === "radio" && (
                              <>
                                <RadioButton
                                  label={item.label}
                                  checked={isActive}
                                  name={`${item.name}-${field.title.replace(/\s+/g, "-").toLowerCase()}`}
                                  id={`${field.title.replace(/\s+/g, "-").toLowerCase()}-${item.value}`}
                                  value={item.value}
                                  onChange={() => handleChange(item.name, item.value)}
                                />

                                {/* Conditional Fields */}
                                {isActive &&
                                  activeConditionalFields?.map((condField, k) => (

                                    <div
                                      key={k}
                                      style={{ marginLeft: "20px", marginBottom: "8px" }}
                                      className={`field-item inp-${condField.type}`}
                                    >
                                      {/* Single Field Types */}
                                      {condField.type === "range" && (
                                        <RangeSlider
                                          labelHidden value={selectedValues[condField.name] || condField.value}
                                          onChange={(value) => handleChange(condField.name, value)}
                                          min={condField.min}
                                          max={condField.max}
                                          output
                                        />)}
                                      {condField.type === "date" && (
                                        <TextField
                                          label={condField.label}
                                          type="date"
                                          value={selectedValues[condField.name] ?? condField.value}
                                          onChange={(value) => handleChange(condField.name, value)}
                                        />
                                      )}
                                      {condField.type === "time" && (
                                        <TextField
                                          label={condField.label}
                                          type="time" value={selectedValues[condField.name] ?? condField.value}
                                          onChange={(value) => handleChange(condField.name, value)

                                          }
                                        />
                                      )}
                                      {condField.type === "text" && (
                                        <TextField
                                          label={condField.label}
                                          type="text" value={selectedValues[condField.name] ?? condField.value}
                                          onChange={(value) => handleChange(condField.name, value)

                                          }
                                        />
                                      )}
                                      {condField.type === "number" && (
                                        <TextField
                                          label={condField.label}
                                          type="number"
                                          value={String(selectedValues[condField.name] ?? condField.value ?? 0)}
                                          onChange={(value) => handleChange(condField.name, parseInt(value) || 0)}
                                        />
                                      )}



                                      {condField.type === "color" && (
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                          <TextField
                                            label={condField.label}
                                            type="color"
                                            value={selectedValues[condField.name] || condField.value}
                                            onChange={(value) => handleColorChange(condField.name, value)}
                                          />
                                          {/* HEX input */}
                                          <TextField
                                            label="HEX"
                                            type="text"
                                            value={selectedValues[condField.name] || condField.value}
                                            onChange={(value) => handleColorChange(condField.name, value)}
                                          />
                                        </div>
                                      )}

                                      {/* Gradient group items */}
                                      {condField.items && (
                                        <div className="gradient-items">
                                          {condField.title && (
                                            <div className="gradient-items-title" style={{ marginBottom: "6px", fontWeight: "600" }}>
                                              {condField.title}
                                            </div>
                                          )}

                                          {condField.items.map((gradItem, idx) => (
                                            <div key={idx} style={{ marginBottom: "8px", display: "flex", gap: "10px" }}>
                                              {gradItem.type === "color" && (
                                                <>
                                                  <TextField
                                                    label={gradItem.label}
                                                    type="color"
                                                    value={selectedValues[gradItem.name] || gradItem.value}
                                                    onChange={(value) => handleColorChange(gradItem.name, value)}
                                                  />
                                                  <TextField
                                                    label=""
                                                    type="text"
                                                    value={selectedValues[gradItem.name] || gradItem.value}
                                                    onChange={(value) => handleColorChange(gradItem.name, value)}
                                                  />
                                                </>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                {/* Sticky Cart Add Button */}
                                {isActive && (item.value === "specific-products" || item.value === "exclude-products") && (
                                  <div className="show-sticky-cart-tab-container">
                                    <p>No products selected.</p>
                                    <Button primary onClick={toggleModal}>
                                      Add
                                    </Button>
                                  </div>
                                )}
                              </>
                            )}

                            {/* Checkbox */}
                            {item.type === "checkbox" && (
                              <Checkbox
                                label={item.label}
                                checked={selectedValues[item.name] || false}
                                onChange={(newChecked) => handleChange(item.name, newChecked)}
                              />
                            )}

                            {/* Number / Text / Color fields outside radio */}
                            {item.type === "number" && (
                              <TextField
                                label={item.label}
                                type="number"
                                value={String(selectedValues[item.name] || item.value || 0)}
                                onChange={(value) => handleChange(item.name, parseInt(value))}
                              />
                            )}

                            {item.type === "color" && (
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <TextField
                                  label={item.label}
                                  type="color"
                                  value={selectedValues[item.name] || item.value}
                                  onChange={(value) => handleColorChange(item.name, value)}
                                />
                                <TextField
                                  label=""
                                  type="text"
                                  value={selectedValues[item.name] || item.value}
                                  onChange={(value) => handleColorChange(item.name, value)}
                                />
                              </div>
                            )}

                            {item.type === "range" && (
                              <RangeSlider
                                label={item.label}
                                min={0}
                                max={25}
                                checked={selectedValues[item.name] || false}
                                onChange={(newChecked) => handleChange(item.name, newChecked)}
                              />
                            )}

                            {item.type === "text" && (
                              <TextField
                                label={item.label}
                                type="text"
                                value={selectedValues[item.name] || item.value || ""}
                                onChange={(value) => handleChange(item.name, value)}
                              />
                            )}

                            {item.type === "select" && (
                              <Select
                                label={item.label}
                                options={item.options || []}
                                value={selectedValues[item.name] ?? item.value ?? ""}
                                onChange={(value) => handleChange(item.name, value)}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {/* Shopify Polaris Modal */}
        <Modal
          open={activeModal}
          onClose={toggleModal}
          title="Select Items"
          primaryAction={{ content: "Save", onAction: toggleModal }}
          secondaryActions={[{ content: "Cancel", onAction: toggleModal }]}
        >
          <Modal.Section>
            {selectedValues.stickyCart === "specific-products" && (
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                {productsData?.map((product) => (
                  <div
                    key={product.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "8px 0",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <Checkbox
                      label=""
                      checked={selectedProductIds.includes(product.id)}
                      onChange={() => toggleProductSelection(product.id)}
                    />
                    <img
                      src={
                        product.images.edges[0]?.node.originalSrc ||
                        "https://cdn.shopify.com/s/assets/no-image-75c5e3d6b1.png"
                      }
                      alt={product.title}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                    />
                    <div>
                      <Text variant="bodyMd" as="p" fontWeight="bold">
                        {product.title}
                      </Text>
                      <Text variant="bodySm" as="p" color="subdued">
                        {product.tags?.join(", ") || "No tags"}
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* 
          {selectedValues.stickyCart === "specific-collections" && (
            <Text>Here display your Shopify collection picker</Text>
          )} */}
            {selectedValues.stickyCart === "exclude-products" && (
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                {productsData?.map((product) => (
                  <div
                    key={product.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "8px 0",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <Checkbox
                      label=""
                      checked={excludedProductsIds.includes(product.id)}
                      onChange={() => toggleExcludedProductSelection(product.id)}
                    />
                    <img
                      src={
                        product.images.edges[0]?.node.originalSrc ||
                        "https://cdn.shopify.com/s/assets/no-image-75c5e3d6b1.png"
                      }
                      alt={product.title}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                    />
                    <div>
                      <Text variant="bodyMd" as="p" fontWeight="bold">
                        {product.title}
                      </Text>
                      <Text variant="bodySm" as="p" color="subdued">
                        {product.tags?.join(", ") || "No tags"}
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* {selectedValues.stickyCart === "exclude-collections" && (
          //   <Text>Here display Shopify collection picker for excluding collections</Text>
          // )} */}
          </Modal.Section>
        </Modal>

      </div>
    </>
  );
}