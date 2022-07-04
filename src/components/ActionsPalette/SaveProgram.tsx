import React, {useCallback, useState, memo} from "react";
import {useTranslation} from "react-i18next";
import {Button, Group, Modal, Switch, TextInput, useMantineTheme} from "@mantine/core";
import {useLocalStorage} from "@mantine/hooks";
import {showNotification} from "@mantine/notifications";
import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";
import ErrorIcon from "@mui/icons-material/Error";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import SaveIcon from "@mui/icons-material/Save";

import {useAppDispatch, useAppSelector} from "../../state/stateHooks";
import {setCommands, setRegisters, setPC} from "../../state/computerSlice";
import {deserializeProgram, serializeProgram} from "../../util/ProgramSerialization";

import TooltipIconButton from "../generic/TooltipIconButton";
import ProgramUpload from "./ProgramUpload";
import "./SaveProgram.scss";


type Props = {
    buttonSize?: "sm" | "md" | "lg" | "xl";
}

type ProgramProps = {
    key: string;
    index: number;
    name: string;
    code: string;
    removeProgram: (index: number) => void;
    selectProgram: (code: string) => void;
}


const ProgramButton = memo((props: ProgramProps) => {
    const theme = useMantineTheme();
    const {t} = useTranslation();

    return (
        <div className={"ProgramLoadButton"} style={{["--background-color" as any]: theme.colors[theme.primaryColor][0],
                                                     ["--background-color-hover" as any]: theme.colors[theme.primaryColor][2]}}
             onClick={() => props.selectProgram(props.code)}
        >
            {props.name}
            <TooltipIconButton icon={{className: "RemoveButton"}}
                               color={"pink"}
                               size={"lg"}
                               hoverText={t("LoadProgram.DeleteButton.Tooltip")}
                               ariaLabel={t("LoadProgram.DeleteButton.AriaLabel")}
                               position={"top"}
                               onClick={() => props.removeProgram(props.index)}
            >
                <ClearIcon fontSize={"medium"}/>
            </TooltipIconButton>
        </div>
    );
});


function SaveProgram(props: Props) {
    const dispatch = useAppDispatch();
    const commands = useAppSelector(state => state.computer.commands);
    const registers = useAppSelector(state => state.computer.registers);

    const [saveOpened, setSaveOpened] = useState(false);
    const [loadOpened, setLoadOpened] = useState(false);
    const [storeRegisters, setStoreRegisters] = useState(true);
    const [name, setName] = useState("");

    const [programs, savePrograms] = useLocalStorage<{name: string, code: string}[]>(
        {key: "storedPrograms", defaultValue: []});

    const {t} = useTranslation();

    const removeProgram = useCallback((index: number) => {
        savePrograms((prevState) => [
            ...prevState.slice(0, index),
            ...prevState.slice(index + 1)
        ])
    }, [savePrograms]);

    const selectProgram = useCallback((code: string) => {
        const result = deserializeProgram(code);
        if (typeof(result) === "string") {
            return showNotification({
                title: t("LoadProgram.ErrorNotification.Title"),
                message: t("LoadProgram.ErrorNotification.Message", {message: result}),
                autoClose: 5000,
                color: "red",
                icon: <ErrorIcon/>,
            });
        }
        const [commands, registers] = result;

        dispatch(setCommands(commands));
        dispatch(setRegisters(registers));
        dispatch(setPC(0));

        setLoadOpened(false);

        return showNotification({
            title: t("LoadProgram.SuccessNotification.Title"),
            message: t("LoadProgram.SuccessNotification.Message"),
            autoClose: 2000,
            color: "green",
            icon: <DoneIcon/>,
        });
    }, [dispatch, t]);


    return (
        <>
            <Modal
                opened={saveOpened}
                onClose={() => setSaveOpened(false)}
                title={t("SaveProgram.Title")}
                styles={{
                    title: {
                        fontSize: "1.5rem",
                    }
                }}
            >
                <div className={"SaveDialog"}>
                    <TextInput
                        placeholder={t("SaveProgram.NameInput.Placeholder")}
                        label={t("SaveProgram.NameInput.Label")}
                        value={name}
                        onChange={(e) => setName(e.currentTarget.value)}
                    />

                    <Switch
                        checked={storeRegisters}
                        onChange={(event) => setStoreRegisters(event.currentTarget.checked)}
                        label={t("SaveProgram.SaveRegisterValuesSwitch.Label")}
                    />
                    <Group position="center" grow>
                        <Button onClick={() => {
                            savePrograms((prevState) => [
                                ...prevState,
                                serializeProgram(commands, registers, name, storeRegisters)
                            ]);
                            setSaveOpened(false);

                            return showNotification({
                                title: t("SaveProgram.SuccessNotification.Title"),
                                message: t("SaveProgram.SuccessNotification.Message"),
                                autoClose: 2000,
                                color: "green",
                                icon: <DoneIcon/>,
                            });
                        }}>
                            {t("SaveProgram.SaveButtonLabel")}
                        </Button>
                        <Button onClick={() => {
                            const program = serializeProgram(commands, registers, name, storeRegisters);
                            const blob = new Blob([program.code], {type: "application/json;charset=utf-8"});

                            const link = document.createElement("a");
                            link.href = URL.createObjectURL(blob);
                            link.download = (program.name || t("SaveProgram.DefaultName")) + ".json";
                            link.click();

                            setSaveOpened(false);
                        }}>
                            {t("SaveProgram.ExportButtonLabel")}
                        </Button>
                    </Group>
                </div>
            </Modal>

            <Modal
                opened={loadOpened}
                onClose={() => setLoadOpened(false)}
                title={t("LoadProgram.Title")}
                styles={{
                    title: {
                        fontSize: "1.5rem",
                    }
                }}
            >
                <ProgramUpload loadFile={selectProgram}/>
                {programs.map((program, index) => (
                    <ProgramButton key={index.toString()} index={index} name={program.name || "<no name>"}
                                   code={program.code} removeProgram={removeProgram} selectProgram={selectProgram}/>
                ))}
            </Modal>

            <TooltipIconButton icon={{className: "ActionButton"}}
                               color={"primary"}
                               size={props.buttonSize}
                               hoverText={t("SaveProgram.Button.Tooltip")}
                               ariaLabel={t("SaveProgram.Button.AriaLabel")}
                               onClick={() => setSaveOpened(true)}
            >
                <SaveIcon fontSize="large" />
            </TooltipIconButton>
            <TooltipIconButton icon={{className: "ActionButton"}}
                               color={"primary"}
                               size={props.buttonSize}
                               hoverText={t("LoadProgram.Button.Tooltip")}
                               ariaLabel={t("LoadProgram.Button.AriaLabel")}
                               onClick={() => setLoadOpened(true)}
            >
                <FileOpenIcon fontSize="large" />
            </TooltipIconButton>
        </>
    )
}

export default SaveProgram;