import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {Slider, Popover, useMantineTheme, Tooltip} from "@mantine/core";
import {useMediaQuery} from "@mantine/hooks";
import SpeedIcon from "@mui/icons-material/Speed";

import {useAppDispatch, useAppSelector} from "../../state/stateHooks";
import {setSpeed} from "../../state/computerSlice";

import TooltipIconButton from "../generic/TooltipIconButton";
import "./SpeedSelector.scss";

type Props = {
    buttonSize?: "sm" | "md" | "lg" | "xl";
    buttonClass: string;
}

function SpeedSelector(props: Props) {
    const dispatch = useAppDispatch();
    const speed = useAppSelector((state) => state.computer.speed);

    const [opened, setOpened] = useState(false);
    const isSmallScreen = useMediaQuery("(max-width: 800px)");
    const theme = useMantineTheme();
    const {t} = useTranslation();

    return (
        isSmallScreen ?
            <Popover
                opened={opened}
                onClose={() => setOpened(false)}
                target={<TooltipIconButton hoverText={t("SpeedSelector.Button.Tooltip")}
                                           ariaLabel={t("SpeedSelector.Button.AriaLabel")}
                                           icon={{
                                              className: props.buttonClass
                                           }} color={"primary"}
                                           onClick={() => setOpened((open) => !open)}
                                           size={props.buttonSize || "xl"}

                        >
                            <SpeedIcon fontSize={"large"}/>
                        </TooltipIconButton>}
                width={300}
                position="top"
                withArrow
            >
                <Slider
                    min={1}
                    max={60}
                    step={1}
                    aria-label={t("SpeedSelector.Slider.AriaLabel")}
                    value={speed}
                    marks={[
                        { value: 1, label: "1" },
                        { value: 30, label: "30" },
                        { value: 60, label: "60" },
                    ]}
                    className={"SpeedSlider"}
                    onChange={(speed) => dispatch(setSpeed(speed))}
                />
            </Popover>
        :
            <>
                <SpeedIcon fontSize={"large"} className={props.buttonClass}
                           style={{color: theme.colors[theme.primaryColor][theme.primaryShade as number],
                                   marginLeft: "0.5rem"}}
                />

                <Tooltip label={t("SpeedSelector.Slider.Tooltip", {val: speed})} position="top" withArrow>
                    <Slider
                        min={1}
                        max={60}
                        step={1}
                        aria-label={t("SpeedSelector.Slider.AriaLabel")}
                        thumbLabel={t("SpeedSelector.Slider.ThumbAriaLabel")}
                        value={speed}
                        marks={[
                            { value: 1, label: "1" },
                            { value: 30, label: "30" },
                            { value: 60, label: "60" },
                        ]}
                        label={null}
                        className={"SpeedSlider Large"}
                        onChange={(speed) => dispatch(setSpeed(speed))}
                    />
                </Tooltip>
            </>
    );
}

export default SpeedSelector;