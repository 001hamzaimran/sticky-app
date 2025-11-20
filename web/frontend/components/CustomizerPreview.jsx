import img from "../assets/placeholder-featured-image.svg";
import CountdownTimer from "./CountdownTimer";

export default function CustomizerPreview({ selectedValues, remainingTime, formatTime, handleChange }) {
  const deviceChange = (device) => {
    // update selectedValues state
    handleChange("visibilyDevice", device);
  };

  return (
    <div
      className={`customizer-preview ${selectedValues.visibilyDevice === "showMobile" ? "mobile-device": ""}`}
      style={{
        width:
          selectedValues.visibilyDevice === "showDesktop"
            ? "100%"
            : selectedValues.visibilyDevice === "showMobile"
              ? "375px"
              : "100%", // fallback
        transition: "width 0.3s ease",
        margin: "0 auto",
        backgroundColor: "#efe9df",
        
      }}
    >
      <div className="device-btns">
        <button
          type="button"
          className={selectedValues.visibilyDevice === "showDesktop" ? "active" : ""}
          onClick={() => deviceChange("showDesktop")}
        >
          Desktop
        </button>
        <button
          type="button"
          className={selectedValues.visibilyDevice === "showMobile" ? "active" : ""}
          onClick={() => deviceChange("showMobile")}
        >
          Mobile
        </button>
      </div>
      <div className="customizer-preview-topbar" style={{
        backgroundColor: "#fff",
        borderRadius: "20px 20px 0 0",
      }}>
        <div className="dots">
          <span className="dot-item">&nbsp;</span>
          <span className="dot-item">&nbsp;</span>
          <span className="dot-item">&nbsp;</span>
        </div>
        <div className="horizontal-line">&nbsp;</div>
      </div>
      <div
        className="sticky-product-container"
        style={{
          background:
            selectedValues?.bgType === "gradient"
              ? `linear-gradient(${selectedValues?.gradientAngle || 0}deg, ${selectedValues?.gradientColor1 || "#fff"}, ${selectedValues?.gradientColor2 || "#13ffc4"})`
              : selectedValues?.bgColor || "#1a1a1a",
          borderWidth: selectedValues?.borderSize ? `${selectedValues.borderSize}px` : "0px",
          borderColor: selectedValues?.borderColor || "#000",
          borderStyle: "solid",
          color: selectedValues?.fontColor || "#fff",
          fontFamily: selectedValues?.fontFamily || "inherit",
          // top: selectedValues?.positionVertical === "top" ? "50px" : "unset",
          // bottom: selectedValues?.positionVertical === "bottom" ? "0" : "unset",
          // left: selectedValues?.positionHorizontal === "left" ? "0" : "unset",
          // right: selectedValues?.positionHorizontal === "right" ? "0" : "unset",
          top:
            selectedValues.positionVertical === "top"
              ? `${Math.min(selectedValues.topOffset ?? 0, 25)}%` // max 25%
              : "unset",

          // BOTTOM
          bottom:
            selectedValues.positionVertical === "bottom"
              ? `${Math.min(selectedValues.bottomOffset ?? 0, 25)}%` // max 25%
              : "unset",

          // LEFT
          left:
            selectedValues.positionHorizontal === "left"
              ? `${Math.min(selectedValues.leftOffset ?? 0, 25)}%` // max 25%
              : "unset",

          // RIGHT
          right:
            selectedValues.positionHorizontal === "right"
              ? `${Math.min(selectedValues.rightOffset ?? 0, 25)}%` // max 25%
              : "unset",



          width: selectedValues.size === "full" ? "100%" : selectedValues.size === "condensed" ? `${selectedValues.customWidth}px` : "auto",
          
        }}
      >
      
        {/* Top Text / Announcement Bar */}
        {selectedValues?.announcementEnabled && (
          <div
            className="top-text"
            style={{
              backgroundColor: selectedValues?.announcementBgColor || "#14FFC4",
              boxShadow: selectedValues?.dropShadow ? "0 -4px 10px rgba(0,0,0,0.25)" : "none",
            }}
          >
            <div
              style={{
                padding: "13px 0",
                fontSize: selectedValues?.announcementFontSize,
                color: selectedValues?.announcementFontColor,
                textAlign: selectedValues?.announcementTextAlignment || "center"
              }}

            >

              <CountdownTimer selectedValues={selectedValues} />


            </div>
          </div>
        )}

        {/* Product Info */}
        <div className="product-item">

          <div className="product-image-content-variant">
            <div className={`product-image-content ${selectedValues?.showImage !== false ? 'with-image' : 'without-image'}`}>
              {selectedValues?.showImage !== false && (
                <div className="product-image">
                  <img src={img} width="100" height="100" alt="Product" />
                </div>
              )}
              <div className="product-content">
                <div className="product-title-price">
                  {selectedValues?.showName !== false && (
                    <h2
                      className="product-title"
                      style={{
                        fontWeight: selectedValues?.productNameWeight !== false ? "bold" : "normal",
                        fontSize: selectedValues?.productNameSize
                          ? `${selectedValues.productNameSize}px`
                          : "16px",
                        color: selectedValues?.productNameColor || "#fff",
                      }}
                    >
                      Home Trophy
                    </h2>
                  )}
                  <div className="product-prices">
                    {selectedValues?.showComparedPrice !== false && (
                      <p
                        className="product-compare-price"
                        style={{
                          fontWeight: selectedValues?.productCompareWeight !== false ? "bold" : "normal",
                          fontSize: selectedValues?.productCompareSize
                            ? `${selectedValues.productCompareSize}px`
                            : "14px",
                          color: selectedValues?.productCompareColor || "#aaa",
                          textDecoration: "line-through",
                        }}
                      >
                        $90 -
                      </p>

                    )}
                    
                    {selectedValues?.showPrice !== false && (
                      <p
                        className="pucrodt-price"
                        style={{
                          fontWeight: selectedValues?.productPriceWeight !== false ? "bold" : "normal",
                          fontSize: selectedValues?.productPriceSize
                            ? `${selectedValues.productPriceSize}px`
                            : "14px",
                          color: selectedValues?.productPriceColor || "#fff",
                        }}
                      >
                        $78
                      </p>
                    )}

                  </div>



                </div>
                {/* Variant & Quantity */}
                <div className="product-info"
                  style={
                    {
                      border: selectedValues.variantBorderSize ? `${selectedValues.variantBorderSize}px solid ${selectedValues.variantBorderColor}` : "none",
                      backgroundColor: selectedValues?.variantBgColor || "#fff",
                      borderRadius: selectedValues?.variantBorderRadius
                    }
                  }
                  >
                  {selectedValues?.showVariant && (
                    <div
                      className="product-variant"
                      style={{
                        color: selectedValues?.variantTextColor || "#000",
                        borderRadius: "4px",
                        
                      }}
                    >
                      <select
                        style={{
                          width: "100%",
                          padding: "5px 10px",
                          color: selectedValues?.variantTextColor || "#fff",
                          fontSize: selectedValues?.variantTextSize
                            ? `${parseInt(selectedValues.variantTextSize)}px` : "14px",
                          fontWeight: selectedValues?.variantTextWeight !== false ? "bold" : "normal",
                          border: "none",
                          borderRadius: "4px",
                          lineHeight: "24px"
                        }}
                      >
                        <option>Select Variant</option>
                      </select>
                    </div>
                  )}

                  {selectedValues?.showQuantity && (
                    <div
                      className="qty-container"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <button style={{
                        width: "20px",
                        height: "30px",
                        padding: "5px",
                        backgroundColor: "transparent",
                        fontSize: selectedValues?.variantTextSize
                            ? `${parseInt(selectedValues.variantTextSize)}px` : "14px",
                        lineHeight: selectedValues?.qtyTextSize ? `${parseInt(selectedValues.qtyTextSize) + 4}px` : "18px",
                        color: selectedValues?.qtyIconColor || "#fff",
                        border: "none",
                        

                      }}>+</button>
                      <input
                        type="number"
                        value="1"
                        min="1"
                        readOnly
                        style={{ 
                          width: "40px", 
                          height: "30px", 
                          backgroundColor: "transparent",
                          lineHeight: selectedValues?.qtyTextSize ? `${parseInt(selectedValues.qtyTextSize) + 4}px` : "18px", 
                          textAlign: "center",
                          color: selectedValues?.qtyIconColor || "#fff",
                          border: "none",
                          fontSize: selectedValues?.variantTextSize
                            ? `${parseInt(selectedValues.variantTextSize)}px` : "14px",
                          fontWeight: selectedValues?.variantTextWeight !== false ? "bold" : "normal",
                        }}
                      />
                      <button
                        style={{
                          width: "20px",
                          height: "30px",
                          padding: "5px",
                          border: "none",
                          backgroundColor: "transparent",
                          fontSize: selectedValues?.variantTextSize
                            ? `${parseInt(selectedValues.variantTextSize)}px` : "14px",
                          lineHeight: selectedValues?.qtyTextSize ? `${parseInt(selectedValues.qtyTextSize) + 4}px` : "18px",
                          color: selectedValues?.qtyIconColor || "#fff",
                          

                        }}
                      >-</button>
                    </div>
                  )}


                </div>

              </div>
            </div>


          </div>


          {/* Add to cart button */}
          <div className="product-add-to-cart">
            <button
              style={{
                color: selectedValues?.buttonTextColor || "#fff",
                backgroundColor: selectedValues?.buttonBgColor || "#007CDB",
                fontSize: selectedValues?.buttonTextSize ? `${selectedValues.buttonTextSize}px` : "14px",
                borderWidth: selectedValues?.buttonBorderWidth ? `${selectedValues.buttonBorderWidth}px` : "1px",
                borderColor: selectedValues?.buttonBorderColor || "#000",
                borderRadius: selectedValues?.buttonBorderRadius ? `${selectedValues.buttonBorderRadius}px` : "4px",
                padding: "8px 12px",
                cursor: "pointer",
              }}
            >
              {selectedValues?.buttonText || "Add to cart"}
            </button>
          </div>


        </div>
      </div>
    </div>
  );
}
