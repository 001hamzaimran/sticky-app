import { Box, Button, Card, Page, ProgressBar, Text } from '@shopify/polaris'
import React, { useEffect, useState } from 'react'
import './First.css'


export function DoneIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle cx="14" cy="14" r="14" fill="black" />
            <path
                d="M8 14.5L12 18L20 10"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function PendingIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle
                cx="14"
                cy="14"
                r="13"
                stroke="#C4C4C4"
                strokeWidth="2"
                strokeDasharray="4 4"
            />
        </svg>
    );
}

function First() {
    const [expandedSection, setExpandedSection] = useState(0);
    const [loading, setLoading] = useState(true);
    const [storeData, setStoreData] = useState(null);
    const [steps, setSteps] = useState([
        {
            title: "Activate app embed in Shopify",
            description: "Activate and save the app embed in your theme settings to make your Sticky Add to Cart Bar live.",
            completed: false,
            buttons: [
                { text: "Activate", primary: true },
                { text: "I've done it", outline: true }
            ]
        },
        {
            title: "Enable & Customise Sticky Add to Cart",
            description: "Enable Sticky Cart to make it visible and customise design and cart positioning to fit your store.",
            completed: false,
            buttons: [
                { text: "Enable", primary: true },
                { text: "Customize", outline: true }
            ]
        },
        {
            title: "Confirm Sticky Add to Cart is working properly",
            description: "Finish the steps above, then check if the Sticky Add to Cart Bar looks right on your store. Let us know if you run into issues or need design tweaks.",
            completed: false,
            buttons: [
                { text: "Everything is great", primary: true },
                { text: "Contact Support", outline: true }
            ]
        }
    ]);

    const disablingFirstView = async () => {
        try {
            const response = await fetch(`/api/disable-first-visit/${storeData.storeName}`);
            const data = await response.json();
            console.log("disabling", data);

        } catch (error) {
            console.error("Error fetching store data:", error);
        }
    }

    const handleGetStarted = () => {
        const shop = "marcelshop-9888.myshopify.com";
        const API_KEY = "56505304f3c96a93db57dbec3fda07dd";
        const EXTENSION_HANDLE = "sticky_cart";
        const url = `https://${shop}/admin/themes/current/editor?context=apps&activateAppId=${API_KEY}/${EXTENSION_HANDLE}`;
        window.open(url, "_blank");
    };

    const getTheme = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/getEmbedStatus");
            const data = await response.json();
            console.log("Theme data:", data);

            if (data.success && data.foundDetails) {
                // If disabled is false, mark the first step as completed
                if (data.foundDetails.disabled === false) {
                    setSteps(prevSteps => {
                        const newSteps = [...prevSteps];
                        newSteps[0] = {
                            ...newSteps[0],
                            completed: true
                        };
                        return newSteps;
                    });

                    // Auto-expand the next section (second accordion)
                    setExpandedSection(1);
                }
            }
        } catch (error) {
            console.error("Error fetching theme data:", error);
        } finally {
            setLoading(false);
        }
    }

    // Fetch store data on component mount
    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                // You might need to adjust this endpoint based on your setup
                const response = await fetch("/api/get-store");
                const data = await response.json();
                console.log("Store data:", data);
                setStoreData(data);
            } catch (error) {
                console.error("Error fetching store data:", error);
            }
        };

        fetchStoreData();
        getTheme();
    }, []);

    const toggleSection = (index) => {
        setExpandedSection(expandedSection === index ? -1 : index);
    };

    const handleButtonClick = async (stepIndex, buttonIndex) => {
        const newSteps = [...steps];
        const button = newSteps[stepIndex].buttons[buttonIndex];

        if (button.text === "Activate") {
            // Run the get started function to open the theme editor
            handleGetStarted();

        } else if (button.text === "I've done it") {
            // Mark as completed when user confirms they've activated the embed
            newSteps[stepIndex].completed = true;

            // Auto-expand the next section if available
            if (stepIndex < steps.length - 1) {
                setExpandedSection(stepIndex + 1);
            }
        } else if (button.text === "Everything is great") {
            disablingFirstView();
            newSteps[stepIndex].completed = true;

            // Auto-expand the next section if available
            if (stepIndex < steps.length - 1) {
                setExpandedSection(stepIndex + 1);
            }
        } else if (button.text === "Enable") {
            // For Enable button, mark as completed and show next step
            newSteps[stepIndex].completed = true;
            if (stepIndex < steps.length - 1) {
                setExpandedSection(stepIndex + 1);
            }
        }

        setSteps(newSteps);
    };

    const completedCount = steps.filter(step => step.completed).length;
    const totalSteps = steps.length;
    const progressPercentage = Math.round((completedCount / totalSteps) * 100);

    if (loading) {
        return (
            <Page>
                <Card>
                    <Card.Section>
                        <Text variant="bodyMd" as="p">Loading setup guide...</Text>
                    </Card.Section>
                </Card>
            </Page>
        );
    }

    return (
        <Page>

            <Card>
                <Card.Section>
                    <Text variant="headingMd" as="h2">
                        Setup Guide
                    </Text>
                    <Text>Follow these steps to start using Essential Sticky Add to Cart</Text>
                    <Box paddingBlockStart="2">
                        <div className="progress-container">
                            <Text as="h4" variant="headingSm">{completedCount}/{totalSteps} Completed</Text>
                            <div className="progress-bar-container">
                                <ProgressBar progress={progressPercentage} size="small" color="success" />
                            </div>
                        </div>
                    </Box>
                </Card.Section>

                {/* Collapsible Sections */}
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className={`collapsible-section ${expandedSection === index ? 'expanded' : 'collapsed'} ${step.completed ? 'completed' : ''}`}
                        onClick={() => toggleSection(index)}
                    >
                        <div className="section-header">
                            <div className="icon-container">
                                {step.completed ? <DoneIcon /> : <PendingIcon />}
                            </div>
                            <div className="section-content">
                                <Text variant="bodyMd" fontWeight="medium" as="h3">
                                    {step.title}
                                </Text>
                                {expandedSection === index && (
                                    <>
                                        <Text variant="bodySm" as="p" color="subdued">
                                            {step.description}
                                        </Text>
                                        <div className="button-container">
                                            {step.buttons.map((button, btnIndex) => (
                                                <Button
                                                    key={btnIndex}
                                                    size="slim"
                                                    primary={button.primary}
                                                    outline={button.outline}
                                                    disabled={index === 0 && button.text === "Activate" && steps[0].completed}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleButtonClick(index, btnIndex);
                                                    }}
                                                >
                                                    {button.text}
                                                </Button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="chevron">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    className={`chevron-icon ${expandedSection === index ? 'expanded' : ''}`}
                                >
                                    <path d="M8 12L3 7l1-1 4 4 4-4 1 1-5 5z" fill="currentColor" />
                                </svg>
                            </div>
                        </div>
                    </div>
                ))}
            </Card>
        </Page>
    )
}

export default First