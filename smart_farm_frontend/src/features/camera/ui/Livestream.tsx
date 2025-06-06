import React, {useEffect, useRef} from "react";
import {getUser} from "../../../utils/getUser";
import {Badge, rem} from "@mantine/core";
import {displayObject} from "./CameraCarousel";

export const Livestream: React.FC<{ src : displayObject, showing: boolean }> = ({src, showing}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        if (!showing) return;

        let isMounted = true;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        abortControllerRef.current = new AbortController();

        const fetchStream = async () => {
            try {
                const token = getUser()?.access_token;
                if (!token) {
                    throw new Error("No access token available");
                }

                const authenticatedUrl = `${src.url}?token=${encodeURIComponent(token)}`;
                const response = await fetch(authenticatedUrl, {
                    signal: abortControllerRef.current?.signal,
                });

                if (!response.body) throw new Error("No response body for stream");

                const reader = response.body.getReader();
                let imageBuffer: Uint8Array = new Uint8Array();

                // Read incoming stream data
                while (isMounted) {
                    const { value, done } = await reader.read();
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
                        const blob = new Blob([frameData], { type: "image/jpeg" });
                        const img = new Image();
                        img.src = URL.createObjectURL(blob);
                        img.onload = () => {
                            ctx?.clearRect(0, 0, canvas?.width || 0, canvas?.height || 0);
                            ctx?.drawImage(img, 0, 0, canvas?.width || 0, canvas?.height || 0);
                            URL.revokeObjectURL(img.src);
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
                style={{ height: "100%", width: "100%"}}
            ></canvas>
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