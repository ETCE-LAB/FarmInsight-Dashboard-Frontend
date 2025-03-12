import {
    Button,
    Container,
    Flex,
    Group,
    TextInput,
    Modal,
    Card,
    Title,
    Image,
    Box,
    Pagination,
    Text,
    Grid,
    Loader,
} from '@mantine/core';
import {
    IconPlant,
} from '@tabler/icons-react';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { getMyOrganizations } from '../../../features/organization/useCase/getMyOrganizations';
import { Organization } from '../../../features/organization/models/Organization';
import { useAuth } from 'react-oidc-context';
import { useSelector } from 'react-redux';
import { RootState } from '../../../utils/store';
import { OrganizationForm } from '../../../features/organization/ui/organizationForm';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../../../utils/appRoutes';
import { receiveVisibleFpfs } from '../../../features/fpf/useCase/receiveVisibleFpfs';
import { BasicFPF } from '../../../features/fpf/models/BasicFPF';
import { useTranslation } from 'react-i18next';
import Footer from '../footer/footer';
import {useMediaQuery} from "@mantine/hooks";

const LandingPage: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    const auth = useAuth();
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const organizationEventListener = useSelector(
        (state: RootState) => state.organization.createdOrganizationEvent
    );
    const navigate = useNavigate();
    const [fpfs, setFpfs] = useState<BasicFPF[]>([]);
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const ITEMS_PER_PAGE = 6;
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true); // NEW: Loading state
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    const isMobile = useMediaQuery('(max-width: 768px)');

    const filteredFpfs = fpfs?.filter(
        (fpf) =>
            fpf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fpf.organization.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedFpfs = filteredFpfs?.slice(startIndex, endIndex);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset to the first page when search term changes
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        setLoading(true); // Set loading before fetching data
        receiveVisibleFpfs()
            .then((r) => setFpfs(r))
            .finally(() => setLoading(false)); // Stop loading after data is fetched
    }, []);

    useEffect(() => {
        if (auth.isAuthenticated) {
            getMyOrganizations().then((resp) => {
                if (resp) setOrganizations(resp);
            });
        }
    }, [auth.user, organizationEventListener]);

    const handleFpfSelect = (organizationId: string, fpfId: string) => {
        navigate(
            AppRoutes.displayFpf
                .replace(':organizationId', organizationId)
                .replace(':fpfId', fpfId)
        );
    };

    return (
        <>
            <Container>
                <Flex justify="center">
                    <Group>
                        <TextInput
                            placeholder={t('header.search')}
                            style={{ width: '30vw' }}
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        {auth.isAuthenticated && (
                            <Button
                                onClick={() => setModalOpen(true)}
                                variant="filled"
                                color="#199ff4"
                            >
                                {t('header.createOrganization')}
                            </Button>
                        )}
                    </Group>
                </Flex>
            </Container>

            <Container style={{ overflowX: 'hidden' }}>
                {loading ? ( // Show loader while data is loading
                    <Flex justify="center" align="center" style={{ height: '50vh' }}>
                        <Loader size="lg" />
                    </Flex>
                ) : (
                    <>
                        <Grid>
                            {paginatedFpfs && paginatedFpfs.map((fpf) => (
                                <Grid.Col span={isMobile? 12 : 4}  key={fpf.id}>
                                    <Card
                                        p="lg"
                                        radius="md"
                                        style={{
                                            height: '25vh',
                                            width: "auto",
                                            margin: '15px',
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s ease',
                                        }}
                                        onClick={() =>
                                            handleFpfSelect(fpf.organization.id, fpf.id)
                                        }
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.02)';
                                            e.currentTarget.style.boxShadow =
                                                '0 8px 16px rgba(0, 0, 0, 0.2)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                            e.currentTarget.style.boxShadow =
                                                '0 4px 8px rgba(0, 0, 0, 0.1)';
                                        }}
                                    >
                                        <Flex justify="space-between" align="center" mb="sm">
                                            <Title
                                                order={3}
                                                style={{
                                                    fontSize: '1.1rem',
                                                    fontWeight: 600,
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                }}
                                            >
                                                {fpf.name}
                                            </Title>
                                            <Text style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                                                {fpf.organization.name}
                                            </Text>
                                        </Flex>
                                        <Box
                                            style={{
                                                height: '80%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            {fpf &&  fpf.lastImageUrl?.length ? (
                                                <Image
                                                    src={`${fpf.lastImageUrl}`}
                                                    alt="Last Received Image"
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        borderRadius: '5px',
                                                    }}
                                                />
                                            ) : (
                                                <IconPlant size={60} stroke={1.5} color="#199ff4" />
                                            )}
                                        </Box>
                                    </Card>
                                </Grid.Col>
                            ))}
                        </Grid>
                        <Flex justify="center" mt="lg">
                            {filteredFpfs && (
                                <Pagination
                                    total={Math.ceil(filteredFpfs.length / ITEMS_PER_PAGE) || 1}
                                    siblings={2}
                                    defaultValue={currentPage}
                                    onChange={handlePageChange}
                                />
                            )}
                        </Flex>
                    </>
                )}
            </Container>
            <Footer />
            <Modal
                opened={modalOpen}
                onClose={() => setModalOpen(false)}
                title={t('header.addOrganization')}
                centered={true}
            >
                <OrganizationForm />
            </Modal>
        </>
    );
};

export default LandingPage;
