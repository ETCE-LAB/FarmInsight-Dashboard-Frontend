import { Box, Card, Input, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { getUserProfilesBySearchString } from "../useCase/getUserProfilesBySearchString";
import { UserProfile } from "../models/UserProfile";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {showNotification} from "@mantine/notifications";

interface SearchUserProfileProps {
    onUserSelected: (user: UserProfile) => void;
}

export const SearchUserProfile = ({ onUserSelected }: SearchUserProfileProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
    const { t } = useTranslation();
    const { organizationId } = useParams();

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchTerm) {
                getUserProfilesBySearchString(searchTerm, organizationId).then((profiles) => {
                    if (profiles) {
                        // Filter profiles locally to exclude the domain part
                        const filteredProfiles = profiles.filter((profile) => {
                            const emailPrefix = profile.email.split("@")[0].toLowerCase();
                            const name = profile.name.toLowerCase();
                            const lowerSearch = searchTerm.toLowerCase();

                            return (
                                emailPrefix.includes(lowerSearch) ||
                                name.includes(lowerSearch)
                            );
                        });

                        setUserProfiles(filteredProfiles);
                    }
                }).catch((error) => {
                    showNotification({
                        title: t("common.loadError"),
                        message: `${error}`,
                        color: 'red',
                    });
                });
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm, organizationId, t]);

    return (
        <>
            <Input
                placeholder={t("header.searchUserProfile")}
                style={{ width: "100%", marginBottom: "15px" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Box style={{ marginTop: "10px" }}>
                {userProfiles.length > 0 ? (
                    userProfiles.map((profile, index) => (
                        <Card
                            key={index}
                            onClick={() => onUserSelected(profile)}
                            style={{
                                padding: "12px",
                                marginBottom: "8px",
                                border: "2px solid #105385",
                                borderRadius: "8px",
                                cursor: "pointer",
                            }}
                        >
                            <Text style={{ margin: "0", fontSize: "16px", fontWeight: "bold" }}>
                                {profile.name}
                            </Text>
                            <Text style={{ margin: "2px 0", fontSize: "14px", color: "#555" }}>
                                {profile.email}
                            </Text>
                        </Card>
                    ))
                ) : (
                    <Text style={{ color: "#888" }}>{t("header.noProfilesFound")}</Text>
                )}
            </Box>
        </>
    );
};
