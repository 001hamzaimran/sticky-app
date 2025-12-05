// second.jsx
import React, { useEffect, useState } from 'react'
import "./Second.css"
import { Page, Banner, List } from '@shopify/polaris'

function Second() {
    const [storeData, setStoreData] = useState(null);
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
    const handleGetStarted = () => {
        const shop = storeData.domain;
        const API_KEY = "c23e9fe0713ccd6c1eff49729441698d";
        const EXTENSION_HANDLE = "sticky_cart";

        const url = `https://${shop}/admin/themes/current/editor?context=apps&activateAppId=${API_KEY}/${EXTENSION_HANDLE}`;
        window.open(url, "_blank");
    };

    useEffect(() => {
        getStore();
    }, []);
    return (
        <Page>
            <Banner
                title="Sticky Cart app is not activated yet"
                action={{ content: 'Activate', onAction: handleGetStarted }}
                secondaryAction={{ content: 'I have Done it' }}
                tone="warning"
            >
                <List>
                    <List.Item>
                        Please activate the app by clicking 'Activate' button below and then 'Save' in the following page
                    </List.Item>
                </List>
            </Banner>

        </Page>
    )
}

export default Second
