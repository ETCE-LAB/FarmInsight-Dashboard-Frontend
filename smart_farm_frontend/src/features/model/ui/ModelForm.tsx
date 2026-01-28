import React, { useEffect, useState } from "react";
import { Box, Button, Grid, NumberInput, Switch, TextInput, Text, Stepper, LoadingOverlay, Anchor, Select } from "@mantine/core";
import { useAuth } from "react-oidc-context";
import { EditModel, ModelType } from "../models/Model";
import { createModel } from "../useCase/createModel";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../../utils/Hooks";
import { receivedModel } from "../state/ModelSlice";
import { AppRoutes } from "../../../utils/appRoutes";
import { useNavigate } from "react-router-dom";
import { updateModel } from "../useCase/updateModel";
import { notifications } from "@mantine/notifications";
import { useTranslation } from "react-i18next";
import { IconMobiledata, IconMobiledataOff, IconRefresh } from "@tabler/icons-react";
import { MultiLanguageInput } from "../../../utils/MultiLanguageInput";
import { getModelParams } from "../useCase/getModelParams";
import { useSelector } from "react-redux";
import { RootState } from "../../../utils/store";

export const ModelForm: React.FC<{ toEditModel?: EditModel, setClosed: React.Dispatch<React.SetStateAction<boolean>> }> = ({ toEditModel, setClosed }) => {
  const auth = useAuth();
  const { organizationId, fpfId } = useParams();
  const sensors = useSelector((state: RootState) => state.fpf.fpf.Sensors);
  const controllable_actions = useSelector((state: RootState) => state.controllableAction.controllableAction);

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState<string>("");
  const [intervalSeconds, setIntervalSeconds] = useState<number>(86400);
  const [url, setUrl] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(true);
  const [modelType, setModelType] = useState<ModelType>('energy');
  const [availableScenarios, setAvailableScenarios] = useState<string[]>([]);
  const [activeScenario, setActiveScenario] = useState<string>("");
  const [requiredParameters, setRequiredParameters] = useState<{ name: string, type: string, input_type: string, value: any }[] | undefined>(undefined);
  const [actions, setActions] = useState<{ name: string; controllable_action_id: string; }[] | undefined>(undefined);

  const [forecasts, setForecasts] = useState<{ name: string }[] | undefined>(undefined);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (toEditModel) {
      setName(toEditModel.name || "");
      setUrl(toEditModel.URL || "");
      setIsActive(toEditModel.isActive || false);
      setIntervalSeconds(toEditModel.intervalSeconds || 86400); // default is one day
      setModelType(toEditModel.model_type || 'energy');
      setAvailableScenarios(toEditModel.availableScenarios || []);
      setRequiredParameters(toEditModel.required_parameters || []);
      setActions(toEditModel.actions || []);
      setActiveScenario(toEditModel.activeScenario || "");
      setForecasts(toEditModel.forecasts)
    }
  }, [toEditModel]);

  const handleParamChange = (index: number, value: any) => {
    setRequiredParameters((prev) => {
      if (!prev) return prev; // or return [] if you prefer never-undefined afterwards

      const updated = [...prev];
      updated[index] = { ...updated[index], value };
      return updated;
    });
  };

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
        URL: url,
        intervalSeconds,
        isActive,
        model_type: modelType,
        fpfId: toEditModel.fpfId,
        activeScenario,
        required_parameters: requiredParameters,
        availableScenarios,
        actions: actions ?? [],
        forecasts: forecasts ?? []

      }).then(() => {
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
        id: '', name, URL: url, activeScenario, intervalSeconds: interval, isActive, model_type: modelType, fpfId, required_parameters: requiredParameters, availableScenarios, actions, forecasts
      }).then(() => {
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

      setRequiredParameters(data || []);
      setForecasts(data.forecasts)
      setAvailableScenarios(data.scenarios?.map((s: any) => s.name) || []);
      setRequiredParameters(
        data.input_parameters?.map((p: any) => ({
          name: p.name,
          type: p.type,
          input_type: p.input_type,
          value: p.default ?? "",
        })) || []
      );
      setActions(data.actions || []);
      if (!data) {
        notifications.show({
          title: "Error",
          message: "Error fetching the ",
          color: "red",
        });
      }
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

    if (!fpfId || !organizationId || !requiredParameters || !actions || !forecasts) return;

    const id = notifications.show({
      loading: true,
      title: t("common.loading"),
      message: toEditModel ? t("model.updatingModel") : t("model.creatingModel"),
      autoClose: false,
      withCloseButton: false,
    });

    try {
      const payload: EditModel = {
        id: toEditModel?.id ?? "",
        name,
        URL: url,
        intervalSeconds,
        isActive,
        model_type: modelType,
        fpfId: fpfId!,
        activeScenario,
        required_parameters: requiredParameters!,
        availableScenarios,
        actions: actions!,
        forecasts: forecasts!
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
          <Stepper.Step label={t("model.enterUrl")} description={t("model.urlStepDesc")} allowStepSelect={!!toEditModel}>
            <TextInput
              label={t("header.url")}
              placeholder={t("header.enterUrl")}
              required
              value={url}
              onChange={(e) => setUrl(e.currentTarget.value)}
              description={t("model.hint.locationHint")}
            />
            {/* Small overwrite warning button if in edit mode */}
            {toEditModel && (
              <Anchor
                mt="xs"
                underline="hover"
                style={{ cursor: "pointer" }}
                onClick={handleFetchParameters}
              >
                <IconRefresh size={16} />
                {t("model.overwriteParameters")}
              </Anchor>
            )}

            <Box mt="md" style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                onClick={() => {
                  if (!toEditModel) {
                    handleFetchParameters();   // only run if NOT editing
                  }
                  setActiveStep(1);            // always go to next step
                }}
              >
                {t("common.next")}
              </Button>
            </Box>
          </Stepper.Step>

          {/* Step 2: Model configuration */}
          <Stepper.Step label={t("model.configureModel")} description={t("model.configStepDesc")} allowStepSelect={!!toEditModel}>
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
                  description={t("model.hint.interval")}
                  onChange={(value) => setIntervalSeconds(value as number ?? 86400)}
                />
              </Grid.Col>


              <Grid.Col span={6} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ marginTop: "1rem" }}>{t("header.isActive")}</Text>
                <Switch
                  onLabel={<IconMobiledata size={16} />}
                  offLabel={<IconMobiledataOff size={16} />}
                  size="md"
                  checked={isActive}
                  onChange={() => setIsActive(!isActive)}
                />
              </Grid.Col>

              <Grid.Col span={6}>
                <Select
                  label={t("model.modelType")}
                  description={t("model.modelTypeDescription")}
                  data={[
                    { value: 'energy', label: t("model.modelTypeEnergy") },
                    { value: 'water', label: t("model.modelTypeWater") },
                  ]}
                  value={modelType}
                  onChange={(value) => setModelType(value as ModelType)}
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
                      <>
                        {param.input_type === "int" || param.input_type === "float" ? (
                          <NumberInput
                            placeholder={`Enter ${param.name}`}
                            value={param.value}
                            onChange={(v) => handleParamChange(i, v)}
                            allowDecimal={param.input_type === "float"}
                            hideControls
                          />
                        ) : (
                          <TextInput
                            placeholder={`Enter ${param.name}`}
                            value={param.value}
                            onChange={(e) => handleParamChange(i, e.currentTarget.value)}
                          />
                        )}
                      </>

                    ) : (

                      <select
                        style={{ width: "100%", padding: "8px" }}
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
            <Box mt="md" style={{ display: "flex", justifyContent: "space-between" }}>
              <Button variant="default" onClick={() => setActiveStep(0)}>
                {t("common.back")}
              </Button>
              <Button onClick={() => setActiveStep(2)}>
                {t("common.next")}
              </Button>
            </Box>

          </Stepper.Step>

          <Stepper.Step
            label={t("model.assignActions")}
            description={t("model.assignActionsDescr")}
            allowStepSelect={!!toEditModel}
          >
            <Grid>
              <Grid.Col span={12}>
                <Text fw={500} mb="xs">Model Actions</Text>
                {actions?.map((action, i) => (
                  <Box key={i} mt="xs">
                    <Text size="sm" fw={500}>{action.name}</Text>
                    <select
                      style={{ width: "100%", padding: "8px" }}
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
            <Box mt="md" style={{ display: "flex", justifyContent: "space-between" }}>
              <Button variant="default" onClick={() => setActiveStep(1)}>
                {t("common.back")}
              </Button>
              <Button onClick={() => (toEditModel ? handleEdit() : handleSubmit())}>
                {toEditModel ? t("userprofile.saveChanges") : t("header.addModel")}
              </Button>
            </Box>
          </Stepper.Step>
        </Stepper>
      )}
    </>
  )
};
