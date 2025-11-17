
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

export default function CustomizerPanel({ selectedValues, setSelectedValues, handleChange }) {
  const [activeTab, setActiveTab] = useState(null);
  const [activeModal, setActiveModal] = useState(false);
  const [storeData, setStoreData] = useState(null);
  const [productsData, setProductsData] = useState(null);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [excludedProductsIds, setexcludedProductsIds] = useState([]);
  const [saving, setSaving] = useState(false);


  const getProducts = async () => {
    try {
      const response = await fetch("/api/get-products");
      const data = await response.json();
      console.log("Products data:", data);
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
    try {
      const response = await fetch("/api/get-store");
      const data = await response.json();
      setStoreData(data);
      console.log("Store data:", data);
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
    const payload = {
      shop: storeData.domain,
      enabled: true,

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
        fontWeight: ["normal", "bold"].includes(selectedValues.announcementWeight)
          ? selectedValues.announcementWeight
          : "bold",
        fontStyle: ["normal", "italic"].includes(selectedValues.announcementFontStyle)
          ? selectedValues.announcementFontStyle
          : "normal",
        underline: !!selectedValues.announcementUnderline,
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
        textColor: selectedValues.variantTextColor || "#ffffff",
        isBold: selectedValues.variantTextFont === "bold",
        fontSize: Number(selectedValues.variantTextSize) || 14,
        backgroundColor: selectedValues.variantBgColor || " #000000",
      },

      quantitySelector: {
        show: !!selectedValues.showQuantity,
        textColor: selectedValues.qtyTextColor || "#FFFFFF",
        isBold: !!selectedValues.qtyTextBold,
        fontSize: Number(selectedValues.qtyTextSize) || 14,
        borderColor: selectedValues.qtyBorderColor || "#CCCCCC",
        borderWidth: Number(selectedValues.qtyBorderSize) || 1,
        backgroundColor: selectedValues.qtyBgColor || " #000000",
        iconColor: selectedValues.qtyIconColor || "#EEEEEE",
        IconSize: Number(selectedValues.qtyIconSize) || 12,
        iconBackgroundColor: selectedValues.qtyIconBgColor || " #000000",
      },

      addToCartButton: {
        text: selectedValues.buttonText || "Add to Cart",
        backgroundColor: selectedValues.buttonBgColor || "#007CDB",
        textColor: selectedValues.buttonTextColor || "#FFFFFF",
        action: ["cart", "checkout", "stay"].includes(selectedValues.buttonAction)
          ? selectedValues.buttonAction
          : "cart",
        fontWeight: ["normal", "bold"].includes(selectedValues.buttonFontWeight)
          ? selectedValues.buttonFontWeight
          : "bold",
        fontSize: Number(selectedValues.buttonTextSize) || 16,
        borderRadius: Number(selectedValues.buttonBorderRadius) || 4,
        borderColor: selectedValues.buttonBorderColor || "#000000",
        borderWidth: Number(selectedValues.buttonBorderWidth) || 1,
      },

      container: {
        borderRadius: Number(selectedValues.containerBorderRadius) || 8,
        shadow: !!selectedValues.dropShadow,
        position: selectedValues.position || "bottom",
        backgroundColor:
          selectedValues.bgType === "gradient"
            ? `linear-gradient(${selectedValues.gradientAngle}deg, ${selectedValues.gradientColor1}, ${selectedValues.gradientColor2})`
            : selectedValues.bgColor || "#000000",
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


  useEffect(() => {
    getStore();
    getProducts();
  }, []);

  // Set default values
  useEffect(() => {
    setSelectedValues((prev) => ({
      ...prev,
      hideSoldOut: true,
      showImage: true,
      showName: true,
      showPrice: true,
      showQuantity: true,
      showVariant: true,
      announcementEnabled: true,
      announcementFontColor: "#635F5F",
      announcementText: "🔥 Hello Wolrd!",
      visibilyDevice: "showDesktop",
      bgType: "single",
      bgColor: "#1a1a1a",
      buttonAction: "stay",
      showBar: "always",
      productNameWeight: prev.productNameWeight || "bold",
      productPriceWeight: prev.productPriceWeight || "normal",
      productCompareFont: prev.productCompareFont || "normal",
      counterVisibilty: "hide",
    }));
  }, []);

  const toggleTab = (index) => {
    setActiveTab((prev) => (prev === index ? null : index));
  };



  const toggleModal = () => setActiveModal(!activeModal);
  const handleAddButtonClick = () => toggleModal();

  return (
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
                  <div key={i} className={`field-item inp-${field.title}`}>
                    {field.title && <h4>{field.title}</h4>}

                    {field.items?.map((item, j) => {
                      const isActive = selectedValues[item.name] === item.value;
                      const activeConditionalFields = isActive ? item.conditionalFields ?? field.conditionalFields?.[item.value] ?? [] : [];

                      return (
                        <div key={j} className={`custom-radio ${isActive ? "active" : ""}`}>
                          {/* Radio */}
                          {item.type === "radio" && (
                            <>
                              <RadioButton
                                label={item.label}
                                checked={isActive}
                                name={`${item.name}-${field.title.replace(/\s+/g, "-").toLowerCase()}`}
                                id={`${field.title.replace(/\s+/g, "-").toLowerCase()}-${item.value}`}
                                value={item.value}
                                onChange={() =>
                                  handleChange(item.name, item.value)
                                }
                              />

                              {/* Conditional fields for this radio */}
                              {isActive &&
                                activeConditionalFields?.map((condField, k) => (
                                  <div
                                    key={k}
                                    style={{
                                      marginLeft: "20px",
                                      marginBottom: "8px",
                                    }}
                                    className={`field-item inp-${condField.type}`}
                                  >
                                    {condField.type === "range" && (
                                      <RangeSlider
                                        labelHidden
                                        value={
                                          selectedValues[condField.name] ||
                                          condField.value
                                        }
                                        onChange={(value) =>
                                          handleChange(condField.name, value)
                                        }
                                        min={condField.min}
                                        max={condField.max}
                                        output
                                      />
                                    )}
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
                                        type="time"
                                        value={selectedValues[condField.name] ?? condField.value}
                                        onChange={(value) => handleChange(condField.name, value)}
                                      />
                                    )}
                                    {condField.type === "number" && (
                                      <TextField
                                        label={condField.label}
                                        type="number"
                                        value={String(selectedValues[condField.name] ?? condField.value ?? 0)}
                                        onChange={(value) =>
                                          handleChange(condField.name, parseInt(value) || 0)
                                        }
                                      />
                                    )}
                                    {condField.type === "color" && (
                                      <TextField
                                        label={condField.label}
                                        type="color"
                                        value={
                                          selectedValues[condField.name] ||
                                          condField.value
                                        }
                                        onChange={(value) =>
                                          handleChange(condField.name, value)
                                        }
                                      />

                                    )}
                                  </div>
                                ))}

                              {/* Sticky Cart Add Button */}
                              {tab.title === "Show Sticky Cart" &&
                                item.value !== "all-products" &&
                                selectedValues[item.name] === item.value && (
                                  <div className="show-modal-for-product" style={{ marginTop: "5px" }}>
                                    <Text>Sticky cart option: {item.label}</Text>
                                    <Button onClick={handleAddButtonClick}>Add</Button>
                                  </div>
                                )}
                            </>
                          )}

                          {/* Checkbox */}
                          {item.type === "checkbox" && (
                            <Checkbox
                              label={item.label}
                              checked={selectedValues[item.name] || false}
                              onChange={(newChecked) =>
                                handleChange(item.name, newChecked)
                              }
                            />
                          )}

                          {/* Number */}
                          {item.type === "number" && (
                            <TextField
                              label={item.label}
                              type="number"
                              value={String(
                                selectedValues[item.name] || item.value || 0
                              )}
                              onChange={(value) =>
                                handleChange(item.name, parseInt(value))
                              }
                            />
                          )}

                          {/* Color */}
                          {item.type === "color" && (
                            <TextField
                              label={item.label}
                              type="color"
                              value={selectedValues[item.name] || item.value}
                              onChange={(value) =>
                                handleChange(item.name, value)
                              }
                            />
                          )}

                          {/* Text */}
                          {item.type === "text" && (
                            <TextField
                              label={item.label}
                              type="text"
                              value={selectedValues[item.name] || item.value || ""}
                              onChange={(value) => handleChange(item.name, value)}
                            />
                          )}

                          {/* Select */}
                          {item.type === "select" && (
                            <Select
                              label={item.label}
                              options={item.options.map((o) => ({
                                label: o.label,
                                value: o.value,
                              }))}
                              value={selectedValues[item.name] || item.value}
                              onChange={(value) => handleChange(item.name, value)}
                            />
                          )}

                          {/* Editor */}
                          {item.type === "editor" && (
                            <ReactQuill
                              theme="snow"
                              value={selectedValues[item.name] || ""}
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
  );
}