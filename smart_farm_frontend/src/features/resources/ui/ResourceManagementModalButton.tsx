import React, { useState } from 'react';
import { Button, Modal } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IconSettings } from '@tabler/icons-react';
import { ResourceManagementForm } from './ResourceManagementForm';
import { Fpf } from '../../fpf/models/Fpf';

interface ResourceManagementModalButtonProps {
    fpf: Fpf;
}

export const ResourceManagementModalButton: React.FC<ResourceManagementModalButtonProps> = ({ fpf }) => {
    const { t } = useTranslation();
    const [opened, setOpened] = useState(false);

    return (
        <>
            <Button
                onClick={() => setOpened(true)}
                variant="light"
                leftSection={<IconSettings size={18} />}
            >
                {t('resources.managementTitle')}
            </Button>

            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title={t('resources.managementTitle')}
                centered
                size="lg"
            >
                <ResourceManagementForm fpf={fpf} onSuccess={() => { setOpened(false); }} />
            </Modal>
        </>
    );
};
