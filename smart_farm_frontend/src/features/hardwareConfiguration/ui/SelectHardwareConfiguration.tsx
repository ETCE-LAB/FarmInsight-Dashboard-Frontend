import React, { useState, useEffect } from "react";
import { Table, ScrollArea, TextInput, Text, HoverCard, Loader, Box } from "@mantine/core";
import { HardwareConfiguration } from "../models/HardwareConfiguration";
import { getAvailableHardwareConfiguration } from "../useCase/getAvailableHardwareConfiguration";
import { useTranslation } from "react-i18next";
import { EditSensor } from "../../sensor/models/Sensor";
import { capitalizeFirstLetter, getBackendTranslation } from "../../../utils/utils";
import { showNotification } from "@mantine/notifications";
import { MultiLanguageInput } from "../../../utils/MultiLanguageInput";
import { getSensor } from "../../sensor/useCase/getSensor";
import { IconSearch } from "@tabler/icons-react";

interface SelectHardwareConfigurationProps {
    fpfId: string;
    postHardwareConfiguration(data: { sensorClassId: string, additionalInformation: Record<string, any> }): any;
    sensor?: EditSensor;
    setUnit(data: string): any;
    setParameter(data: string): any;
    setModel(data: string): any;
}

const SelectHardwareConfiguration: React.FC<SelectHardwareConfigurationProps> = ({ fpfId, postHardwareConfiguration, sensor, setUnit, setParameter, setModel, }) => {
    const [hardwareConfiguration, setHardwareConfiguration] = useState<HardwareConfiguration[]>([]);
    const [selectedSensorClassId, setSelectedSensorClassId] = useState<string | undefined>(undefined);
    const [additionalInformation, setAdditionalInformation] = useState<Record<string, any>>({});
    const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state#
    const { t, i18n } = useTranslation();
    const [originalId, setOriginalId] = useState<string>("");
    const [originalInfo, setOriginalInfo] = useState<Record<string, any>>({});
    const [manualInput, setManualInput] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        if (isLoading) {
            getAvailableHardwareConfiguration(fpfId).then((resp) => {
                setHardwareConfiguration(resp);

                if (sensor && resp.length > 0) {
                    return getSensor(sensor.id)
                }
                return null
            }).then((detail) => {
                if (detail) {
                    const matchingConfig = hardwareConfiguration.find(
                        (config) => config.sensorClassId === detail.hardwareConfiguration.sensorClassId
                    );

                    if (matchingConfig) {
                        setOriginalInfo(detail.hardwareConfiguration.additionalInformation);
                        setOriginalId(detail.hardwareConfiguration.sensorClassId);
                        postHardwareConfiguration({
                            sensorClassId: detail.hardwareConfiguration.sensorClassId,
                            additionalInformation: detail.hardwareConfiguration.additionalInformation,
                        });

                        setSelectedSensorClassId(detail.hardwareConfiguration.sensorClassId);
                        setAdditionalInformation(detail.hardwareConfiguration.additionalInformation);

                        let conf = hardwareConfiguration;
                        conf.splice(conf.indexOf(matchingConfig), 1);
                        conf.unshift(matchingConfig);
                        setHardwareConfiguration(conf);
                    }
                }
                setIsLoading(false); // Set loading state to false after fetching
            }).catch((error) => {
                setIsLoading(false);
                showNotification({
                    title: t('common.loadingError'),
                    message: error,
                    color: 'red',
                });
            });
        }
    }, [fpfId, hardwareConfiguration, isLoading, postHardwareConfiguration, sensor, t]);

    const handleSensorClassSelected = (sensorClassId: string) => {
        if (sensorClassId === originalId && !manualInput) {
            postHardwareConfiguration({ sensorClassId: sensorClassId, additionalInformation: originalInfo });
            setAdditionalInformation(originalInfo);
            setSelectedSensorClassId(sensorClassId);
        } else {
            const config = hardwareConfiguration.find((x) => x.sensorClassId === sensorClassId);
            if (config) {
                let info: Record<string, any> = {};
                for (const field of config.fields) {
                    info[field.name] = undefined;
                }
                setAdditionalInformation(info);
                if (config.unit !== '') setUnit(config.unit);
                if (config.parameter !== '') setParameter(config.parameter);
                if (config.model !== '') setModel(config.model);
                postHardwareConfiguration({ sensorClassId: sensorClassId, additionalInformation: info });
                setSelectedSensorClassId(sensorClassId);
            }
        }
    };

    const handleFieldInputChanged = (name: string, value: string) => {
        setManualInput(true);
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
        <ScrollArea h="35vh">
            {isLoading ? (
                <Box style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "30px" }}>
                    <Loader size="lg" />
                </Box>
            ) : hardwareConfiguration?.length > 0 ? (
                <Box>
                    <TextInput
                        placeholder={t("sensor.searchHardware")}
                        mb="md"
                        leftSection={<IconSearch size={16} stroke={1.5} />}
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.currentTarget.value)}
                    />
                    <Table striped highlightOnHover withColumnBorders>
                        <Table.Thead style={{ position: 'sticky', backgroundColor: "var(--mantine-color-body)" }}>
                            <Table.Tr>
                                <Table.Th>{t("sensor.connectionType")}</Table.Th>
                                <Table.Th>{t("sensor.model")}</Table.Th>
                                <Table.Th>{t("sensor.parameter")}</Table.Th>
                                <Table.Th>{t("sensor.unit")}</Table.Th>
                                <Table.Th>{t("sensor.tags")}</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody >
                            {hardwareConfiguration
                                .filter((config) => {
                                    const query = searchQuery.toLowerCase();
                                    return (
                                        config.connection.toLowerCase().includes(query) ||
                                        config.model.toLowerCase().includes(query) ||
                                        getBackendTranslation(config.parameter, i18n.language).toLowerCase().includes(query) ||
                                        config.unit.toLowerCase().includes(query) ||
                                        Object.values(config.tags).some(tag =>
                                            getBackendTranslation(tag, i18n.language).toLowerCase().includes(query)
                                        )
                                    );
                                })
                                .map((configuration) => (
                                    <React.Fragment key={configuration.sensorClassId}>
                                        <Table.Tr
                                            onClick={() => handleSensorClassSelected(configuration.sensorClassId)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <Table.Td>{capitalizeFirstLetter(configuration.connection)}</Table.Td>
                                            <Table.Td>{capitalizeFirstLetter(configuration.model)}</Table.Td>
                                            <Table.Td>{capitalizeFirstLetter(getBackendTranslation(configuration.parameter, i18n.language))}</Table.Td>
                                            <Table.Td>{capitalizeFirstLetter(configuration.unit)}</Table.Td>
                                            <Table.Td>
                                                {Object.entries(configuration.tags).map(([key, value]) => (
                                                    <HoverCard key={key} width={280} shadow="md">
                                                        <HoverCard.Target>
                                                            <Text>{capitalizeFirstLetter(getBackendTranslation(value, i18n.language))}</Text>
                                                        </HoverCard.Target>
                                                    </HoverCard>
                                                ))}
                                            </Table.Td>
                                        </Table.Tr>
                                        {configuration.sensorClassId === selectedSensorClassId && (
                                            <>
                                                {configuration.model === "" && (
                                                    <Table.Tr>
                                                        <Table.Td colSpan={1} />
                                                        <Table.Td colSpan={4}>
                                                            <TextInput
                                                                label={t("sensor.model")}
                                                                type="text"
                                                                value={sensor?.modelNr}
                                                                onChange={(e) => setModel(e.target.value)}
                                                            />
                                                        </Table.Td>
                                                    </Table.Tr>
                                                )}
                                                {configuration.parameter === "" && (
                                                    <Table.Tr>
                                                        <Table.Td colSpan={1} />
                                                        <Table.Td colSpan={4}>
                                                            <MultiLanguageInput
                                                                label={`${t("sensor.parameter")} (${t("sensor.parameter_hint")})`}
                                                                value={sensor?.parameter || ""}
                                                                onChange={(value) => setParameter(value)}
                                                            />
                                                        </Table.Td>
                                                    </Table.Tr>
                                                )}
                                                {configuration.unit === "" && (
                                                    <Table.Tr>
                                                        <Table.Td colSpan={1} />
                                                        <Table.Td colSpan={4}>
                                                            <TextInput
                                                                label={t("sensor.unit")}
                                                                type="text"
                                                                value={sensor?.unit}
                                                                onChange={(e) => setUnit(e.target.value)}
                                                            />
                                                        </Table.Td>
                                                    </Table.Tr>
                                                )}
                                                {configuration.fields.map((field) => (
                                                    <Table.Tr>
                                                        <Table.Td colSpan={1} />
                                                        <Table.Td colSpan={4}>
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
                                                            />
                                                        </Table.Td>
                                                    </Table.Tr>
                                                ))}
                                            </>
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
