import React from "react";
import {useTranslation} from "react-i18next";
import {Divider, MediaQuery, Text, Tooltip} from "@mantine/core";
import {useMediaQuery} from "@mantine/hooks";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrow from "@mui/icons-material/PlayArrow";
import RotateLeft from "@mui/icons-material/RotateLeft";

import {digits10} from "../../util/Math";
import {useAppDispatch, useAppSelector} from "../../state/stateHooks";
import {executeCells, setPC, toggleRunning} from "../../state/computerSlice";

import SaveProgram from "./SaveProgram";
import SpeedSelector from "./SpeedSelector";
import TooltipIconButton from "../generic/TooltipIconButton";
import NonEmptyNumInput from "../generic/NonEmptyNumInput";
import "./ActionsPalette.scss";


type Props = {
    lastAnimationFrameRef: React.MutableRefObject<number>;
}

function ActionsPalette(props: Props) {
    const dispatch = useAppDispatch();
    const running = useAppSelector((state) => state.computer.running);
    const pc = useAppSelector((state) => state.computer.pc);
    const commands = useAppSelector((state) => state.computer.commands);

    const smallScreen = useMediaQuery("(max-width: 500px)");
    const {t} = useTranslation();

    return (
        <div className="ActionsPalette">
            <MediaQuery
                query="(max-width: 500px)"
                styles={{ display: "none" }}
            >
                <Text size={smallScreen ? "lg" : "xl"} className="ProgramCounterText" color="white" weight="bold">
                    {t("ActionsPalette.PC.Label")}:
                </Text>
            </MediaQuery>
            <Tooltip label={t("ActionsPalette.PC.Tooltip")} position={"top"} withArrow>
                <NonEmptyNumInput className="ProgramCounter"
                                  ariaLabel={t("ActionsPalette.PC.AriaLabel")}
                                  current={pc}
                                  min={0}
                                  max={Math.max(commands.length - 1, 0)}
                                  width={`${6 + digits10(commands.length)}ch`}
                                  update={(pc: number) => dispatch(setPC(pc))}/>
            </Tooltip>
            <Divider orientation="vertical" className={"Divider"}/>
            <TooltipIconButton icon={{className: "ActionButton"}}
                               color={"primary"}
                               size={smallScreen ? "lg" : "xl"}
                               hoverText={running ? t("ActionsPalette.Pause.Tooltip")
                                   : t("ActionsPalette.Start.Tooltip")}
                               ariaLabel={running ? t("ActionsPalette.Pause.AriaLabel")
                                   : t("ActionsPalette.Start.AriaLabel")}
                               onClick={() => {
                                   dispatch(toggleRunning());
                                   props.lastAnimationFrameRef.current = performance.now();
                               }}
            >
                {running ? <PauseIcon fontSize="large"/> : <PlayArrow fontSize="large" />}
            </TooltipIconButton>
            <TooltipIconButton icon={{className: "ActionButton"}}
                               color={"primary"}
                               size={smallScreen ? "lg" : "xl"}
                               hoverText={t("ActionsPalette.Step.Tooltip")}
                               ariaLabel={t("ActionsPalette.Step.AriaLabel")}
                               onClick={() => dispatch(executeCells(1))}>
                <ArrowForwardIcon fontSize="large" />
            </TooltipIconButton>
            <TooltipIconButton icon={{className: "ActionButton"}}
                               color={"primary"}
                               size={smallScreen ? "lg" : "xl"}
                               hoverText={t("ActionsPalette.ResetPC.Tooltip")}
                               ariaLabel={t("ActionsPalette.ResetPC.AriaLabel")}
                               onClick={() => dispatch(setPC(0))}>
                <RotateLeft fontSize="large" />
            </TooltipIconButton>
            <MediaQuery
                query="(max-width: 800px)"
                styles={{ display: "none" }}
            >
                <Divider orientation="vertical" />
            </MediaQuery>
            <SpeedSelector buttonClass={"ActionButton"} buttonSize={smallScreen ? "lg" : "xl"}/>
            <Divider orientation="vertical" className={"Divider"}/>
            <SaveProgram buttonSize={smallScreen ? "lg" : "xl"}/>
        </div>
    );
}

export default ActionsPalette;