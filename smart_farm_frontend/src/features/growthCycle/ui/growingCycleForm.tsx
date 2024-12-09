import React, {useState, useMemo, useEffect} from "react";
import { Button, Flex, Notification, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { createGrowingCycle } from "../useCase/createGrowingCycle";
import { GrowingCycle } from "../models/growingCycle";
import {getFpf} from "../../fpf/useCase/getFpf";
import {modifyGrowingCycle} from "../useCase/modifyGrowingCycle";
import {useAppDispatch} from "../../../utils/Hooks";
import {changedGrowingCycle} from "../state/GrowingCycleSlice";
import {showNotification} from "@mantine/notifications";

export const GrowingCycleForm: React.FC<{ fpfId: string, toEditGrowingCycle:GrowingCycle | null }> = ({ fpfId, toEditGrowingCycle }) => {
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

    // Check if the form is valid
    const isFormValid = useMemo(() => {
        return (
            growingCycle.plants?.trim() &&
            growingCycle.startDate
        );
    }, [growingCycle]);

    useEffect(() => {
        if(toEditGrowingCycle){
            setGrowingCycle(toEditGrowingCycle)
        }
    }, [toEditGrowingCycle]);



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
                    allowDeselect
                    required
                    value={growingCycle.startDate? new Date(growingCycle.startDate) : null}
                    onChange={(date) => handleInputChange("startDate", date)}
                    style={{ flex: 1 }}
                />
                <DateInput
                    label="End Date"
                    placeholder="End Date"
                    allowDeselect
                    value={growingCycle.endDate? new Date(growingCycle.endDate) : null}
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
        </>
    );
};
