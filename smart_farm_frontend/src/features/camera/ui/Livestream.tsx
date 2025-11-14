import React, { useEffect, useRef, useState } from "react";
import { getUser } from "../../../utils/getUser";
import { Badge, rem } from "@mantine/core";
import { displayObject } from "./CameraCarousel";
import { useTranslation } from "react-i18next";
import useWebSocket from "react-use-websocket";
import { getWsUrl } from "../../../utils/utils";

export const Livestream: React.FC<{ src: displayObject; showing: boolean }> = ({ src, showing }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { t } = useTranslation();

    // WebSocket URL (getWsUrl() sollte ggf. Token enthalten)
    const wsUrl = `${getWsUrl()}/ws/camera/${src.cameraId}`;

    const { lastMessage } = useWebSocket(wsUrl, {
        shouldReconnect: () => true,
        onOpen: () => {
            setIsLoading(true);
        },
    }, showing); // third arg steuert connect/disconnect

    useEffect(() => {
        if (!lastMessage) return;

        try {
            const payload = JSON.parse(lastMessage.data);
            const frameB64 = payload?.frame_data;
            if (!frameB64) return;

            if (typeof frameB64 === "string" && frameB64.startsWith("ERROR")) {
                console.error(frameB64);
                return;
            }

            // base64 -> Uint8Array
            const binary = atob(frameB64);
            const len = binary.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);

            const blob = new Blob([bytes], { type: "image/jpeg" });

            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            // helper: ensure canvas matches the frame's intrinsic size
            const ensureCanvasSize = (w: number, h: number) => {
                if (canvas.width !== w || canvas.height !== h) {
                    canvas.width = w
                    canvas.height = h
                    // Match CSS size to pixel size so it displays at original resolution
                    canvas.style.width = `${580}px`;
                    canvas.style.height = `${340}px`;

                }
            };

            // Use createImageBitmap if available
            if ("createImageBitmap" in window) {
                (window as any).createImageBitmap(blob)
                    .then((bitmap: ImageBitmap) => {
                        ensureCanvasSize(bitmap.width, bitmap.height);
                        ctx.clearRect(0, 0, bitmap.width, bitmap.height);
                        // draw at native size (no scaling)
                        ctx.drawImage(bitmap, 0, 0);
                        setIsLoading(false);
                        bitmap.close?.();
                    })
                    .catch((err: unknown) => console.error("createImageBitmap error:", err));
            } else {
                // Fallback: Image + object URL
                const img = new Image();
                img.onload = () => {
                    ensureCanvasSize(img.naturalWidth, img.naturalHeight);
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);
                    URL.revokeObjectURL(img.src);
                    setIsLoading(false);
                };
                img.src = URL.createObjectURL(blob);
            }
        } catch (err) {
            console.error("Error handling websocket frame:", err);
        }
    }, [lastMessage]);

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <canvas
                ref={canvasRef}
                style={{ display: "block,",}}
            />
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
                        height: "100%",
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
        </div>
    );
};
