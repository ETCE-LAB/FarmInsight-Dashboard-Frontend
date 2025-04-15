import {useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {Location} from "../models/location";
import {notifications} from "@mantine/notifications";
import {updateLocation} from "../useCase/updateLocation";
import {createLocation} from "../useCase/createLocation";
import {Box, Button, Grid, NumberInput, Switch, TextInput} from "@mantine/core";
import {useAuth} from "react-oidc-context";
import {IconCloud, IconCloudOff} from "@tabler/icons-react";
import {useAppDispatch} from "../../../utils/Hooks";
import {changedMembership} from "../../membership/state/MembershipSlice";
import {receivedLocation} from "../state/LocationSlice";


export const LocationForm: React.FC<{ toEditLocation?: Location, setClosed: React.Dispatch<React.SetStateAction<boolean>>, organizationIdParam?:string }> = ({ toEditLocation, setClosed, organizationIdParam }) => {
    const auth = useAuth();
    const dispatch = useAppDispatch();

    const {organizationId} = useParams();
    const {t} = useTranslation();
    const [name, setName] = useState<string>("");
    const [latitude, setLatitude] = useState<number | string >(0);
    const [longitude, setLongitude] = useState<number | string >(0);
    const [city, setCity] = useState<string>("");
    const [street, setStreet] = useState<string>("");
    const [houseNumber, setHouseNumber] = useState<string>("");
    const [gatherForecasts, setGatherForecasts] = useState<boolean>(false);


    useEffect(() => {
        if (toEditLocation) {
            setName(toEditLocation.name);

            setLatitude(toEditLocation.latitude);
            setLongitude(toEditLocation.longitude);
            setCity(toEditLocation.city);
            setStreet(toEditLocation.street);
            setHouseNumber(toEditLocation.houseNumber);
            setGatherForecasts(toEditLocation.gatherForecasts);
        }
    }, [toEditLocation]);

    const handleEdit = () => {
        if (toEditLocation) {
            const id = notifications.show({
                loading: true,
                title: t('location.NotificationTitle'),
                message: t('location.NotificationMessage'),
                autoClose: false,
                withCloseButton: false,
            })
            updateLocation({
                id: toEditLocation.id,
                name: name,
                latitude: parseFloat(latitude.toString()),
                longitude: parseFloat(longitude.toString()),
                city: city,
                street: street,
                houseNumber: houseNumber,
                organizationId: organizationId ? organizationId : "",
                gatherForecasts: gatherForecasts,
            }).then(() => {
                notifications.update({
                    id,
                    color: 'teal',
                    title: t('location.NotificationTitle'),
                    message: t('location.NotificationMessageSuccess'),
                    autoClose: 2000,
                    withCloseButton: true,
                });
                dispatch(receivedLocation());
            }).catch((error) => {
                notifications.update({
                    id,
                    color: 'red',
                    title: t('location.NotificationTitle'),
                    message: t('location.NotificationMessageError', { error }),
                    autoClose: 2000,
                    withCloseButton: true,
                });
            }).finally(() => {
                setClosed(false);
            })
        }
    }

    const handleSave = () => {
        let orgId = "";
        if (organizationId) {
            orgId = organizationId;
        }
        else if(organizationIdParam) {
            orgId = organizationIdParam;
        }
            const id = notifications.show({
                loading: true,
                title: t('location.NotificationTitle'),
                message: t('location.NotificationMessage'),
                autoClose: false,
                withCloseButton: false,
            })

            createLocation({
                id: "",
                name: name,
                latitude: parseFloat(latitude.toString()),
                longitude: parseFloat(longitude.toString()),
                city: city,
                street: street,
                houseNumber: houseNumber,
                organizationId: orgId,
                gatherForecasts: gatherForecasts,
            }).then(() => {
                notifications.update({
                    id,
                    color: 'teal',
                    title: t('location.NotificationTitle'),
                    message: t('location.NotificationMessageSuccess'),
                    autoClose: 2000,
                    withCloseButton: true,
                });
                dispatch(receivedLocation());
            }).catch((error) => {
                notifications.update({
                    id,
                    color: 'red',
                    title: t('location.NotificationTitle'),
                    message: t('location.NotificationMessageError', {error}),
                    autoClose: 2000,
                    withCloseButton: true,
                });
            }).finally(() => {
                setClosed(false);
            })

    }

    return (
        <>
            {!auth.isAuthenticated ? (
                <Button onClick={() => auth.signinRedirect()} variant="filled" color="#105385" style={{ margin: '10px' }}>
                    {t("header.loginToManageFpf")}
                </Button>
            ) : (
                <Box>
                    <Grid gutter={"md"}>
                        {/* Name */}
                        <Grid.Col span={12}>
                            <TextInput
                                label={t('location.name')}
                                value={name}
                                onChange={(e) => setName(e.currentTarget.value)}
                                required
                            />
                        </Grid.Col>
                        {/* Latitude */}
                        <Grid.Col span={6}>
                            <TextInput
                                label={t('location.latitude')}
                                value={latitude}
                                onChange={(e) => setLatitude(e.currentTarget.value)}
                                required
                            />
                        </Grid.Col>
                        {/* Longitude */}
                        <Grid.Col span={6}>
                            <TextInput
                                label={t('location.longitude')}
                                value={longitude}
                                onChange={(e) => setLongitude(e.currentTarget.value)}
                                required
                            />
                        </Grid.Col>
                        {/* City */}
                        <Grid.Col span={6}>
                            <TextInput
                                label={t('location.city')}
                                value={city}
                                onChange={(e) => setCity(e.currentTarget.value)}
                                required
                            />
                        </Grid.Col>
                        {/* Street */}
                        <Grid.Col span={6}>
                            <TextInput
                                label={t('location.street')}
                                value={street}
                                onChange={(e) => setStreet(e.currentTarget.value)}
                                required
                            />
                        </Grid.Col>
                        {/* House Number */}
                        <Grid.Col span={6}>
                            <TextInput
                                label={t('location.houseNumber')}
                                value={houseNumber}
                                onChange={(e) => setHouseNumber(e.currentTarget.value)}
                                required
                            />
                        </Grid.Col>
                        {/* Gather Forecast */}
                        <Grid.Col span={6}>
                            <Box
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "flex-end",
                                    height: "100%",
                                }}
                            >
                                <span style={{ marginBottom: 5 }}>{t("location.gatherForecasts")}</span>
                                <Switch
                                    onLabel={<IconCloud size={16} stroke={2.5} />}
                                    offLabel={<IconCloudOff size={16} stroke={2.5} />}
                                    size="md"
                                    checked={gatherForecasts}
                                    onChange={(e) => setGatherForecasts(e.currentTarget.checked)}
                                />
                            </Box>
                        </Grid.Col>
                        {/* Submit Button */}
                        <Grid.Col span={12}>
                            <Box mt="md" style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px' }}>
                                <Button
                                    onClick={() => (toEditLocation ? handleEdit() : handleSave())}
                                    variant="filled"
                                    color="#105385"
                                    style={{ margin: '10px' }}
                                >
                                    {toEditLocation?.id ? t("userprofile.saveChanges") : t("location.AddCamera")}
                                </Button>
                            </Box>
                        </Grid.Col>
                    </Grid>
                </Box>
            )}
        </>
    );
}