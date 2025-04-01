import React, {useState} from "react";
import {Button, Modal} from "@mantine/core";
import {LogMessageList} from "./LogMessageList";
import {useTranslation} from "react-i18next";

export const LogMessageModalButton: React.FC<{ resourceType: string, resourceId?: string }> = ({ resourceType, resourceId }) => {
    const { t } = useTranslation();
    const [editLogOpen, setEditLogOpen] = useState(false);

    return (
      <>
          <Button onClick={() => setEditLogOpen(true)} variant="default">{t('log.showMessages')}</Button>

          <Modal
              opened={editLogOpen}
              onClose={() => setEditLogOpen(false)}  // Close modal when canceled
              title={t('log.logListTitle')}
              centered
              size="60%"
          >
              <LogMessageList resourceType={resourceType} resourceId={resourceId} />
          </Modal>
      </>
    );
}