import React, { useEffect, useState } from "react";
import {Box, Button, Grid, NumberInput, Switch, TextInput, Text, Stepper, LoadingOverlay} from "@mantine/core";
import { useAuth } from "react-oidc-context";
import { EditModel } from "../models/Model";
import SelectHardwareConfiguration from "../../hardwareConfiguration/ui/SelectHardwareConfiguration";
import { createModel } from "../useCase/createModel";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../../utils/Hooks";
import { receivedModel } from "../state/ModelSlice";
import { AppRoutes } from "../../../utils/appRoutes";
import { useNavigate } from "react-router-dom";
import { updateModel } from "../useCase/updateModel";
import { notifications } from "@mantine/notifications";
import { useTranslation } from "react-i18next";
import {IconMobiledata, IconMobiledataOff, IconSum, IconSumOff} from "@tabler/icons-react";
import {MultiLanguageInput} from "../../../utils/MultiLanguageInput";
import {getModelParams} from "../useCase/getModelParams";
import {useSelector} from "react-redux";
import {RootState} from "../../../utils/store";

export const ModelForm: React.FC<{ toEditModel?: EditModel, setClosed: React.Dispatch<React.SetStateAction<boolean>> }> = ({ toEditModel, setClosed }) => {
    const auth = useAuth();
    const { organizationId, fpfId } = useParams();
    const sensors = useSelector((state: RootState) => state.fpf.fpf.Sensors);
    const controllable_actions = useSelector((state: RootState) => state.fpf.fpf.ControllableAction);

    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState<string>("");
    const [intervalSeconds, setIntervalSeconds] = useState<number>(86400);
    const [url, setUrl] = useState<string>("");
    const [isActive, setIsActive] = useState<boolean>(true);
    const [availableScenarios, setAvailableScenarios] = useState<string[]>([]);
    const [activeScenario, setActiveScenario] = useState<string>("");
    const [requiredParameters, setRequiredParameters] = useState<{ name: string, type: string, value: any }[] | undefined>(undefined);
    const [actions, setActions] = useState<{ name: string; controllable_action_id: string; }[] | undefined>(undefined);

    const [forecasts, setForecasts] = useState<{name: string}[] | undefined>(undefined);

    const navigate = useNavigate();
    const { t } = useTranslation();

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (toEditModel) {
            setName(toEditModel.name || "");
            setUrl(toEditModel.URL || "");
            setIsActive(toEditModel.isActive || false);
            setIntervalSeconds(toEditModel.intervalSeconds || 86400); // default is one day
            setAvailableScenarios(toEditModel.availableScenarios || []);
            setRequiredParameters(toEditModel.required_parameters || []);
            setActions(toEditModel.actions || []);
        }
    }, [toEditModel]);

    const handleEdit = () => {
        if (toEditModel && requiredParameters) {
            setClosed(false);
            const id = notifications.show({
                loading: true,
                title: t('common.loading'),
                message: t('model.updatingModel'),
                autoClose: false,
                withCloseButton: false,
            });
            updateModel({
                id: toEditModel.id,
                name,
                URL:url,
                intervalSeconds,
                isActive,
                fpfId: toEditModel.fpfId,
                activeScenario,
                required_parameters: requiredParameters,
                availableScenarios,
                actions: actions ?? [],
                forecasts: forecasts ?? []

            }).then((model) => {
                notifications.update({
                    id,
                    title: t('common.updateSuccess'),
                    message: ``,
                    color: 'green',
                    loading: false,
                    autoClose: 2000,
                });
                dispatch(receivedModel());
            }).catch((error) => {
                notifications.update({
                    id,
                    title: t('common.updateError'),
                    message: `${error}`,
                    color: 'red',
                    loading: false,
                    autoClose: 10000,
                });
            });
        }
    };

    const handleSave = () => {
        if (/*hardwareConfiguration &&*/ fpfId && organizationId && requiredParameters && actions && forecasts) {
            setClosed(false);
            const interval = +intervalSeconds;
            const id = notifications.show({
                loading: true,
                title: t('common.loading'),
                message: t('model.creatingModel'),
                autoClose: false,
                withCloseButton: false,
            });
            createModel({
                id: '', name, URL:url, activeScenario, intervalSeconds: interval, isActive, fpfId, required_parameters: requiredParameters, availableScenarios, actions, forecasts
            }).then((response) => {
                notifications.update({
                    id,
                    title: t('common.saveSuccess'),
                    message: ``,
                    color: 'green',
                    loading: false,
                    autoClose: 2000,
                });
                dispatch(receivedModel());

                navigate(AppRoutes.editFpf.replace(":organizationId", organizationId).replace(":fpfId", fpfId));
            }).catch((error) => {
                notifications.update({
                    id,
                    title: t('common.saveError'),
                    message: `${error}`,
                    color: 'red',
                    loading: false,
                    autoClose: 2000,
                });
            });
        }
    };

    const handleFetchParameters = async () => {
        if (!url) {
          notifications.show({
            title: "Missing URL",
            message: "Please enter a valid URL first.",
            color: "red",
          });
          return;
        }

        try {
            setLoading(true);

            const data = await getModelParams(url);
            console.log(data)
            setRequiredParameters(data || []);
            setForecasts(data.forecasts)
            setAvailableScenarios(data.scenarios?.map((s: any) => s.name) || []);
            setRequiredParameters(
              data.input_parameters?.map((p: any) => ({
                name: p.name,
                type: p.type,
                value: p.default ?? "",
              })) || []
            );
            setActions(data.actions || []);
            setActiveStep(1);

        } catch (err: any) {
          notifications.show({
            title: "Error",
            message: err.message,
            color: "red",
          });
        } finally {
          setLoading(false);
        }
    };

    const handleSubmit = async () => {
        console.log(forecasts)
    if (!fpfId || !organizationId || !requiredParameters || !actions || !forecasts) return;

    const id = notifications.show({
      loading: true,
      title: t("common.loading"),
      message: toEditModel ? t("model.updatingModel") : t("model.creatingModel"),
      autoClose: false,
      withCloseButton: false,
    });

    try {
      const payload = {
        id: toEditModel?.id ?? "",
        name,
        URL: url,
        intervalSeconds,
        isActive,
        fpfId,
        activeScenario,
        required_parameters: requiredParameters,
        availableScenarios,
        actions,
          forecasts
      };

      if (toEditModel) {
        await updateModel(payload);
      } else {
        await createModel(payload);
      }

      notifications.update({
        id,
        title: t("common.saveSuccess"),
        color: "green",
        loading: false,
        autoClose: 2000,
        message: "Success!"
      });

      dispatch(receivedModel());
      setClosed(false);
      navigate(
        AppRoutes.editFpf
          .replace(":organizationId", organizationId)
          .replace(":fpfId", fpfId)
      );
    } catch (err: any) {
      notifications.update({
        id,
        title: t("common.saveError"),
        message: `${err}`,
        color: "red",
        loading: false,
        autoClose: 4000,
      });
    }
  };

    return (
    <>
      <LoadingOverlay visible={loading} />
      {!auth.isAuthenticated ? (
        <Button onClick={() => auth.signinRedirect()}>{t("header.loginToManageFpf")}</Button>
      ) : (
        <Stepper active={activeStep} onStepClick={setActiveStep} allowNextStepsSelect={false}>
          {/* Step 1: URL input */}
          <Stepper.Step label={t("model.enterUrl")} description={t("model.urlStepDesc")} allowStepSelect={false}>
            <TextInput
              label={t("header.url")}
              placeholder={t("header.enterUrl")}
              required
              value={url}
              onChange={(e) => setUrl(e.currentTarget.value)}
              description={t("model.hint.locationHint")}
            />
            <Box mt="md" style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={handleFetchParameters}>{t("common.next")}</Button>
            </Box>
          </Stepper.Step>

          {/* Step 2: Model configuration */}
          <Stepper.Step label={t("model.configureModel")} description={t("model.configStepDesc")} allowStepSelect={false}>
            <Grid gutter="md">
              <Grid.Col span={6}>
                <MultiLanguageInput
                  label={t("header.name")}
                  placeholder={t("header.enterName")}
                  required
                  value={name}
                  onChange={(value) => setName(value)}
                />
              </Grid.Col>

              <Grid.Col span={6}>
                <NumberInput
                  label={t("camera.intervalSeconds")}
                  placeholder={t("camera.enterIntervalSeconds")}
                  required
                  value={intervalSeconds}
                  onChange={(value) => setIntervalSeconds(value as number ?? 86400)}
                />
              </Grid.Col>

              <Grid.Col span={6} style={{ textAlign: "center" }}>
                <Text>{t("header.isActive")}</Text>
                <Switch
                  onLabel={<IconMobiledata size={16} />}
                  offLabel={<IconMobiledataOff size={16} />}
                  size="md"
                  checked={isActive}
                  onChange={() => setIsActive(!isActive)}
                />
              </Grid.Col>

              <Grid.Col span={12}>
                <Text fw={500} mb="xs">Select Active Scenario</Text>
                <select
                  style={{ width: "100%", padding: "8px" }}
                  value={activeScenario}
                  onChange={(e) => setActiveScenario(e.target.value)}
                >
                  <option value="">-- Choose scenario --</option>
                  {availableScenarios.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Grid.Col>

              <Grid.Col span={12}>
                <Text fw={500} mt="md">Input Parameters</Text>
                {requiredParameters?.map((param, i) => (
                  <Box key={i} mt="xs">
                    <Text size="sm" fw={500}>{param.name}</Text>
                    {param.type === "static" ? (
                      <TextInput
                        placeholder={`Enter ${param.name}`}
                        required
                        value={param.value}
                        onChange={(e) => {
                          const updated = [...requiredParameters];
                          updated[i].value = e.currentTarget.value;
                          setRequiredParameters(updated);
                        }}
                      />
                    ) : (
                        <select
                            style={{width: "100%", padding: "8px"}}
                            value={param.value}
                            onChange={(e) => {
                                const updated = [...requiredParameters];
                                updated[i].value = e.target.value;
                                setRequiredParameters(updated);
                            }}
                        >
                            <option value="">-- Select sensor --</option>
                            {sensors.map((sensor) => (
                                <option key={sensor.id} value={sensor.id}>
                                    {sensor.name}
                                </option>
                            ))}
                        </select>
                    )}
                  </Box>
                ))}
              </Grid.Col>
            </Grid>
              <Box mt="md" style={{display: "flex", justifyContent: "space-between"}}>
                  <Button variant="default" onClick={() => setActiveStep(0)}>
                      {t("common.back")}
                  </Button>
                  <Button onClick={() => setActiveStep(2)}>
                      {t("common.next")}
                  </Button>
          </Box>

          </Stepper.Step>

           <Stepper.Step
              label="Assign Actions"
              description="Map actions to controllable actions"
              allowStepSelect={false}
            >
           <Grid>
              <Grid.Col span={12}>
                <Text fw={500} mb="xs">Model Actions</Text>
                {actions?.map((action, i) => (
                  <Box key={i} mt="xs">
                    <Text size="sm" fw={500}>{action.name}</Text>
                      <select
                          style={{width: "100%", padding: "8px"}}
                          value={action.controllable_action_id}
                          onChange={(e) => {
                              const updated = [...actions];
                              updated[i].controllable_action_id = e.target.value;
                              setActions(updated);
                          }}
                      >
                          <option value="">-- Select controllable action --</option>
                          {controllable_actions.map((a) => (
                              <option key={a.id} value={a.id}>
                                  {a.name}
                              </option>
                          ))}
                      </select>
                  </Box>
                ))}
              </Grid.Col>
            </Grid>
               <Box mt="md" style={{display: "flex", justifyContent: "space-between"}}>
                   <Button variant="default" onClick={() => setActiveStep(1)}>
                       {t("common.back")}
                   </Button>
                   <Button onClick={handleSubmit}>
                       {toEditModel ? t("userprofile.saveChanges") : t("header.addModel")}
                </Button>
              </Box>
            </Stepper.Step>
        </Stepper>
      )}
    </>
  );
};