import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Box, Button, Flex, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react";
import { GraphPrediction } from "./GraphPrediction";
import { getPrediction } from "../useCase/getPrediction";
import { Forecast, Model, ModelEntry } from "../models/Model";
import { showNotification as showMantineNotification } from "@mantine/notifications";
import { Threshold } from "../../threshold/models/threshold";
import { LabelPosition } from "recharts/types/component/Label";

export const PredictionView: React.FC<{ fpfId: string, models?: Model[] }> = ({ fpfId, models }) => {
    const auth = useAuth()
    const { t } = useTranslation();
    const [show, setShow] = useState<boolean>(false);
    const [model_predictions, setModelPredictions] = useState<any>(null);

    //Gather Prediction Data when UI is opened
    useEffect(() => {
        if (show) {
            getPrediction(fpfId).then(resp => {
                setModelPredictions(resp)
            }).catch(
                err => showMantineNotification({
                    title: t('common.loadingError'),
                    message: `${err}`,
                    color: "red",
                })
            )
        }
    }, [show, fpfId, t]);

    const matchingThresholds = (forecastName: string, modelId: string): Threshold[] => {
        if (!models) return [];
        const model = models.find(m => m.id === modelId);
        if (!model) return [];
        return model.thresholds.filter(t => t.rMMForecastName === forecastName);
    }


    return (
        <>
            {auth.isAuthenticated &&
                <>
                    <Flex align="center" gap="xs" style={{ marginBottom: '20px' }}>
                        <Button variant="subtle" size="xs" onClick={() => setShow(!show)}>
                            {show ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
                        </Button>
                        <Title order={3}>{t('model.predictionViewTitle')}</Title>
                    </Flex>
                    {(show && model_predictions?.models && model_predictions.models[0]?.modelName) && model_predictions.models.map((model: ModelEntry) => (
                        <Box key={model.modelId}>
                            <Flex style={{ marginBottom: '20px', marginTop: '10px' }}>
                                <Title order={4}>{model.modelName}</Title>
                            </Flex>
                            {model.data.forecasts.length > 0 && model.data.forecasts.map((forecast: Forecast) => (
                                <Box key={forecast.name}
                                    style={{
                                        borderRadius: '10px',
                                        marginBottom: '20px',
                                    }} >
                                    <GraphPrediction forecast={forecast} thresholds={matchingThresholds(forecast.name, model.modelId)} />
                                </Box>
                            ))}
                        </Box>
                    ))}
                </>
            }
        </>
    );
}