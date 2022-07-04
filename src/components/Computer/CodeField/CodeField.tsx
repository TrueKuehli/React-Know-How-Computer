import React from "react";
import {ActionIcon, Text} from "@mantine/core";
import {ReactSortable} from "react-sortablejs";
import {useTranslation} from "react-i18next";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import {useAppDispatch, useAppSelector} from "../../../state/stateHooks";
import {addCommand, setCommands} from "../../../state/computerSlice";

import {digits10} from "../../../util/Math";
import Command, {COMMAND_ARGUMENT_COMMANDS} from "./Command";
import "./CodeField.scss";


function CodeField() {
    const dispatch = useAppDispatch();
    const pc = useAppSelector((state) => state.computer.pc);
    const commands = useAppSelector((state) => state.computer.commands);
    const registers = useAppSelector((state) => state.computer.registers);
    const selectedCommand = useAppSelector((state) => state.computerUI.selectedCommand);

    const {t} = useTranslation();


    return (
        <div className="CodeField">
            <Text size="xl" className="CommandsHeader" color="white" weight="bold">
                {t("CommandBox.Title")}
            </Text>
            {/* @ts-ignore */}
            <ReactSortable handle={".DragHandle"}
                           list={commands}
                           setList={(commands) => dispatch(setCommands(commands))}>
                {
                    commands.map((command, index) => {
                        return (
                            <Command key={command.id.toString()}
                                     line={index}
                                     lineDigits={digits10(commands.length)}
                                     maxVal={COMMAND_ARGUMENT_COMMANDS.includes(command.type) ?
                                         commands.length :
                                         registers.length}
                                     valDigits={digits10(Math.max(commands.length, registers.length))}
                                     command={command}
                                     selected={selectedCommand === command.id}
                                     current={pc === index}/>
                        );
                    })
                }
            </ReactSortable>
            <div className="ItemAdd" onClick={() => dispatch(addCommand())}>
                <ActionIcon size={"xl"} className={"CommandAddIcon"} variant={"transparent"}
                            aria-label={t("CommandBox.AddCommand.AriaLabel")}>
                    <AddCircleIcon fontSize="large" />
                </ActionIcon>
            </div>
        </div>
    );
}

export default CodeField;