import React, { useState, useEffect } from "react";
import { Table, ScrollArea, TextInput, Text, HoverCard, Loader, Box } from "@mantine/core";
import { HardwareConfiguration } from "../models/HardwareConfiguration";
import { getAvailableHardwareConfiguration } from "../useCase/getAvailableHardwareConfiguration";
import { getSensor } from "../../sensor/useCase/getSensor";
import {getBackendTranslation} from "../../../utils/getBackendTranlation";
import {useTranslation} from "react-i18next";

function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

interface SelectHardwareConfigurationProps {
    fpfId: string;
    postHardwareConfiguration(data: { sensorClassId: string, additionalInformation: Record<string, any> }): any;
    sensorId?: string;
    setUnit(data: string): any;
    setModel(data: string): any;
}

const SelectHardwareConfiguration: React.FC<SelectHardwareConfigurationProps> = ({
                                                                                     fpfId,
                                                                                     postHardwareConfiguration,
                                                                                     sensorId,
                                                                                     setUnit,
                                                                                     setModel,
                                                                                 }) => {
    const [hardwareConfiguration, setHardwareConfiguration] = useState<HardwareConfiguration[]>([]);
    const [selectedSensorClassId, setSelectedSensorClassId] = useState<string | undefined>(undefined);
    const [additionalInformation, setAdditionalInformation] = useState<Record<string, any>>({});
    const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
    const { t, i18n } = useTranslation();

    useEffect(() => {
        setIsLoading(true); // Set loading state before fetching
        getAvailableHardwareConfiguration(fpfId)
            .then((resp) => {
                setHardwareConfiguration(resp);
                setIsLoading(false); // Set loading state to false after fetching
            });
    }, [fpfId]);

    useEffect(() => {
        if (sensorId && hardwareConfiguration?.length > 0) {
            getSensor(sensorId).then((sensor) => {
                if (sensor) {
                    const matchingConfig = hardwareConfiguration.find(
                        (config) => config.sensorClassId === sensor.hardwareConfiguration.sensorClassId
                    );

                    if (matchingConfig) {
                        postHardwareConfiguration({
                            sensorClassId: sensor.hardwareConfiguration.sensorClassId,
                            additionalInformation: sensor.hardwareConfiguration.additionalInformation,
                        });

                        setSelectedSensorClassId(sensor.hardwareConfiguration.sensorClassId);
                        setAdditionalInformation(sensor.hardwareConfiguration.additionalInformation);
                    } else {
                        console.warn(`No matching hardware configuration found for sensorClassId: ${sensor.hardwareConfiguration.sensorClassId}`);
                    }
                }
            });
        }
    }, [sensorId, hardwareConfiguration, postHardwareConfiguration]);

    const handleSensorClassSelected = (sensorClassId: string) => {
        const config = hardwareConfiguration.find((x) => x.sensorClassId === sensorClassId);
        if (config) {
            let info: Record<string, any> = {};
            for (const field of config.fields) {
                info[field.name] = undefined;
            }
            setAdditionalInformation(info);
            if (config.unit !== 'manual') setUnit(config.unit);
            setModel(config.model);
            postHardwareConfiguration({ sensorClassId: sensorClassId, additionalInformation: info });
            setSelectedSensorClassId(sensorClassId);
        }
    };

    const handleFieldInputChanged = (name: string, value: string) => {
        if (selectedSensorClassId) {
            const updatedInfo = { ...additionalInformation, [name]: value };
            setAdditionalInformation(updatedInfo);
            postHardwareConfiguration({
                sensorClassId: selectedSensorClassId,
                additionalInformation: updatedInfo,
            });
        }
    };

    return (
        <ScrollArea>
            {isLoading ? (
                <Box style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "30px" }}>
                    <Loader size="lg" />
                </Box>
            ) : hardwareConfiguration?.length > 0 ? (
                <Box>
                    <Table striped highlightOnHover withColumnBorders>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>{t("sensor.model")}</Table.Th>
                                <Table.Th>{t("sensor.connectionType")}</Table.Th>
                                <Table.Th>{t("sensor.parameter")}</Table.Th>
                                <Table.Th>{t("sensor.unit")}</Table.Th>
                                <Table.Th>{t("sensor.tags")}</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {hardwareConfiguration.map((configuration) => (
                                <React.Fragment key={configuration.sensorClassId}>
                                    <Table.Tr
                                        onClick={() => handleSensorClassSelected(configuration.sensorClassId)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <Table.Td>{capitalizeFirstLetter(configuration.model)}</Table.Td>
                                        <Table.Td>{capitalizeFirstLetter(configuration.connection)}</Table.Td>
                                        <Table.Td>{capitalizeFirstLetter(getBackendTranslation(configuration.parameter, i18n.language))}</Table.Td>
                                        <Table.Td>{capitalizeFirstLetter(configuration.unit)}</Table.Td>
                                        <Table.Td>
                                            {Object.entries(configuration.tags).map(([key, value]) => (
                                                <HoverCard key={key} width={280} shadow="md">
                                                    <HoverCard.Target>
                                                        <Text>{capitalizeFirstLetter(value)}</Text>
                                                    </HoverCard.Target>
                                                </HoverCard>
                                            ))}
                                        </Table.Td>
                                    </Table.Tr>
                                    {configuration.sensorClassId === selectedSensorClassId && (
                                        <Table.Tr>
                                            <Table.Td colSpan={5}>
                                                <Box style={{ display: "flex", gap: "16px" }}>
                                                    {configuration.fields.map((field) => (
                                                        <TextInput
                                                            required
                                                            placeholder={capitalizeFirstLetter(field.name)}
                                                            key={field.name}
                                                            label={`${capitalizeFirstLetter(field.name)}`}
                                                            type={field.type}
                                                            value={additionalInformation[field.name]}
                                                            onChange={(e) =>
                                                                handleFieldInputChanged(field.name, e.target.value)
                                                            }
                                                            style={{ width: "100%" }}
                                                        />
                                                    ))}
                                                </Box>
                                            </Table.Td>
                                        </Table.Tr>
                                    )}
                                    {configuration.unit === "manual" && (
                                        <Table.Tr>
                                            <Table.Td colSpan={5}>
                                                <TextInput
                                                    label="Unit"
                                                    type="text"
                                                    onChange={(e) => setUnit(e.target.value)}
                                                    style={{ flex: 0.5 }}
                                                />
                                            </Table.Td>
                                        </Table.Tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Box>
            ) : (
                <Box style={{ textAlign: "center", marginTop: "30px" }}>
                    <Text>{t("sensor.noConfig")}</Text>
                </Box>
            )}
        </ScrollArea>
    );

};

export default SelectHardwareConfiguration;
