import React from "react";
import {MantineProvider} from "@mantine/core";
import {useMediaQuery} from "@mantine/hooks";
import {useTranslation} from "react-i18next";

import {useAppDispatch, useAppSelector} from "../../state/stateHooks";
import {setCommandType} from "../../state/computerSlice";
import {CommandType} from "../Computer/CodeField/Command";

import TooltipButton from "../generic/TooltipButton";
import LanguageSelector from "./LanguageSelector";
import About from "./About";

import "./CommandPalette.scss";


function CommandPalette() {
    const dispatch = useAppDispatch();
    const selectedCommand = useAppSelector((state) => state.computerUI.selectedCommand);
    const {t} = useTranslation();

    const smallScreen = useMediaQuery("(max-width: 500px)");


    return (
        <div className="CommandPalette">
            <MantineProvider
                theme={{
                    colorScheme: "light",
                    primaryColor: "indigo",
                    primaryShade: 9,
                }}
            >
                <div className={"Gap"}/> {/* For center aligning */}
                <TooltipButton command={"NOP"} hover_text={t("Commands.NOP.Tooltip")}
                               ariaLabel={t("Commands.NOP.AriaLabel")}
                               size={smallScreen ? "lg" : "xl"}
                               onClick={() => dispatch(setCommandType(
                                   {"id": selectedCommand, "commandType": CommandType.NOP}))}/>
                <TooltipButton command={"+"} hover_text={t("Commands.+.Tooltip")}
                               ariaLabel={t("Commands.+.AriaLabel")}
                               size={smallScreen ? "lg" : "xl"}
                               onClick={() => dispatch(setCommandType(
                                   {"id": selectedCommand, "commandType": CommandType.INCREMENT}))}/>
                <TooltipButton command={"-"} hover_text={t("Commands.-.Tooltip")}
                               ariaLabel={t("Commands.-.AriaLabel")}
                               size={smallScreen ? "lg" : "xl"}
                               onClick={() => dispatch(setCommandType(
                                   {"id": selectedCommand, "commandType": CommandType.DECREMENT}))}/>
                <TooltipButton command={"j"} hover_text={t("Commands.j.Tooltip")}
                               ariaLabel={t("Commands.j.AriaLabel")}
                               size={smallScreen ? "lg" : "xl"}
                               onClick={() => dispatch(setCommandType(
                                   {"id": selectedCommand, "commandType": CommandType.JUMP}))}/>
                <TooltipButton command={"0"} hover_text={t("Commands.0.Tooltip")}
                               ariaLabel={t("Commands.0.AriaLabel")}
                               size={smallScreen ? "lg" : "xl"}
                               onClick={() => dispatch(setCommandType(
                                   {"id": selectedCommand, "commandType": CommandType.IF_ZERO}))}/>
                <TooltipButton command={"Stop"} hover_text={t("Commands.Stop.Tooltip")}
                               ariaLabel={t("Commands.Stop.AriaLabel")}
                               size={smallScreen ? "lg" : "xl"}
                               onClick={() => dispatch(setCommandType(
                                   {"id": selectedCommand, "commandType": CommandType.STOP}))}/>
            </MantineProvider>
            <LanguageSelector buttonSize={smallScreen ? "lg" : "xl"}/>
            <About buttonSize={smallScreen ? "lg" : "xl"}/>
        </div>
    );
}

export default CommandPalette;