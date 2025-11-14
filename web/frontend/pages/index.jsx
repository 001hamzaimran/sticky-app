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
import { useState } from "react";
import setupImage from "../assets/index.svg";
import img from "../assets/sticky-add-to-cart-bg.webp"
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { TitleBar } from "@shopify/app-bridge-react";
import { StarFilledMinor } from "@shopify/polaris-icons";

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [playVideo, setPlayVideo] = useState(false);
  const [modalActive, setModalActive] = useState(false);

  const handleGetStarted = () => setModalActive(true);

  const handleModalPrimaryAction = () => {
    setModalActive(false);
    navigate("/Customize");
  };

  const handleModalClose = () => {
    setModalActive(false);
    setPlayVideo(false);
  };

  return (
    // <Page>
    //   <TitleBar title="Welcome to StickyCart Boost" />

    //   <Box
    //     style={{
    //       width: "100%",
    //       display: "flex",
    //       padding: "2rem",
    //       minHeight: "100vh",
    //       alignItems: "center",
    //       justifyContent: "center",
    //     }}
    //   >
    //     <Box
    //       style={{
    //         width: "100%",
    //         padding: "2rem",
    //         maxWidth: "700px",
    //         textAlign: "center",
    //         borderRadius: "1rem",
    //         backgroundColor: "white",
    //         boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
    //       }}
    //     >
    //       <Stack vertical spacing="loose" alignment="center">
    //         <Image
    //           source={setupImage}
    //           alt="StickyCart Boost illustration"
    //           width="240px"
    //         />

    //         <Text variant="heading2xl" as="h1">
    //           🛒 Welcome to StickyCart Boost
    //         </Text>

    //         <Text as="p" tone="subdued" alignment="center">
    //           Add a <b>sticky cart bar</b> to your product pages and make it
    //           easier for shoppers to <b>add to cart instantly</b> no more
    //           scrolling!
    //         </Text>

    //         <Text as="p" tone="subdued" alignment="center">
    //           ⚡ Always visible Add to Cart button<br />
    //           🧩 Displays product info and price updates<br />
    //           🚀 Boosts conversions and reduces cart abandonment
    //         </Text>

    //         <Stack distribution="center">
    //           <Button
    //             size="large"
    //             icon={StarFilledMinor}
    //             primary
    //             onClick={handleGetStarted}
    //           >
    //             Get Started
    //           </Button>
    //         </Stack>
    //       </Stack>

    //     </Box>
    //   </Box>

    //   {/* Setup Video Modal */}
    //   <Modal
    //     open={modalActive}
    //     onClose={handleModalClose}
    //     title="Quick Setup Guide"
    //     primaryAction={{
    //       content: "Proceed to Settings",
    //       onAction: handleModalPrimaryAction,
    //     }}
    //     secondaryActions={[
    //       {
    //         content: "Close",
    //         onAction: handleModalClose,
    //       },
    //     ]}
    //     large
    //   >
    //     <Modal.Section>
    //       {playVideo ? (
    //         <div style={{ position: "relative", paddingTop: "56.25%" }}>
    //           <iframe
    //             allowFullScreen
    //             title="StickyCart Boost Quick Setup"
    //             style={{
    //               top: 0,
    //               left: 0,
    //               border: 0,
    //               width: "100%",
    //               height: "100%",
    //               borderRadius: "8px",
    //               position: "absolute",
    //             }}
    //             allow="autoplay; encrypted-media"
    //             src="https://www.youtube.com/embed/1R5WZ6gZq2E?autoplay=1"
    //           />
    //         </div>
    //       ) : (
    //         <VideoThumbnail
    //           videoLength={90}
    //           thumbnailUrl="https://img.youtube.com/vi/1R5WZ6gZq2E/hqdefault.jpg"
    //           onClick={() => setPlayVideo(true)}
    //         />
    //       )}
    //     </Modal.Section>
    //   </Modal>
    // </Page>
    <div className='main-page'>
      <div className="sticky-content">
        <img src={img} alt="img" />
        <div className='content-details'>
          <div className='sticky-content-details'>
            <h1>Sticky Cart</h1>
            <p>Enable Essential Sticky Cart to increase conversions and customise to fit your store style.</p>
          </div>
          <div className='sticky-cart-btns'>
            <Link to="Customize">Customize</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
