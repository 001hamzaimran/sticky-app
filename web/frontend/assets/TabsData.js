import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const tabsData = [
  // ====== SETTINGS TAB ======
  {
    title: "Settings",
    fields: [
      {
        title: "",
        items: [
          { label: "Don't show for sold out products", type: "checkbox", name: "hideSoldOut", value: false },
        ],
      },
      {
        title: "Devices",
        items: [
          { label: "Show on desktop", type: "radio", name: "visibilyDevice", value: "showDesktop" },
          { label: "Show on mobile", type: "radio", name: "visibilyDevice", value: "showMobile" },
        ],
      },
      {
        title: "Button action on click",
        items: [
          { label: "Stay on page", type: "radio", name: "buttonAction", value: "stay" },
          { label: "Go to cart", type: "radio", name: "buttonAction", value: "cart" },
          { label: "Go to checkout", type: "radio", name: "buttonAction", value: "checkout" },
        ],
      },
      {
        title: "Show the bar",
        items: [
          { label: "Always", type: "radio", name: "showBar", value: "always" },
          { label: "After scrolling past “Add to cart”", type: "radio", name: "showBar", value: "scroll" },
          { label: "When “Add to cart” is out of view", type: "radio", name: "showBar", value: "outOfView" },
        ],
      },
      // {
      //   title: "Size",
      //   items: [
      //     { label: "Full width", type: "radio", name: "size", value: "full" },
      //     { label: "Condensed", type: "radio", name: "size", value: "condensed" },
      //   ],
      // },
      // {
      //   title: "Vertical position",
      //   items: [
      //     { label: "Top", type: "radio", name: "position", value: "top" },
      //     { label: "Bottom", type: "radio", name: "position", value: "bottom" },
      //     { label: "Bottom offset position", type: "range", name: "bottomOffset", min: 0, max: 100, step: 10, value: 0 },
      //     { label: "Left offset position", type: "range", name: "leftOffset", min: 0, max: 100, step: 10, value: 0 },
      //     { label: "Right offset position", type: "range", name: "rightOffset", min: 0, max: 100, step: 10, value: 0 },
      //   ],
      // },
      {
        title: "Background",
        items: [
          { label: "Gradient background", type: "radio", name: "bgType", value: "gradient" },
          { label: "Single color background", type: "radio", name: "bgType", value: "single" },
        ],
        conditionalFields: {
          gradient: [
            { label: "Gradient angle degree", type: "range", name: "gradientAngle", min: 0, max: 360, value: 90 },
            { label: "Gradient First Color", type: "color", name: "gradientColor1", value: "#000000" },
            { label: "Gradient Second Color", type: "color", name: "gradientColor2", value: "#ffffff" },
          ],
          single: [
            { label: "Background Color", type: "color", name: "bgColor", value: "#ffffff" },
          ],
        },
      },
      {
        title: "Border",
        items: [
          { label: "Border width in (px)", type: "number", name: "borderSize", value: 0 },
          { label: "Border color", type: "color", name: "borderColor", value: "#000000" },
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
        title: "Product name style",
        items: [
          { label: "Font size", type: "number", name: "productNameSize", value: 14 },
          { label: "Font color", type: "color", name: "productNameColor", value: "#fff" },
          { label: "Font bold", type: "radio", name: "productNameWeight", value: "bold" },
          { label: "Font normal", type: "radio", name: "productNameWeight", value: "normal" },
        ],
      },
      {
        title: "Product price style",
        items: [
          { label: "Font size", type: "number", name: "productPriceSize", value: 14 },
          { label: "Font color", type: "color", name: "productPriceColor", value: "#fff" },
          { label: "Font bold", type: "radio", name: "productPriceWeight", value: "bold" },
          { label: "Font normal", type: "radio", name: "productPriceWeight", value: "normal" },
        ],
      },
      {
        title: "Compared price style",
        items: [
          { label: "Font size", type: "number", name: "productCompareSize", value: 14 },
          { label: "Font color", type: "color", name: "productCompareColor", value: "#fff" },
          { label: "Font bold", type: "radio", name: "productCompareFont", value: "bold" },
          { label: "Font normal", type: "radio", name: "productCompareFont", value: "normal" },
        ],
      },
    ],
  },

  // ====== VARIANT & QUANTITY TAB ======
  {
    title: "Variant & Quantity Selection",
    fields: [
      {
        title: "Show elements",
        items: [
          { label: "Show quantity", type: "checkbox", name: "showQuantity", value: true },
          { label: "Show variant", type: "checkbox", name: "showVariant", value: true },
        ],
      },
      {
        title: "Variant style",
        items: [
          { label: "Font bold", type: "radio", name: "variantTextFont", value: "bold" },
          { label: "Font normal", type: "radio", name: "variantTextFont", value: "normal" },
          { label: "Font size", type: "number", name: "variantTextSize", value: 14 },
          { label: "Font color", type: "color", name: "variantTextColor", value: "#000000" },
          { label: "Varint background color", type: "color", name: "variantBgColor", value: "#fff" },
        ],
      },
      {
        title: "Quantity style",
        items: [
          { label: "Icon size", type: "number", name: "qtyTextSize", value: 14 },
          { label: "Icon color", type: "color", name: "qtyIconColor", value: "#000000" },
          { label: "Background color", type: "color", name: "qtyBgColor", value: "#ffffff" },
          { label: "Border size in px", type: "number", name: "qtyBorderSize", value: 1 },
          { label: "Border color", type: "color", name: "qtyBorderColor", value: "#000000" },
          { label: "Border radius", type: "number", name: "qtyBorderRadius", value: 0 },
        ],
      },
    ],
  },

  // ====== BUTTON TAB ======
  {
    title: "Button",
    fields: [
      {
        title: "Add to cart button",
        items: [
          { label: "Button text", type: "text", name: "buttonText", value: "Add to Cart" },
          { label: "Text size in px", type: "number", name: "buttonTextSize", value: 14 },
          { label: "Text color", type: "color", name: "buttonTextColor", value: "#ffffff" },
          { label: "Background color", type: "color", name: "buttonBgColor", value: "#000000" },
          { label: "Border width in px", type: "number", name: "buttonBorderWidth", value: 0 },
          { label: "Border color", type: "color", name: "buttonBorderColor", value: "#000000" },
          { label: "Border radius in px", type: "number", name: "buttonBorderRadius", value: 4 },
        ],
      },
      {
        title: "Sold out button",
        items: [
          { label: "Sold out text", type: "text", name: "soldOutText", value: "Sold Out" },
          { label: "Background color", type: "color", name: "soldOutBgColor", value: "#cccccc" },
          { label: "Border color", type: "color", name: "soldOutBorderColor", value: "#999999" },
        ],
      },
    ],
  },

  // ====== ANNOUNCEMENT BAR TAB ======
  {
    title: "Announcement Bar",
    fields: [
      {
        title: "Enable",
        items: [
          { label: "Enabled on desktop", type: "checkbox", name: "announcementEnabled", value: true }
        ],
      },
      {
        title: "Text",
        items: [
          { label: "Text", type: "text", name: "announcementText", value: "" },
          { label: "Font size", type: "number", name: "announcementFontSize", value: "14px" },
          { label: "Background color", type: "color", name: "announcementBgColor", value: "#e80d0d" },
          { label: "Font color", type: "color", name: "announcementFontColor", value: "#ffffff" },
        ],
      },
      {
        title: "Timer Settings",
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
              { label: "Seconds", type: "number", name: "timerSeconds", value: 0 },
            ],
          },
        ],
      },
      {
        title: "Countdown vibility",
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
          { label: "Specific collections", type: "radio", name: "stickyCart", value: "specific-collections" },
          { label: "Exclude specific products", type: "radio", name: "stickyCart", value: "exclude-products" },
          { label: "Exclude specific collections", type: "radio", name: "stickyCart", value: "exclude-collections" },
        ],
      },
    ],
  },
];

export default tabsData;