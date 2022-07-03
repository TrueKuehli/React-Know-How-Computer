import React, {useCallback, useState, memo} from 'react';
import {Button, Group, Modal, Switch, TextInput, useMantineTheme} from "@mantine/core";
import {useLocalStorage} from "@mantine/hooks";
import ClearIcon from "@mui/icons-material/Clear";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import SaveIcon from "@mui/icons-material/Save";

import TooltipIconButton from "./TooltipIconButton";
import ProgramUpload from "./ProgramUpload";
import {CommandStruct} from "./Command";
import "./SaveProgram.scss";
import {showNotification} from "@mantine/notifications";
import ErrorIcon from "@mui/icons-material/Error";
import DoneIcon from '@mui/icons-material/Done';

type Props = {
    buttonSize?: 'sm' | 'md' | 'lg' | 'xl';

    // Bound function already containing: // commands: CommandStruct[], registers: number[]
    serializationFunction: (name: string, saveRegisters: boolean) => {name: string, code: string};

    deserializationFunction: (fileContent: string) => ([CommandStruct[], number[]] | string);
    setCommands: (commands: CommandStruct[]) => void;
    setRegisters: (registers: number[]) => void;
    setPC: (pc: number) => void;
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

    return (
        <div className={"ProgramLoadButton"} style={{["--background-color" as any]: theme.colors[theme.primaryColor][0],
                                                     ["--background-color-hover" as any]: theme.colors[theme.primaryColor][2]}}
             onClick={() => props.selectProgram(props.code)}
        >
            {props.name}
            <TooltipIconButton iconClassName={"RemoveButton"}
                               color={"pink"}
                               size={"lg"}
                               hoverText={"Delete saved program"}
                               ariaLabel={"Delete saved program"}
                               position={"top"}
                               onClick={() => props.removeProgram(props.index)}>
                <ClearIcon fontSize={"medium"}/>
            </TooltipIconButton>
        </div>
    );
});


function SaveProgram(props: Props) {
    const [saveOpened, setSaveOpened] = useState(false);
    const [loadOpened, setLoadOpened] = useState(false);
    const [storeRegisters, setStoreRegisters] = useState(true);
    const [name, setName] = useState("");

    const [programs, savePrograms] = useLocalStorage<{name: string, code: string}[]>(
        {key: "storedPrograms", defaultValue: []});

    const removeProgram = useCallback((index: number) => {
        savePrograms((prevState) => [
            ...prevState.slice(0, index),
            ...prevState.slice(index + 1)
        ])
    }, [savePrograms]);

    const selectProgram = useCallback((code: string) => {
        const result = props.deserializationFunction(code);
        if (typeof(result) === "string") {
            return showNotification({
                title: "Invalid file",
                message: `File content does not appear to be a valid Know-How Computer program:\n${result}`,
                autoClose: 5000,
                color: "red",
                icon: <ErrorIcon/>,
            });
        }
        const [commands, registers] = result;

        props.setCommands(commands);
        props.setRegisters(registers);
        props.setPC(0);

        setLoadOpened(false);

        return showNotification({
            title: "Loading Successful",
            message: "Successfully loaded program",
            autoClose: 2000,
            color: "green",
            icon: <DoneIcon/>,
        });
    }, [props, setLoadOpened]);

    return (
        <>
            <Modal
                opened={saveOpened}
                onClose={() => setSaveOpened(false)}
                title="Save Current Program"
                styles={{
                    title: {
                        fontSize: '1.5rem',
                    }
                }}
            >
                <div className={"SaveDialog"}>
                    <TextInput
                        placeholder="example"
                        label="Program Name"
                        value={name}
                        onChange={(e) => setName(e.currentTarget.value)}
                    />
                    <Switch
                        checked={storeRegisters}
                        onChange={(event) => setStoreRegisters(event.currentTarget.checked)}
                        label="Save Register Values"
                    />
                    <Group position="center" grow>
                        <Button onClick={() => {
                            savePrograms((prevState) => [
                                ...prevState,
                                props.serializationFunction(name, storeRegisters)
                            ]);
                            setSaveOpened(false);

                            return showNotification({
                                title: "Save Successful",
                                message: "Successfully saved program to browser",
                                autoClose: 2000,
                                color: "green",
                                icon: <DoneIcon/>,
                            });
                        }}>
                            Save to Browser
                        </Button>
                        <Button onClick={() => {
                            const program = props.serializationFunction(name, storeRegisters);
                            const blob = new Blob([program.code], {type: "application/json;charset=utf-8"});

                            const link = document.createElement("a");
                            link.href = URL.createObjectURL(blob);
                            link.download = (program.name || "khc-program") + ".json";
                            link.click();

                            setSaveOpened(false);
                        }}>Export to File</Button>
                    </Group>
                </div>
            </Modal>

            <Modal
                opened={loadOpened}
                onClose={() => setLoadOpened(false)}
                title="Load Program"
                styles={{
                    title: {
                        fontSize: '1.5rem',
                    }
                }}
            >
                <ProgramUpload loadFile={selectProgram}/>
                {programs.map((program, index) => (
                    <ProgramButton key={index.toString()} index={index} name={program.name || "<no name>"}
                                   code={program.code} removeProgram={removeProgram} selectProgram={selectProgram}/>
                ))}
            </Modal>

            <TooltipIconButton iconClassName={"ActionButton"}
                               color={"primary"}
                               size={props.buttonSize}
                               hoverText={"Save current program"}
                               ariaLabel={"Save current program"}
                               onClick={() => setSaveOpened(true)}>
                <SaveIcon fontSize="large" />
            </TooltipIconButton>
            <TooltipIconButton iconClassName={"ActionButton"}
                               color={"primary"}
                               size={props.buttonSize}
                               hoverText={"Load program"}
                               ariaLabel={"Load program"}
                               onClick={() => setLoadOpened(true)}>
                <FileOpenIcon fontSize="large" />
            </TooltipIconButton>
        </>
    )
}

export default SaveProgram;