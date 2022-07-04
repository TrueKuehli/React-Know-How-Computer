import React from "react";
import {useTranslation} from "react-i18next";
import {ActionIcon, Text} from "@mantine/core";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import "./RegisterField.scss";
import {useAppDispatch, useAppSelector} from "../../../state/stateHooks";
import {addRegister} from "../../../state/computerSlice";

import {digits10} from "../../../util/Math";
import Register from "./Register";


function RegisterField() {
    const dispatch = useAppDispatch();
    const registers = useAppSelector((state) => state.computer.registers);

    const {t} = useTranslation();

    return (
        <div className="RegisterField">
            <Text size="xl" className="RegistersHeader" color="white" weight="bold">
                {t("RegisterBox.Title")}
            </Text>
            {
                registers.map((register, index) => {
                    return (
                        <Register key={index.toString()}
                                  index={index}
                                  indexDigits={digits10(registers.length)}
                                  maxDigits={digits10(Math.max(...registers))}
                                  value={register}/>
                    );
                })
            }
            <div className="ItemAdd" onClick={() => dispatch(addRegister())}>
                <ActionIcon size={"xl"} className={"CommandAddIcon"} variant={"transparent"}
                            aria-label={t("RegisterBox.AddRegister.AriaLabel")}>
                    <AddCircleIcon fontSize="large" />
                </ActionIcon>
            </div>
        </div>
    );
}

export default RegisterField;