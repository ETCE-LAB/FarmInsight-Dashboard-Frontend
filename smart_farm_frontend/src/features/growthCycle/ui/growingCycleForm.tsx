import React, { useState, useMemo, useEffect } from "react";
import { Button, Flex, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useTranslation } from "react-i18next";
import { createGrowingCycle } from "../useCase/createGrowingCycle";
import { GrowingCycle } from "../models/growingCycle";
import {getFpf} from "../../fpf/useCase/getFpf";
import {modifyGrowingCycle} from "../useCase/modifyGrowingCycle";
import {useAppDispatch} from "../../../utils/Hooks";
import {changedGrowingCycle} from "../state/GrowingCycleSlice";
import {showNotification} from "@mantine/notifications";

export const GrowingCycleForm: React.FC<{
    fpfId: string;
    toEditGrowingCycle: GrowingCycle | null;
    onSuccess: (message: string, color: string) => void;
}> = ({ fpfId, toEditGrowingCycle, onSuccess }) => {
    const { t } = useTranslation();
    const [growingCycle, setGrowingCycle] = useState<GrowingCycle>({ fpfId: fpfId } as GrowingCycle);
    const dispatch = useAppDispatch()
    const handleInputChange = (field: string, value: any) => {
        setGrowingCycle((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if(toEditGrowingCycle){
            try {
                await modifyGrowingCycle(growingCycle.id, growingCycle);
                showNotification({
                    title: 'Success',
                    message: 'Growing cycle edited',
                    color: 'green',
                });
            } catch (error) {
                showNotification({
                    title: 'Failed to save the growing cycle',
                    message: `${error}`,
                    color: 'red',
                });
            }
        }
        else{
            try {
                await createGrowingCycle(growingCycle);
                showNotification({
                    title: 'Success',
                    message: 'Growing cycle saved successfully!',
                    color: 'green',
                });
            } catch (error) {
                showNotification({
                    title: 'Failed to save the growing cycle',
                    message: `${error}`,
                    color: 'red',
            });
            }
        }
        dispatch(changedGrowingCycle());
    };

    const isFormValid = useMemo(() => {
        return growingCycle.plants?.trim() && growingCycle.startDate;
    }, [growingCycle]);

    useEffect(() => {
        if (toEditGrowingCycle) {
            setGrowingCycle(toEditGrowingCycle);
        }
    }, [toEditGrowingCycle]);

    return (
        <>
            <TextInput
                label={t("growingCycleForm.plantTypeLabel")}
                placeholder={t("growingCycleForm.plantTypePlaceholder")}
                required
                value={growingCycle.plants || ""}
                onChange={(e) => handleInputChange("plants", e.currentTarget.value)}
                style={{ width: "100%" }}
            />
            <Flex gap="50px" style={{ marginTop: "15px" }}>
                <DateInput
                    label={t("growingCycleForm.startDateLabel")}
                    placeholder={t("growingCycleForm.startDatePlaceholder")}
                    allowDeselect
                    required
                    value={growingCycle.startDate ? new Date(growingCycle.startDate) : null}
                    onChange={(date) => handleInputChange("startDate", date)}
                    style={{ flex: 1 }}
                />
                <DateInput
                    label={t("growingCycleForm.endDateLabel")}
                    placeholder={t("growingCycleForm.endDatePlaceholder")}
                    allowDeselect
                    value={growingCycle.endDate ? new Date(growingCycle.endDate) : null}
                    onChange={(date) => handleInputChange("endDate", date)}
                    style={{ flex: 1 }}
                />
            </Flex>
            <TextInput
                label={t("growingCycleForm.notesLabel")}
                placeholder={t("growingCycleForm.notesPlaceholder")}
                value={growingCycle.note || ""}
                onChange={(e) => handleInputChange("note", e.currentTarget.value)}
                style={{ width: "100%", marginTop: "15px" }}
            />
            <Flex justify="flex-end">
                <Button
                    style={{ width: "30%", marginTop: "1rem" }}
                    type="submit"
                    onClick={handleSubmit}
                    disabled={!isFormValid}
                >
                    {t("growingCycleForm.saveButton")}
                </Button>
            </Flex>
        </>
    );
};
