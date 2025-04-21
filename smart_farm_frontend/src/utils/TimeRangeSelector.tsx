import React, { useEffect, useState } from "react";
import { Button, Card, Container, Flex, Group, SegmentedControl } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { t } from "i18next";
import {getIsoStringFromDate} from "./utils";

interface TimeRangeSelectorProps {
    onDateChange: (dates: { from: string; to: string } | null) => void;
}

export const TimeRangeSelector = ({ onDateChange }: TimeRangeSelectorProps) => {
    const [selectedRange, setSelectedRange] = useState<string>("24h");
    const [showCalendar, setShowCalendar] = useState<boolean>(false);
    const [applyCustomDate, setApplyCustomDate] = useState<boolean>(false);
    const [customDate, setCustomDate] = useState<{ from: string; to: string }>({ from: '', to: '' });

    useEffect(() => {
        if (selectedRange !== 'Custom') {
            const toDay = new Date();
            const to = getIsoStringFromDate(toDay);
            let from: string;
            setShowCalendar(false);

            switch (selectedRange) {
                case '24h': {
                    const fromDate = new Date(toDay.getTime() - 24 * 60 * 60 * 1000);
                    from = getIsoStringFromDate(fromDate);
                    break;
                }
                case 'Week': {
                    const fromDate = new Date(toDay.getTime() - 7 * 24 * 60 * 60 * 1000);
                    from = getIsoStringFromDate(fromDate);
                    break;
                }
                case 'Month': {
                    const fromDate = new Date(toDay.getTime() - 30 * 24 * 60 * 60 * 1000);
                    from = getIsoStringFromDate(fromDate);
                    break;
                }
                case 'Year': {
                    const fromDate = new Date(toDay.getTime() - 365 * 24 * 60 * 60 * 1000);
                    from = getIsoStringFromDate(fromDate);
                    break;
                }
                default:
                    const fromDate = new Date(toDay.getTime() - 24 * 60 * 60 * 1000);
                    from = getIsoStringFromDate(fromDate);
                    break;
            }
            onDateChange({ from, to });
            setCustomDate({ from, to });
        } else {
            setShowCalendar(true);
        }
    }, [selectedRange]);

    useEffect(() => {
        if (applyCustomDate) {
            onDateChange(customDate);
            setApplyCustomDate(false);
        }
    }, [applyCustomDate]);

    return (
        <Flex style={{ position: 'relative', width: '100%', justifyContent:'left' }}>
            <Container style={{ marginBottom: '20px', marginLeft: '-15px' }}>
                <SegmentedControl
                    value={selectedRange}
                    onChange={setSelectedRange}
                    data={[
                        { label: t("timeRangeSelector.label24H"), value: '24h' },
                        { label: t("timeRangeSelector.labelWeek"), value: 'Week' },
                        { label: t("timeRangeSelector.labelMonth"), value: 'Month' },
                        { label: t("timeRangeSelector.labelYear"), value: 'Year' },
                        { label: t("timeRangeSelector.labelCustom"), value: 'Custom' }
                    ]}

                />
                {showCalendar && (
                        <Group style={{ marginTop: '10px', justifyContent: 'space-between' }}>
                            <DateTimePicker
                                label={t("timeRangeSelector.from")}
                                placeholder={t("timeRangeSelector.datePlaceholder")}
                                valueFormat="YYYY-MM-DD HH:mm:ss"
                                value={new Date(customDate?.from)}
                                onChange={(date) => { if (date) { setCustomDate({ ...customDate, from: getIsoStringFromDate(date) }) } }}
                                style={{ width: "35%", marginBottom: "15px" }}
                            />
                            <DateTimePicker
                                label={t("timeRangeSelector.to")}
                                placeholder={t("timeRangeSelector.datePlaceholder")}
                                valueFormat="YYYY-MM-DD HH:mm:ss"
                                value={new Date(customDate?.to)}
                                onChange={(date) => { if (date) { setCustomDate({ ...customDate, to: getIsoStringFromDate(date) }) } }}
                                style={{ width: "35%", marginBottom: "15px" }}
                            />
                            <Button
                                style={{ width: "20%", marginBottom: "-0.5vw" }}
                                onClick={() => {
                                    setApplyCustomDate(!applyCustomDate);
                                }}>
                                {t("timeRangeSelector.apply")}
                            </Button>
                        </Group>

                )}
            </Container>
        </Flex>
    );
}

export default TimeRangeSelector;