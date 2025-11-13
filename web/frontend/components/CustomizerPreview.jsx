import img from "../assets/placeholder-featured-image.svg";
import CountdownTimer from "./CountdownTimer";

export default function CustomizerPreview({ selectedValues, remainingTime, formatTime }) {


  return (
    <div
      className={`customizer-preview ${selectedValues.visibilyDevice === "showMobile" ? "mobile-device" : ""}`}
      style={{
        width:
          selectedValues.visibilyDevice === "showDesktop"
            ? "100%"
            : selectedValues.visibilyDevice === "showMobile"
              ? "320px"
              : "100%", // fallback
        transition: "width 0.3s ease",
        margin: "0 auto"
      }}
    >
      <div
        className="sticky-product-container"
        style={{
          background:
            selectedValues?.bgType === "gradient"
              ? `linear-gradient(${selectedValues?.gradientAngle || 0}deg, ${selectedValues?.gradientColor1 || "#fff"}, ${selectedValues?.gradientColor2 || "#1a1a1a"})`
              : selectedValues?.bgColor || "#1a1a1a",
          borderWidth: selectedValues?.borderSize ? `${selectedValues.borderSize}px` : "0px",
          borderColor: selectedValues?.borderColor || "#000",
          borderStyle: "solid",
          color: selectedValues?.fontColor || "#fff",
          fontFamily: selectedValues?.fontFamily || "inherit",
        }}
      >
        {/* Top Text / Announcement Bar */}
        {selectedValues?.announcementEnabled && (
          <div
            className="top-text"
            style={{
              backgroundColor: selectedValues?.announcementBgColor || "#e80d0d",
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
                        fontWeight: selectedValues?.productNameWeight || "bold", // ← fix
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
                          fontWeight: selectedValues?.productCompareFont === "bold" ? "bold" : "normal",
                          fontSize: selectedValues?.productCompareSize
                            ? `${selectedValues.productCompareSize}px`
                            : "14px",
                          color: selectedValues?.productCompareColor || "#aaa",
                          textDecoration: "line-through",
                        }}
                      >
                        $90
                      </p>

                    )}
                    -
                    {selectedValues?.showPrice !== false && (
                      <p
                        className="pucrodt-price"
                        style={{
                          fontWeight: selectedValues?.productPriceWeight === "bold" ? "bold" : "normal",
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
                <div className="product-info">
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
                          backgroundColor: selectedValues?.variantBgColor || "#fff",
                          color: selectedValues?.variantTextColor || "#000",
                          fontSize: selectedValues?.variantTextSize
                            ? `${parseInt(selectedValues.variantTextSize)}px` : "14px",
                          fontWeight: selectedValues?.variantTextFont || "normal",
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
                        padding: "5px",
                        fontSize: selectedValues?.qtyTextSize,
                        lineHeight: selectedValues?.qtyTextSize ? `${parseInt(selectedValues.qtyTextSize) + 4}px` : "18px",
                        color: selectedValues?.qtyIconColor,
                        backgroundColor: selectedValues?.qtyBgColor,
                        borderWidth: selectedValues?.qtyBorderSize,
                        borderStyle: "solid",
                        borderColor: selectedValues?.qtyBorderColor,
                        borderRadius: selectedValues?.qtyBorderRadius

                      }}>+</button>
                      <input
                        type="number"
                        value="1"
                        min="1"
                        readOnly
                        style={{ width: "50px", height: "30px", lineHeight: "24px", textAlign: "center" }}
                      />
                      <button
                        style={{
                          padding: "5px",
                          fontSize: selectedValues?.qtyTextSize,
                          lineHeight: selectedValues?.qtyTextSize ? `${parseInt(selectedValues.qtyTextSize) + 4}px` : "18px",
                          color: selectedValues?.qtyIconColor,
                          backgroundColor: selectedValues?.qtyBgColor,
                          borderWidth: selectedValues?.qtyBorderSize,
                          borderStyle: "solid",
                          borderColor: selectedValues?.qtyBorderColor,
                          borderRadius: selectedValues?.qtyBorderRadius

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
                backgroundColor: selectedValues?.buttonBgColor || "#000",
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
