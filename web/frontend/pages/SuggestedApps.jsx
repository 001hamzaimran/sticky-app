import React from "react";
import "./second.css";
import { Page } from "@shopify/polaris";

function SuggestedApps() {
    const otherApps = [
        {
            name: 'CartBoost AI',
            url: 'https://apps.shopify.com/cart-boost-ai?st_source=autocomplete&surface_detail=autocomplete_apps',
            image: 'https://cdn.shopify.com/app-store/listing_images/799deea5f642fac375dab8470d93bc5c/icon/CLjLqJ3WzY4DEAE=.jpeg'
        },
        {
            name: 'ABboost: A/B Testing',
            url: 'https://apps.shopify.com/boostab-a-b-testing?st_source=autocomplete&surface_detail=autocomplete_apps',
            image: 'https://cdn.shopify.com/app-store/listing_images/522f1c73dcc3a2505dddf4e16185da86/icon/CJbN0czL9o8DEAE=.jpeg'
        },
    ];

    return (
        <Page>
            <div className="suggested-apps-container">
                <div className="header-row">
                    <h2>Apps you might like</h2>
                    <button className="plain-btn">Suggested Apps</button>
                </div>

                <div className="app-grid">
                    {otherApps.map(app => (
                        <div
                            key={app.name}
                            className="app-card"
                            onClick={() => window.open(app.url, "_blank")}
                        >
                            <img src={app.image} alt={app.name} />
                            <p className="app-title">{app.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Page>
    );
}

export default SuggestedApps;
