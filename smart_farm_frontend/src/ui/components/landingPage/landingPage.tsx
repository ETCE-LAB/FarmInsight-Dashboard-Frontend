import {
    Button,
    Container,
    Flex,
    rem,
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
import { IconPlant } from '@tabler/icons-react';
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
import { useMediaQuery } from '@mantine/hooks';

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
    const [loading, setLoading] = useState(true);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    // Detect mobile screens
    const isMobile = useMediaQuery('(max-width: 768px)');

    // Filter fpfs based on search term
    const filteredFpfs = fpfs?.filter(
        (fpf) =>
            fpf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fpf.organization.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Paginate the filtered fpfs list
    const paginatedFpfs = filteredFpfs?.slice(startIndex, endIndex);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        setLoading(true);
        receiveVisibleFpfs()
            .then((r) => setFpfs(r))
            .finally(() => setLoading(false));
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
        // Outer container fixed to viewport height with no global scrolling
        <Box style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
            {/* Header / Search Section */}
            <Box style={{overflowY: 'hidden'}}>
                <Container size={isMobile ? 'xs' : 'lg'} py={isMobile ? 'md' : 'xl'}>
                    <Flex direction={isMobile ? 'column' : 'row'} align="center" justify="center" gap="md">
                        <TextInput
                            placeholder={t('header.search')}
                            value={searchTerm}
                            onChange={handleSearchChange}
                            style={{ width: isMobile ? '90%' : '30vw' }}
                        />
                        {auth.isAuthenticated && (
                            <Button
                                onClick={() => setModalOpen(true)}
                                variant="filled"
                                color="#199ff4"
                                style={{ width: isMobile ? '90%' : 'auto' }}
                            >
                                {t('header.createOrganization')}
                            </Button>
                        )}
                    </Flex>
                </Container>
            </Box>

            {/* Scrollable FPFS List */}
            <Box style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
                <Container size={isMobile ? 'xs' : 'lg'}>
                    {loading ? (
                        <Flex justify="center" align="center" style={{ height: '50vh' }}>
                            <Loader size="lg" />
                        </Flex>
                    ) : (
                        <>
                            <Grid gutter={isMobile ? 'sm' : 'md'}>
                                {paginatedFpfs &&
                                    paginatedFpfs.map((fpf) => (
                                        <Grid.Col span={isMobile ? 12 : 4} key={fpf.id}>
                                            <Card
                                                p="lg"
                                                radius="md"
                                                style={{
                                                    height: '25vh',
                                                    margin: isMobile ? '10px 0' : '15px',
                                                    cursor: 'pointer',
                                                    transition: 'transform 0.2s ease',
                                                }}
                                                onClick={() => handleFpfSelect(fpf.organization.id, fpf.id)}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = 'scale(1.02)';
                                                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'scale(1)';
                                                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
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
                                                    {fpf.lastImageUrl?.length ? (
                                                        <Image
                                                            src={fpf.lastImageUrl}
                                                            alt="Last Received Image"
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover',
                                                                borderRadius: '5px',
                                                            }}
                                                        />
                                                    ) : (
                                                        <IconPlant size={rem(40)} color="gray" style={{ opacity: 0.5 }} />
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
                                        siblings={isMobile ? 1 : 2}
                                        defaultValue={currentPage}
                                        onChange={handlePageChange}
                                    />
                                )}
                            </Flex>
                        </>
                    )}
                </Container>
            </Box>

            {/* Footer */}
            <Footer />

            {/* Modal for Creating Organization */}
            <Modal
                opened={modalOpen}
                onClose={() => setModalOpen(false)}
                title={t('header.addOrganization')}
                centered
            >
                <OrganizationForm />
            </Modal>
        </Box>
    );
};

export default LandingPage;
