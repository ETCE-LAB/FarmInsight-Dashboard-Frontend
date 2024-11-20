import React, { useState, useMemo } from "react";
import { Button, Flex, Notification, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { createGrowingCycle } from "../useCase/createGrowingCycle";
import { GrowingCycle } from "../models/growingCycle";

export const GrowingCycleForm: React.FC<{ fpfId: string }> = ({ fpfId }) => {
    const [growingCycle, setGrowingCycle] = useState<GrowingCycle>({ fpfId: fpfId } as GrowingCycle);
    const [notification, setNotification] = useState<{ message: string; color: string } | null>(null);

    const handleInputChange = (field: string, value: any) => {
        setGrowingCycle((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        try {
            await createGrowingCycle(growingCycle);
            setNotification({ message: "Growing cycle saved successfully!", color: "green" });
        } catch (error) {
            setNotification({ message: "Failed to save the growing cycle.", color: "red" });
        }
    };

    // Check if the form is valid
    const isFormValid = useMemo(() => {
        return (
            growingCycle.plants?.trim() &&
            growingCycle.startDate
        );
    }, [growingCycle]);

    return (
        <>
            <TextInput
                label="Plant Type"
                placeholder="Plant Type"
                required
                value={growingCycle.plants || ""}
                onChange={(e) => handleInputChange("plants", e.currentTarget.value)}
                style={{ width: "100%" }}
            />
            <Flex gap="50px" style={{ marginTop: "15px" }}>
                <DateInput
                    label="Start Date"
                    placeholder="Start Date"
                    required
                    value={growingCycle.startDate || null}
                    onChange={(date) => handleInputChange("startDate", date)}
                    style={{ flex: 1 }}
                />
                <DateInput
                    label="End Date"
                    placeholder="End Date"
                    value={growingCycle.endDate || null}
                    onChange={(date) => handleInputChange("endDate", date)}
                    style={{ flex: 1 }}
                />
            </Flex>
            <TextInput
                label="Notes"
                placeholder="Notes about your plants"
                value={growingCycle.note || ""}
                onChange={(e) => handleInputChange("note", e.currentTarget.value)}
                style={{ width: "100%", marginTop: "15px" }}
            />
            <Flex justify="flex-end">
                <Button
                    style={{ width: "30%", marginTop: "1rem" }}
                    type="submit"
                    onClick={handleSubmit}
                    disabled={!isFormValid} // Disable the button if the form is invalid
                >
                    Save
                </Button>
            </Flex>

            {notification && (
                <Notification
                    color={notification.color}
                    onClose={() => setNotification(null)}
                    style={{ marginTop: "20px" }}
                >
                    {notification.message}
                </Notification>
            )}
        </>
    );
};
