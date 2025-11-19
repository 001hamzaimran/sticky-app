import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const tabsData = [
  // ====== SETTINGS TAB ======
  {
    title: "Settings",
    fields: [
      {
        title: "Devices",
        class: "Responsive",
        items: [
          { label: "Desktop", type: "radio", name: "visibilyDevice", value: "showDesktop" },
          { label: "Mobile", type: "radio", name: "visibilyDevice", value: "showMobile" },
        ],
      },
      {
        title: "",
        class: "show-for-sold-out-products",
        items: [
          { label: "Don't show for sold out products", type: "checkbox", name: "hideSoldOut", value: false },
        ],
      },
      {
        title: "Devices",
        class: "visibility",
        items: [
          { label: "Show on Desktop", type: "checkbox", name: "showDektopDevice", value: true },
          { label: "Show on Mobile", type: "checkbox", name: "showMobileDevice", value: true },
        ],
      },
      {
        title: "Button action on click",
        class: "button-action-on-click",
        items: [
          { label: "Stay on page", type: "radio", name: "buttonAction", value: "stay" },
          { label: "Go to cart", type: "radio", name: "buttonAction", value: "cart" },
          { label: "Go to checkout", type: "radio", name: "buttonAction", value: "checkout" },
        ],
      },
      {
        title: "Show the bar",
        class: "show-the-bar",
        items: [
          { label: "Always", type: "radio", name: "showBar", value: "always" },
          { label: "After scrolling past “Add to cart”", type: "radio", name: "showBar", value: "scroll" },
          { label: "When “Add to cart” is out of view", type: "radio", name: "showBar", value: "outOfView" },
        ],
      },
      {
        title: "Size",
        class: "container-size",
        items: [
          { label: "Full width", type: "radio", name: "size", value: "full" },
          { label: "Condensed", type: "radio", name: "size", value: "condensed" },
        ],
        conditionalFields: {
            condensed: [
              { label: "Custom Width", type: "range", name: "width", min: 0, max: 100, step: 10, value: 100 },
              { label: "", type: "text", name: "customWidth", value: "800" },
            ]
          }
      },
      {
        title: "Vertical position",
        class: "vertical-position",
        items: [
          { label: "Top", type: "radio", name: "positionVertical", value: "top" },
          { label: "Bottom", type: "radio", name: "positionVertical", value: "bottom" },
          
        ]
      },
      {
        title: "Horizontal position",
        class: "horizontal-position",
        items: [
          { label: "Left", type: "radio", name: "positionHorizontal", value: "left" },
          { label: "Right", type: "radio", name: "positionHorizontal", value: "right" },
        ]
      },
      {
        title: "Position",
        class: "position",
        items: [
          {
            name: "topOffset",
            type: "range",
            label: "Top offset position",
            value: 0,
            min: 0,
            max: 100,
            step: 10,
            conditionalFieldFor: "vertical",
            activeWhen: "top"
          },
          {
            name: "bottomOffset",
            type: "range",
            label: "Bottom offset position",
            value: 0,
            min: 0,
            max: 100,
            step: 10,
            conditionalFieldFor: "vertical",
            activeWhen: "bottom"
          },
          {
            name: "leftOffset",
            type: "range",
            label: "Left offset position",
            value: 0,
            min: 0,
            max: 100,
            step: 10,
            conditionalFieldFor: "horizontal",
            activeWhen: "left"
          },
          {
            name: "rightOffset",
            type: "range",
            label: "Right offset position",
            value: 0,
            min: 0,
            max: 100,
            step: 10,
            conditionalFieldFor: "horizontal",
            activeWhen: "right"
          }
        ]
      },

      {
        title: "Template",
        class: "tempalte",
        items: [
          { label: "Template", type: "select", name: "template", options: [
            { label: "Dark", value: "dark" },
            { label: "White", value: "white" },
          ] },
        ]
      },
      {
        title: "Background",
        class: "background",
        items: [
          { label: "Gradient background", type: "radio", name: "bgType", value: "gradient" },
          { label: "Single color background", type: "radio", name: "bgType", value: "single" },
        ],
        conditionalFields: {
          gradient: [
            { label: "Gradient angle degree", type: "range", name: "gradientAngle", min: 0, max: 360, value: 90 },
            { 
              title: "",
              items: [
                { label: "", type: "color", class: "gradientColor1", name: "gradientColor1", value: "#000000" },
                { label: "", type: "text", name: "gradientColor1Code", value: "#000000" }
              ]
            },
            { 
              title: "",
              items: [
                { label: "", type: "color", class: "gradientColor2", name: "gradientColor2", value: "#000000" },
                { label: "", type: "text", name: "gradientColor2Code", value: "#000000" }
              ]
            },
          ],
          single: [
            {
              items: [
                { label: "", type: "color", class: "bgColors", name: "bgColor", value: "#000000" },
                { label: "", type: "text", name: "bgColorCode", value: "#000000" }
              ]
             },
          ],
        },
      },
      {
        title: "Border size and color",
        class: "setting-border",
        items: [
          { label: "", type: "number", name: "borderSize", value: 0 },
          { label: "", type: "color", name: "borderColor", value: "#000000" },
        ],
      },
      { title: "", items: [{ label: "Show drop shadow", type: "checkbox", name: "dropShadow", value: true }] },
      {
        title: "Font",
        items: [
          {
            label: "Font",
            type: "select",
            name: "fontFamily",
            options: [
              { label: "Use your theme fonts", value: "use-theme-fonts" },
              { label: "Helvetica", value: "helvetica" },
              { label: "Arial", value: "arial" },
              { label: "Tahoma", value: "tahoma" },
              { label: "Times New Roman", value: "times-new-roman" },
              { label: "Georgia", value: "georgia" },
              { label: "Garamond", value: "garamond" },
            ],
            value: "use-theme-fonts",
          },
        ],
      },
    ],
  },



  // ====== PRODUCT TAB ======
  {
    title: "Product",
    fields: [
      {
        items: [
          { label: "Show Product Image", type: "checkbox", name: "showImage", default: false },
          { label: "Show Product Name", type: "checkbox", name: "showName", value: true },
          { label: "Show Price", type: "checkbox", name: "showPrice", value: true },
          { label: "Show Compared Price", type: "checkbox", name: "showComparedPrice", value: true },
        ],
      },
      {
        title: "Product Name",
        class: "product-name",
        items: [
          { label: "B", type: "checkbox", name: "productNameWeight", value: true },
          { label: "", type: "number", name: "productNameSize", value: 14 },
          { label: "", type: "color", name: "productNameColor", value: "#fff" },
        ],
      },
      {
        title: "Price",
        class: "product-price",
        items: [
          { label: "B", type: "checkbox", name: "productPriceWeight", value: true },
          { label: "", type: "number", name: "productPriceSize", value: 14 },
          { label: "", type: "color", name: "productPriceColor", value: "#fff" },
        ],
      },
      {
        title: "Compared At Price",
        class: "product-compare",
        items: [
          { label: "B", type: "checkbox", name: "productCompareFont", value: true },
          { label: "", type: "number", name: "productCompareSize", value: 14 },
          { label: "", type: "color", name: "productCompareColor", value: "#aaa" },
        ],
      },
    ],
  },

  // ====== VARIANT & QUANTITY TAB ======
  {
    title: "Variant & Quantity Selection",
    fields: [
      {
        title: "",
        class: "setting-elements-variant",
        items: [
          { label: "Show quantity", type: "checkbox", name: "showQuantity", value: true },
          { label: "Show variant", type: "checkbox", name: "showVariant", value: true },
        ],
      },
      {
        title: "",
        class: "setting-variant",
        items: [
          { label: "B", type: "checkbox", name: "variantTextFont", value: true },
          { label: "", type: "number", name: "variantTextSize", value: 14 },
          { label: "", type: "color", name: "variantTextColor", value: "#fff" },
          { label: "Icon color", type: "color", name: "qtyIconColor", value: "#fff" },
          { label: "Background color", type: "color", name: "variantBgColor", value: "transparent" },
          { label: "Border size in px", type: "number", name: "qtyBorderSize", value: 0 },
          { label: "", type: "color", name: "qtyBorderColor", value: "" },
          { label: "Border radius", type: "number", name: "qtyBorderRadius", value: 0 },
        ],
      }
    ],
  },

  // ====== BUTTON TAB ======
  {
    title: "Button",
    fields: [
      {
        title: "Add to cart button",
        class: "setting-button",
        items: [
          { label: "Button text", type: "text", name: "buttonText", value: "Add to Cart", content: "Use {price} variable to show product price in the button." },
          { label: "Text size and color", type: "number", name: "buttonTextSize", value: 14 },
          { label: "", type: "color", name: "buttonTextColor", value: "#ffffff" },
          { label: "Background color", type: "color", name: "buttonBgColor", value: "#005BD3" },
          { label: "Border size and color", type: "number", name: "buttonBorderWidth", value: 0 },
          { label: "", type: "color", name: "buttonBorderColor", value: "#005BD3" },
          { label: "Corner radius", type: "number", name: "buttonBorderRadius", value: 4 },
        ],
      },
      {
        title: "Sold out button",
        class: "setting-sold-out-button",
        items: [
          { label: "Sold out text", type: "text", name: "soldOutText", value: "Sold Out" },
          { label: "Background color", type: "color", name: "soldOutBgColor", value: "#cccccc" },
          { label: "Border Size", type: "number", name: "soldOutBorderSize", value: "0" },
          { label: "", type: "color", name: "soldOutBorderColor", value: "#999999" },
          { label: "Corner radius", type: "number", name: "buttonBorderRadius", value: 4 },
        ],
      },
    ],
  },

  // ====== ANNOUNCEMENT BAR TAB ======
  {
    title: "Announcement Bar",
    fields: [
      {
        title: "Devices",
        class: "Responsive",
        items: [
          { label: "Desktop", type: "radio", name: "visibilyDevice", value: "showDesktop" },
          { label: "Mobile", type: "radio", name: "visibilyDevice", value: "showMobile" },
        ],
      },
      {
        title: "Enable",
        items: [
          { label: "Enabled on desktop", type: "checkbox", name: "announcementEnabled", value: true }
        ],
      },
      {
        title: "",
        class: "setting-announcement-text",
        items: [
          // { label: "A", type: "select", name: "announcementFontSize", options:
          //   [
          //     { label: "10px", value: "10px" }, 
          //     { label: "12px", value: "12px" }, 
          //     { label: "14px", value: "14px" },
          //     { label: "16px", value: "16px" },
          //     { label: "18px", value: "18px" },
          //     { label: "20px", value: "20px" },
          //     { label: "22px", value: "22px" },
          //     { label: "24px", value: "24px" },
          //   ] 
          // },
          { label: "B", type: "checkbox", name: "announcementFontWeight", value: true },
          { label: "I", type: "checkbox", name: "announcementFontStyle", value: false },
          { label: "U", type: "checkbox", name: "announcementFontDecoration", value: false },
          { label: "", type: "color", name: "announcementFontColor", value: "#635F5F" },
          { label: "Text", type: "text", name: "announcementText", value: "Announcement text" }
        ],
      },
      {
        title:"",
        class: "setting-announcement-bar-bg",
        items: [
          { label: "Background color", type: "color", name: "announcementBgColor", value: "#13FFC4" }
        ]

      },
      {
        title: "Timer Settings",
        class: "timer-settings",
        content: "Same timer settings apply both to desktop and mobile.",
        items: [
          {
            label: "Countdown to date",
            type: "radio",
            name: "timerType",
            value: "countdown-to-date",
            conditionalFields: [
              { label: "Countdown Date", type: "date", name: "countdownDate", value: "" },
              { label: "Countdown Time", type: "time", name: "countdownTime", value: "" },
            ],
          },
          {
            label: "Fixed minutes",
            type: "radio",
            name: "timerType",
            value: "fixed-minutes",
            conditionalFields: [
              { label: "Days", type: "number", name: "timerDays", value: 0 },
              { label: "Hour", type: "number", name: "timerHour", value: 0 },
              { label: "Minutes", type: "number", name: "timerMinutes", value: 0 },
              { label: "Seconds", type: "number", name: "timerSeconds", value: 1 },
            ],
          },
        ],
      },
      {
        title: "After timer ends",
        items: [
          { label: "Show", type: "radio", name: "counterVisibilty", value: "show" },
          { label: "Hide", type: "radio", name: "counterVisibilty", value: "hide" },
        ]
      }
    ],
  },

  // ====== STICKY CART TAB ======
  {
    title: "Show Sticky Cart",
    fields: [
      {
        title: "",
        items: [
          { label: "All products", type: "radio", name: "stickyCart", value: "all-products" },
          { label: "Specific products", type: "radio", name: "stickyCart", value: "specific-products" },
          // { label: "Specific collections", type: "radio", name: "stickyCart", value: "specific-collections" },
          { label: "Exclude specific products", type: "radio", name: "stickyCart", value: "exclude-products" },
          // { label: "Exclude specific collections", type: "radio", name: "stickyCart", value: "exclude-collections" },
        ],
      },
    ],
  },
];

export default tabsData;