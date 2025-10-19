import React, {useEffect, useRef, useState} from "react";
import {getUser} from "../../../utils/getUser";
import {Badge, rem} from "@mantine/core";
import {displayObject} from "./CameraCarousel";
import {useTranslation} from "react-i18next";

export const Livestream: React.FC<{ src: displayObject, showing: boolean }> = ({src, showing}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const {t} = useTranslation();

    useEffect(() => {
        if (!showing) return;

        let isMounted = true;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        abortControllerRef.current = new AbortController();

        setIsLoading(true);

        const fetchStream = async () => {
            try {
                const response = await fetch(src.url, {
                    headers: {
                        ...{'Authorization': `Bearer ${getUser()?.access_token}`},
                    },
                    signal: abortControllerRef.current?.signal,
                });

                if (!response.body) throw new Error("No response body for stream");

                const reader = response.body.getReader();
                let imageBuffer: Uint8Array = new Uint8Array();

                // Read incoming stream data
                while (isMounted) {
                    const {value, done} = await reader.read();
                    if (done) break;

                    // Append new data to the buffer
                    const tempBuffer = new Uint8Array(imageBuffer.length + (value?.length || 0));
                    tempBuffer.set(imageBuffer);
                    if (value) tempBuffer.set(value, imageBuffer.length);
                    imageBuffer = tempBuffer;

                    // Look for JPEG start (0xFFD8) and end (0xFFD9) markers
                    let start = -1, end = -1;
                    for (let i = 0; i < imageBuffer.length - 1; i++) {
                        if (imageBuffer[i] === 0xFF && imageBuffer[i + 1] === 0xD8) {
                            start = i; // JPEG SOI (Start of Image)
                        }
                        if (imageBuffer[i] === 0xFF && imageBuffer[i + 1] === 0xD9) {
                            end = i + 2; // JPEG EOI (End of Image)
                            break;
                        }
                    }

                    // If a full frame (SOI -> EOI) is found, render it
                    if (start !== -1 && end !== -1) {
                        const frameData = imageBuffer.slice(start, end);
                        imageBuffer = imageBuffer.slice(end); // Remove processed frame from buffer

                        // Render the frame
                        const blob = new Blob([frameData], {type: "image/jpeg"});
                        const img = new Image();
                        img.src = URL.createObjectURL(blob);
                        img.onload = () => {
                            ctx?.clearRect(0, 0, canvas?.width || 0, canvas?.height || 0);
                            ctx?.drawImage(img, 0, 0, canvas?.width || 0, canvas?.height || 0);
                            URL.revokeObjectURL(img.src);

                            if (isMounted) setIsLoading(false);
                        };
                    }
                }
            } catch (error) {
                if ((error as Error).name === "AbortError") {
                    console.log("Stream fetch aborted.");
                } else {
                    console.error("Error during stream fetch:", (error as Error).message);
                }
            }
        };

        fetchStream();

        return () => {
            isMounted = false;
            setIsLoading(true);

            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [src, showing]);

    return (
        <>
            <canvas
                ref={canvasRef}
                width={640}
                height={360}
                style={{height: "100%", width: "100%"}}
            ></canvas>

            {/* Show loading state */}
            {isLoading && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(0,0,0,1)",
                        fontWeight: 600,
                        pointerEvents: "none",
                        textAlign: "center",
                    }}
                >
                    {t("common.loading")}
                </div>
            )}

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
                {src.title}
            </Badge>
        </>
    );
};