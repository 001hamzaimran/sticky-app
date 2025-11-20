import {
  Box,
  Page,
  Text,
  Modal,
  Image,
  Stack,
  Button,
  VideoThumbnail,
} from "@shopify/polaris";
import { useEffect, useState } from "react";
import img from "../assets/sticky-add-to-cart-bg.webp"
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import First from "./first";

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [playVideo, setPlayVideo] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [storeData, setStoreData] = useState(null);
  const [themeEnabled, setThemeEnabled] = useState(false);
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

  const getTheme = async () => {
    try {
      const response = await fetch("/api/getEmbedStatus");
      const data = await response.json();
      console.log("Theme data:", data);
      setThemeEnabled(!data.foundDetails.disabled);

    } catch (error) {
      console.error("Error fetching theme data:", error);
    }
  }

  const handleGetStarted = () => {

    const shop = storeData.domain; // from your store object
    const API_KEY = "56505304f3c96a93db57dbec3fda07dd"; // replace with your app's API key
    const EXTENSION_HANDLE = "sticky_cart"; // replace with your extension handle

    const url = `https://${shop}/admin/themes/current/editor?context=apps&activateAppId=${API_KEY}/${EXTENSION_HANDLE}`;
    window.open(url, "_blank"); // opens the theme editor with your extension activated
  };

  const handleModalPrimaryAction = () => {
    setModalActive(false);
    navigate("/Customize");
  };

  const handleModalClose = () => {
    setModalActive(false);
    setPlayVideo(false);
  };

  useEffect(() => {
    getStore();
    getTheme();
  }, []);
  return (
    <>
      {storeData?.firstVisit && <First />}
      <div className='main-page'>
        <div className="sticky-content">
          <img src={img} alt="img" />
          <div className='content-details'>
            <div className='sticky-content-details'>
              <h1>Sticky Cart</h1>
              <p>Enable Essential Sticky Cart to increase conversions and customise to fit your store style.</p>
            </div>
            <div className='sticky-cart-btns'>
              <Button size="slim" onClick={handleGetStarted}>Enable</Button>
              <Link to="Customize">Customize</Link>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}