import React, { useEffect, useState } from "react";
import { Camera } from "../models/camera";
import { useParams } from "react-router-dom";
import { Carousel } from "@mantine/carousel";
import { getImages } from "../useCase/getImages";
import {
    Box,
    Card,
    Center,
    Image,
    Switch,
    Text,
    Divider,
    Stack,
    Badge,
    rem,
    Modal,
    ActionIcon,
} from "@mantine/core";
import { useAuth } from "react-oidc-context";
import { Livestream } from "./Livestream";
import { IconCamera, IconVideo, IconVideoOff, IconMaximize } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { BACKEND_URL } from "../../../env-config";

export interface displayObject {
    url: string;
    title: string;
    isLiveStream: boolean;
}

export const CameraCarousel: React.FC<{ camerasToDisplay: Camera[] }> = ({
                                                                             camerasToDisplay,
                                                                         }) => {
    const { fpfId } = useParams();
    const [objectsToDisplay, setObjectsToDisplay] = useState<displayObject[]>([]);
    const [showLivestream, setShowLivestream] = useState<boolean>(false);
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [fullscreenView, setFullscreenView] = useState<boolean>(false);
    const [selectedObject, setSelectedObject] = useState<displayObject | null>(null);
    const auth = useAuth();
    const { t } = useTranslation();

    useEffect(() => {
        setObjectsToDisplay([]);

        if (camerasToDisplay.length > 0) {
            camerasToDisplay.forEach((camera) => {
                if (camera.isActive) {
                    if (showLivestream) {
                        setObjectsToDisplay((prevObjects) => [
                            ...prevObjects,
                            {
                                url: `${BACKEND_URL}/api/cameras/${camera.id}/livestream`,
                                title: `${camera.name} LiveStream`,
                                isLiveStream: true,
                            },
                        ]);
                    } else {
                        getImages(camera.id).then((resp) => {
                            if (resp && resp.length > 0) {
                                setObjectsToDisplay((prevObjects) => [
                                    ...prevObjects,
                                    {
                                        url: resp[0].url,
                                        title: `${camera.name}`,
                                        isLiveStream: false,
                                    },
                                ]);
                            }
                        });
                    }
                }
            });
        }
    }, [fpfId, camerasToDisplay, showLivestream]);

    const handleOpenFullscreen = (object: displayObject) => {
        setSelectedObject(object);
        setFullscreenView(true);
    };

    const slides = objectsToDisplay.map((objectToDisplay, index) => (
        <Carousel.Slide key={index}>
            <Box
                style={{ position: "relative" }}
            >
                {!objectToDisplay.isLiveStream && (
                    <>
                        <Image
                            src={objectToDisplay.url}
                            alt="Last Received Image"
                            fit="contain"
                            radius="md"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                            }}
                        />
                        <Badge
                            color="dark"
                            variant="filled"
                            size="md"
                            style={{
                                position: "absolute",
                                top: rem(10),
                                left: rem(10),
                            }}
                        >
                            {objectToDisplay.title}
                        </Badge>
                    </>
                )}
                {auth.isAuthenticated && objectToDisplay.isLiveStream && (
                    <Livestream src={objectToDisplay} />
                )}
                {/* Fullscreen icon overlay */}
                <ActionIcon
                    style={{
                        position: "absolute",
                        bottom: rem(10),
                        right: rem(10),
                        backgroundColor: "rgba(0, 0, 0, 0.4)",
                        cursor: "pointer",
                    }}
                    onClick={() => handleOpenFullscreen(objectToDisplay)}
                >
                    <IconMaximize color="white" />
                </ActionIcon>
            </Box>
        </Carousel.Slide>
    ));

    return (
        <>
            <Card p="lg" radius="md">
                {auth.isAuthenticated && (
                    <>
                        <Stack align="center" mb="xs">
                            <Text size="sm" fw={500}>
                                {t("label.setCameraCarousel")}
                            </Text>
                            <Switch
                                offLabel={<IconCamera size={16} />}
                                onLabel={<IconVideo size={16} />}
                                size="md"
                                checked={showLivestream}
                                onChange={(e) => setShowLivestream(e.currentTarget.checked)}
                            />
                        </Stack>
                        <Divider my="xs" />
                    </>
                )}

                <Center>
                    {camerasToDisplay && camerasToDisplay.length > 0 ? (
                        <Box
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            style={{
                                position: "relative",
                                borderRadius: rem(5),
                                overflow: "hidden",
                                width: "100%",
                            }}
                        >
                            <Carousel
                                withIndicators
                                loop
                                controlSize={32}
                                slideSize="100%"
                                styles={{
                                    controls: {
                                        opacity: isHovered ? 1 : 0,
                                        transition: "opacity 0.3s ease",
                                    },
                                }}
                            >
                                {slides}
                            </Carousel>
                        </Box>
                    ) : (
                        <Center style={{ height: "35vh" }}>
                            <IconVideoOff size={64} color="gray" />
                        </Center>
                    )}
                </Center>
            </Card>

            {/* Fullscreen Modal */}
            <Modal
                opened={fullscreenView}
                onClose={() => setFullscreenView(false)}
                size="100%"
                withCloseButton
                centered
                title={selectedObject?.title}
            >
                {selectedObject && !selectedObject.isLiveStream && (
                    <Image
                        src={selectedObject.url}
                        alt={selectedObject.title}
                        fit="contain"
                        radius="md"
                        style={{
                            width: "90%",
                            height: "90%",
                            objectFit: "contain",
                        }}
                    />
                )}
                {selectedObject && selectedObject.isLiveStream && (
                    <Livestream src={selectedObject} />
                )}
            </Modal>
        </>
    );
};
