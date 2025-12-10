import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import img from "../assets/sticky-add-to-cart-bg.webp";
// import First from "./First.jsx";
import Second from "./Second.jsx"
import SuggestedApps from "./SuggestedApps";
import FirstVisit from "./FirstVisit.jsx";

export default function HomePage() {
  const navigate = useNavigate();
  console.log("ABOVE", <FirstVisit />)
  const [playVideo, setPlayVideo] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [storeData, setStoreData] = useState(null);
  const [themeEnabled, setThemeEnabled] = useState(false);
  const [loading, setLoading] = useState(true); // loader state

  const getStore = async () => {
    try {
      const response = await fetch("/api/get-store");
      const data = await response.json();
      setStoreData(data);
      console.log("Store data:", data);
    } catch (error) {
      console.error("Error fetching store data:", error);
    }
  };

  const getTheme = async () => {
    try {
      const response = await fetch("/api/getEmbedStatus");
      const data = await response.json();
      console.log("Theme data:", data);
      setThemeEnabled(!data.foundDetails.disabled);
    } catch (error) {
      console.error("Error fetching theme data:", error);
    }
  };

  const handleGetStarted = () => {
    const shop = storeData.domain;
    const API_KEY = "c23e9fe0713ccd6c1eff49729441698d";
    const EXTENSION_HANDLE = "sticky-cart";

    const url = `https://${shop}/admin/themes/current/editor?context=apps&activateAppId=${API_KEY}/${EXTENSION_HANDLE}`;
    window.open(url, "_blank");
  };

  // const handleModalPrimaryAction = () => {
  //   setModalActive(false);
  //   navigate("/Customize");
  // };

  // const handleModalClose = () => {
  //   setModalActive(false);
  //   setPlayVideo(false);
  // };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([getStore(), getTheme()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }


  return (
    <>
      {/* {storeData?.firstVisit && <First />} */}
      {storeData?.firstVisit && <FirstVisit />}
      {storeData?.firstVisit === false && themeEnabled === false && <Second setThemeEnabled={setThemeEnabled} themeEnabled={themeEnabled} />}
      <div className="main-page">
        <div className="sticky-content">
          <img src={img} alt="Sticky Cart" />
          <div className="content-details">
            <div className="sticky-content-details">
              <h1>Sticky Cart</h1>
              <p>Enable Essential Sticky Cart to increase conversions and customise to fit your store style.</p>
            </div>
            <div className="sticky-cart-btns">
              <button
                className={themeEnabled ? "disable" : ""}
                onClick={handleGetStarted}
              >
                {themeEnabled ? "Disable" : "Enable"}
              </button>
              <Link to="/Customize">Customize</Link>
            </div>
          </div>
        </div>
      </div>
      <SuggestedApps />
    </>
  );
}
