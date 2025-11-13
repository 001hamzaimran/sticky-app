
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

export default function CustomizerPanel({ selectedValues, setSelectedValues }) {
  const [activeTab, setActiveTab] = useState(null);
  const [activeModal, setActiveModal] = useState(false);



  // Set default values
  useEffect(() => {
    setSelectedValues((prev) => ({
      ...prev,
      hideSoldOut: true,
      showImage: true,
      showName: true,
      showPrice: true,
      showComparedPrice: true,
      showQuantity: true,
      showVariant: true,
      announcementEnabled: true,
      announcementText: "Hello World!",
      visibilyDevice: "showDesktop",
      bgType: "single",
      bgColor: "#000000",
      buttonAction: "stay",
      showBar: "always",
      productNameWeight: prev.productNameWeight || "bold",
      productPriceWeight: prev.productPriceWeight || "normal",
      productCompareFont: prev.productCompareFont || "normal",
      counterVisibilty: "hide",
      productNameColor: "#ffffff",
      productPriceColor: "#ffffff",
      productCompareColor: "#a1a1a1",
      variantTextColor: "#000000",
      variantBgColor: "#ffffff",
      buttonBgColor: "#ff0000",
      buttonBorderColor: "#ff0000",
    }));
  }, []);

  const toggleTab = (index) => {
    setActiveTab((prev) => (prev === index ? null : index));
  };

  const handleChange = (name, value) => {
    setSelectedValues((prev) => ({ ...prev, [name]: value }));
  };

  const toggleModal = () => setActiveModal(!activeModal);
  const handleAddButtonClick = () => toggleModal();

  return (
    <div className="customizer-panel">
      <div className="save-settings">
        {/* <button type="button">Save Settings</button> */}
        <Button primary onClick={() => alert("Settings saved!")}>Save Settings</Button>
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
                        <div key={j} className="custom-radio">
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
            <Text>Here display your Shopify product picker for selecting products</Text>
          )}
          {selectedValues.stickyCart === "specific-collections" && (
            <Text>Here display your Shopify collection picker</Text>
          )}
          {selectedValues.stickyCart === "exclude-products" && (
            <Text>Here display Shopify product picker for excluding products</Text>
          )}
          {selectedValues.stickyCart === "exclude-collections" && (
            <Text>Here display Shopify collection picker for excluding collections</Text>
          )}
        </Modal.Section>
      </Modal>

    </div>
  );
}