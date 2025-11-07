import {
  Page,
  Box,
  Text,
  Image,
  Button,
  Stack,
  Modal,
  VideoThumbnail,
} from "@shopify/polaris";
import { StarFilledMinor } from "@shopify/polaris-icons";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import setupImage from "../assets/index.svg";
import { useState } from "react";

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [modalActive, setModalActive] = useState(false);
  const [playVideo, setPlayVideo] = useState(false);

  const handleGetStarted = () => setModalActive(true);
  const handleModalPrimaryAction = () => {
    setModalActive(false);
    navigate("/Settings");
  };
  const handleModalClose = () => {
    setModalActive(false);
    setPlayVideo(false);
  };

  return (
    <Page>
      <TitleBar title="Welcome to StickyCart Boost" />

      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          width: "100%",
          padding: "2rem",
        }}
      >
        <Box
          style={{
            textAlign: "center",
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "1rem",
            boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
            maxWidth: "700px",
            width: "100%",
          }}
        >
          <Stack vertical spacing="loose" alignment="center">
            <Image
              source={setupImage}
              alt="StickyCart Boost illustration"
              width="240px"
            />

            <Text variant="heading2xl" as="h1">
              🛒 Welcome to StickyCart Boost
            </Text>

            <Text as="p" tone="subdued" alignment="center">
              Add a <b>sticky cart bar</b> to your product pages and make it
              easier for shoppers to <b>add to cart instantly</b> no more
              scrolling!
            </Text>

            <Text as="p" tone="subdued" alignment="center">
              ⚡ Always visible Add to Cart button<br />
              🧩 Displays product info and price updates<br />
              🚀 Boosts conversions and reduces cart abandonment
            </Text>

            <Stack distribution="center">
              <Button
                size="large"
                icon={StarFilledMinor}
                primary
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>

      {/* Setup Video Modal */}
      <Modal
        open={modalActive}
        onClose={handleModalClose}
        title="Quick Setup Guide"
         secondaryActions={[
          {
            content: "Close",
            onAction: handleModalClose,
          },
        ]}
        large
      >
        <Modal.Section>
          {playVideo ? (
            <div style={{ position: "relative", paddingTop: "56.25%" }}>
              <iframe
                src="https://www.youtube.com/embed/1R5WZ6gZq2E?autoplay=1"
                title="StickyCart Boost Quick Setup"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: 0,
                  borderRadius: "8px",
                }}
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          ) : (
            <VideoThumbnail
              videoLength={90}
              thumbnailUrl="https://img.youtube.com/vi/1R5WZ6gZq2E/hqdefault.jpg"
              onClick={() => setPlayVideo(true)}
            />
          )}
        </Modal.Section>
      </Modal>
    </Page>
  );
}
