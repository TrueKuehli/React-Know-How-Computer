import React, {useState} from "react";
import {Slider, Popover, useMantineTheme, Tooltip} from '@mantine/core';
import {useMediaQuery} from "@mantine/hooks";
import SpeedIcon from '@mui/icons-material/Speed';

import TooltipIconButton from "./TooltipIconButton";
import './SpeedSelector.scss';
import {useTranslation} from "react-i18next";

type Props = {
    buttonSize?: 'sm' | 'md' | 'lg' | 'xl';
    speed: number;
    setSpeed: (speed: number) => void;
    buttonClass: string;
}

function SpeedSelector(props: Props) {
    const [opened, setOpened] = useState(false);
    const isSmallScreen = useMediaQuery('(max-width: 800px)');
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
                    value={props.speed}
                    marks={[
                        { value: 1, label: '1' },
                        { value: 30, label: '30' },
                        { value: 60, label: '60' },
                    ]}
                    className={"SpeedSlider"}
                    onChange={props.setSpeed}
                />
            </Popover>
        :
            <>
                <SpeedIcon fontSize={"large"} className={props.buttonClass} style={{color: theme.colors[theme.primaryColor][theme.primaryShade as number], marginLeft: "0.5rem"}}/>

                <Tooltip label={t("SpeedSelector.Slider.Tooltip", {val: props.speed})} position="top" withArrow>
                    <Slider
                        min={1}
                        max={60}
                        step={1}
                        aria-label={t("SpeedSelector.Slider.AriaLabel")}
                        thumbLabel={t("SpeedSelector.Slider.ThumbAriaLabel")}
                        value={props.speed}
                        marks={[
                            { value: 1, label: '1' },
                            { value: 30, label: '30' },
                            { value: 60, label: '60' },
                        ]}
                        label={null}
                        className={"SpeedSlider Large"}
                        onChange={props.setSpeed}
                    />
                </Tooltip>
            </>
    );
}

export default SpeedSelector;