import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {getLocationByOrganization} from "../useCase/getLocationByOrganization";
import {Box, Button, Collapse, Loader, ScrollArea, Table, Text} from "@mantine/core";
import {Location} from "../models/location";
import {LocationForm} from "./LocationForm";
import {useSelector} from "react-redux";
import {RootState} from "../../../utils/store";


export const SelectFPFLocation: React.FC<{organizationId: string,  setLocation: React.Dispatch<React.SetStateAction<Location>>, preSelectedLocation?: Location}> = ({ setLocation, organizationId, preSelectedLocation }) => {
    const locationEvent = useSelector((state: RootState) => state.location.receivedLocationEvent);
    const [locations, setLocations] = useState<Location[]>([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<Location>(
        {
            id: "",
            name: "",
            latitude: 0,
            longitude: 0,
            city: "",
            street: "",
            houseNumber: "",
            organizationId: organizationId || "",
            gatherForecasts: false,
        }
    );
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { t } = useTranslation();

    useEffect(() => {
        setIsLoading(true);
        getLocationByOrganization(organizationId).then((locations) => {
            setLocations(locations);
            setIsLoading(false);
        });
    }, [organizationId, locationEvent]);

    useEffect(() => {
        if (preSelectedLocation && preSelectedLocation.id) {
            setSelectedLocation(preSelectedLocation);
        }
    }, [preSelectedLocation]);

    return (
        <>
            {/* Toggle Button */}
            <Box style={{ marginBottom: "10px" }}>
                <Button
                    onClick={() => setIsFormVisible((prev) => !prev)}
                    variant="outline"
                    color="blue"
                >
                    {isFormVisible ? t("location.buttons.hideForm") : t("location.buttons.showForm")}
                </Button>
            </Box>
            <Collapse in={isFormVisible}>
                  <LocationForm setClosed={setIsFormVisible} organizationIdParam={organizationId} />
            </Collapse>
            <ScrollArea>
                {isLoading ? (
                    <Box style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "30px" }}>
                        <Loader size="lg" />
                    </Box>
                    ): locations?.length > 0 ? (
                    <Box>
                        <Table striped highlightOnHover  style={{ marginBottom: "20px" }}>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>{t("location.name")}</Table.Th>
                                    <Table.Th>{t("location.city")}</Table.Th>
                                    <Table.Th>{t("location.street")}</Table.Th>
                                    <Table.Th>{t("location.houseNumber")}</Table.Th>
                                    <Table.Th>{t("location.latitude")}</Table.Th>
                                    <Table.Th>{t("location.longitude")}</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {locations.map((location, index) => (
                                    <Table.Tr
                                        key={location.id}
                                        onClick={(e) => {
                                            setLocation(location);
                                        }}
                                        onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = "#595959";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor =
                                                selectedLocation.id === location.id
                                                    ? "#595959"
                                                    : index % 2 === 0
                                                        ? "#242424"
                                                        : "#3B3B3B";
                                        }}
                                        style={{
                                            cursor: "pointer",
                                                backgroundColor:
                                            selectedLocation.id === location.id
                                                ? "#595959"
                                                : index % 2 === 0
                                                    ? "#242424"
                                                    : "#3B3B3B",
                                        }}
                                    >
                                        <Table.Td>{location.name}</Table.Td>
                                        <Table.Td>{location.city}</Table.Td>
                                        <Table.Td>{location.street}</Table.Td>
                                        <Table.Td>{location.houseNumber}</Table.Td>
                                        <Table.Td>{location.latitude}</Table.Td>
                                        <Table.Td>{location.longitude}</Table.Td>

                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </Box>
                    ): (
                    <Box style={{ textAlign: "center", marginTop: "30px" }}>
                        <Text>{t("location.noLocation")}</Text>
                    </Box>
                )}

            </ScrollArea>
        </>
    );
}