import React, { useEffect, useState } from "react";
import { EditModel, Model } from "../models/Model";
import { Badge, Box, Group, Modal, Table, Text, Title, HoverCard, Flex, Button, Card } from "@mantine/core";
import { DragDropContext, Draggable, DraggableProvided, Droppable } from '@hello-pangea/dnd';
import { IconChevronDown, IconChevronLeft, IconCirclePlus, IconEdit, IconGripVertical } from "@tabler/icons-react";
import { ModelForm } from "./ModelForm";
import { useTranslation } from "react-i18next";
import { getBackendTranslation, getModelStateColor, moveArrayItem } from "../../../utils/utils";
import { LogMessageModalButton } from "../../logMessages/ui/LogMessageModalButton";
import { ResourceType } from "../../logMessages/models/LogMessage";
import { ThresholdList } from "../../threshold/ui/thresholdList";
//import {postModelOrder} from "../useCase/postModelOrder";
import { showNotification } from "@mantine/notifications";

export const ModelList: React.FC<{ modelsToDisplay?: Model[], fpfId: string, isAdmin: Boolean }> = ({ modelsToDisplay, fpfId, isAdmin }) => {
    const [models, setModels] = useState<Model[] | undefined>(undefined);
    const [modelModalOpen, setModelModalOpen] = useState(false);
    const [selectedModel, setSelectedModel] = useState<EditModel | undefined>(undefined);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        setModels(modelsToDisplay);
    }, [modelsToDisplay]);

    const onClickEdit = (model: Model) => {
        const editModel: EditModel = {
            id: model.id,
            name: model.name,
            URL: model.URL,
            intervalSeconds: model.intervalSeconds,
            isActive: model.isActive,
            required_parameters: model.required_parameters,
            activeScenario: model.activeScenario,
            availableScenarios: model.availableScenarios,
            fpfId: model.fpfId,
            actions: model.actions,
            forecasts: model.forecasts
        };

        setSelectedModel(editModel);
        setModelModalOpen(true);
    }

    const onClickAddModel = () => {
        setSelectedModel(undefined);
        setModelModalOpen(true);
    }

    const ModelRow: React.FC<{ model: Model, provided: DraggableProvided }> = ({ model, provided }) => {
        const [open, setOpen] = useState<boolean>(false);

        return (
            <>
                <Table.Tr ref={provided.innerRef} {...provided.draggableProps}>
                    {isAdmin &&
                        <Table.Td>
                            <div {...provided.dragHandleProps}>
                                <IconGripVertical size={18} stroke={1.5} />
                            </div>
                        </Table.Td>
                    }
                    <Table.Td>{getBackendTranslation(model.name, i18n.language)}</Table.Td>
                    <Table.Td>{model.activeScenario}</Table.Td>
                    <Table.Td>{model.intervalSeconds}</Table.Td>
                    <Table.Td>{model.isActive ? t("common.activated") : t("common.inactive")}</Table.Td>
                    <Table.Td>
                        <Flex justify='space-between' align='center'>
                            <HoverCard>
                                {/*<HoverCard.Target>
                                    <Badge color={getModelStateColor(new Date(model.forecasts[0].forecast[0].timestamp), model.isActive, model.intervalSeconds)}>
                                        {!model.isActive && (<>{t("camera.inactive")}</>)}
                                    </Badge>
                                </HoverCard.Target>
                                <HoverCard.Dropdown>
                                    <Text size="sm">
                                        {`last forecast: ${new Date(model.forecasts[0].forecast[0].timestamp).toLocaleString(navigator.language)}`}
                                    </Text>
                                </HoverCard.Dropdown>*/}
                            </HoverCard>
                            <LogMessageModalButton resourceType={ResourceType.MODEL} resourceId={model.id}></LogMessageModalButton>
                        </Flex>
                    </Table.Td>

                    {isAdmin &&
                        <Table.Td>
                            <Flex justify='center' align='center'>
                                <IconEdit
                                    color={"#199ff4"}
                                    size={20}
                                    stroke={2}
                                    onClick={() => onClickEdit(model)}
                                    style={{ cursor: "pointer" }}
                                />
                            </Flex>
                        </Table.Td>
                    }
                </Table.Tr>
            </>
        )
    }

    return (
        <Box>
            {/* Add Model Modal */}
            <Modal
                opened={modelModalOpen}
                onClose={() => setModelModalOpen(false)}
                title={!selectedModel ? t("model.addModel") : t("model.editModel")}
                centered
                size="80%"
            >
                <ModelForm toEditModel={selectedModel} setClosed={setModelModalOpen} />
            </Modal>

            {/* Header with Add Button */}
            <Group mb="md" justify="space-between">
                <Title order={2}>{t('model.title')}</Title>
                {isAdmin &&
                    <IconCirclePlus
                        size={25}
                        stroke={2}
                        color={"#199ff4"}
                        onClick={() => onClickAddModel()}
                        style={{ cursor: "pointer" }}
                    />
                }
            </Group>
            {models && models.length > 0 ? (
                <Table highlightOnHover withColumnBorders>
                    <DragDropContext
                        onDragEnd={({ destination, source }) => {
                            const models_: Model[] = moveArrayItem(models, source.index, destination?.index || 0);
                            /* TODO implement later
                            setModels(models_);

                            postModelOrder(fpfId, models_.map((x: Model) => x.id)).then(() => {
                                // don't need to get list again since we keep the order locally
                            }).catch((error) => {
                               showNotification({
                                   title: t('common.saveError'),
                                   message: `${error}`,
                                   color: 'red',
                               })
                            });*/
                        }}
                    >
                        <Table.Thead>
                            <Table.Tr>
                                {isAdmin && <Table.Th />}
                                <Table.Th>{t('model.name')}</Table.Th>
                                <Table.Th>{t('model.activeScenario')}</Table.Th>
                                <Table.Th>{t('model.intervalSeconds')}</Table.Th>
                                <Table.Th>{t('model.isActive')}</Table.Th>
                                <Table.Th>{t('header.status')}</Table.Th>
                                {isAdmin && <Table.Th />}
                            </Table.Tr>
                        </Table.Thead>
                        <Droppable droppableId="models" direction="vertical">
                            {(provided) => (
                                <Table.Tbody {...provided.droppableProps} ref={provided.innerRef}>
                                    {models?.map((model, index) => (
                                        <Draggable key={model.id} index={index} draggableId={model.id}>
                                            {(provided: DraggableProvided) => (
                                                <ModelRow model={model} provided={provided}></ModelRow>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </Table.Tbody>
                            )}
                        </Droppable>
                    </DragDropContext>
                </Table>
            ) : (
                <Text>{t("model.noModelsFound")}</Text>
            )}
        </Box>
    );
};
