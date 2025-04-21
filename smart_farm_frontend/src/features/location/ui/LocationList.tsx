import {useTranslation} from "react-i18next";
import {Box, Flex, Group, Modal, Table} from "@mantine/core";
import {IconCirclePlus, IconEdit} from "@tabler/icons-react";
import React, {useEffect, useState} from "react";
import {Location} from "../models/location";
import {LocationForm} from "./LocationForm";
import {getLocationByOrganization} from "../useCase/getLocationByOrganization";
import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../../utils/store";
import {getOrganization} from "../../organization/useCase/getOrganization";


export const LocationList: React.FC<{ locationsToDisplay?: Location[], isAdmin:boolean}> = ({ locationsToDisplay , isAdmin }) => {
    const [locationModalOpen, setLocationModalOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<Location | undefined>(undefined);
    const [locations, setLocations] = useState<Location[]>([]);
    const { t } = useTranslation();
    const { organizationId } = useParams<{ organizationId: string }>();
    const locationEventListener = useSelector((state: RootState) => state.location.receivedLocationEvent);

    useEffect(() => {
        if (organizationId) {
            getOrganization(organizationId).then((orga) => {
                if (orga !== undefined) {
                    setLocations(orga.locations);
                }
            });
        }
    }, [locationEventListener, organizationId]);

    useEffect(() => {
        if (locationsToDisplay && locationsToDisplay.length > 0) {
            setLocations(locationsToDisplay);
        }
    }, [locationsToDisplay]);


    const onClickEdit = (location: Location) => {
        const editLocation: Location = {
            id: location.id,
            name: location.name,
            city: location.city,
            street: location.street,
            houseNumber: location.houseNumber,
            latitude: location.latitude,
            longitude: location.longitude,
            organizationId: organizationId || "",
            gatherForecasts: location.gatherForecasts,
        };

        setSelectedLocation(editLocation);
        setLocationModalOpen(true);
    }

    return (
        <Box>
            {/*Location Modal*/}
            <Modal
                opened={locationModalOpen}
                onClose={() => setLocationModalOpen(false)}
                title={t("location.text.addLocation")}
                >
                <LocationForm toEditLocation={selectedLocation} setClosed={setLocationModalOpen} />
            </Modal>
            {/*Header*/}
            <Group mb="md" justify="space-between">
                <h2>{t('location.text.locations')}</h2>
                {isAdmin &&
                <IconCirclePlus
                    size={25}
                    stroke={2}
                    color={"#199ff4"}
                    onClick={() => setLocationModalOpen(true)}
                    style={{ cursor: "pointer" }}
                />
                }
            </Group>

            {locationsToDisplay && locationsToDisplay.length > 0 ? (
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>{t('location.name')}</Table.Th>
                            <Table.Th>{t('location.city')}</Table.Th>
                            <Table.Th>{t('location.street')}</Table.Th>
                            <Table.Th>{t('location.houseNumber')}</Table.Th>
                            <Table.Th>{t('location.latitude')}</Table.Th>
                            <Table.Th>{t('location.longitude')}</Table.Th>
                            <Table.Th>{t('location.gatherForecasts')}</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {locations.map((location) => (
                            <Table.Tr key={location.id}>
                                <Table.Td>{location.name}</Table.Td>
                                <Table.Td>{location.city}</Table.Td>
                                <Table.Td>{location.street}</Table.Td>
                                <Table.Td>{location.houseNumber}</Table.Td>
                                <Table.Td>{location.latitude}</Table.Td>
                                <Table.Td>{location.longitude}</Table.Td>
                                <Table.Td>{location.gatherForecasts? (t("location.text.isActive")):(t("location.text.isNotActive"))}</Table.Td>
                                {isAdmin &&
                                    <Table.Td>
                                        <Flex justify='center' align='center'>
                                            <IconEdit
                                                color={"#199ff4"}
                                                size={20}
                                                stroke={2}
                                                onClick={() => onClickEdit(location)}
                                                style={{ cursor: "pointer" }}
                                            />
                                        </Flex>
                                    </Table.Td>
                                }
                            </Table.Tr>
                        ))}
                    </Table.Tbody>

                </Table>
            ) : (
                <p>{t('location.noLocations')}</p> // Display a message if no locations are available
            )}
        </Box>
    )
}