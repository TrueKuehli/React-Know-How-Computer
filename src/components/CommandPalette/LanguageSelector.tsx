import React from "react";
import {useTranslation} from "react-i18next";
import {ActionIcon, Menu, useMantineTheme} from "@mantine/core";
import LanguageIcon from "@mui/icons-material/Language";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

import languages from "../../i18n/languages";
import "./LanguageSelector.scss";
import i18next from "i18next";

type Props = {
    buttonSize?: "sm" | "md" | "lg" | "xl";
}

function LanguageSelector(props: Props) {
    const theme = useMantineTheme();
    const color = theme.primaryColor;
    const {t} = useTranslation();

    return (
        <Menu className="LanguageMenu" menuButtonLabel={t("LanguageSelector.AriaLabel")} control={
            <ActionIcon className={"LanguageButton"}
                        size={props.buttonSize}
            >
                <LanguageIcon fontSize="large" style={{color: theme.colors[color][theme.primaryShade as number]}}/>
            </ActionIcon>}
        >
            {languages.map(language => (
                <Menu.Item key={language.code}
                           icon={i18next.resolvedLanguage === language.code ? <RadioButtonCheckedIcon/> : <RadioButtonUncheckedIcon/>}
                           onClick={() => {i18next.changeLanguage(language.code)}}>
                    {language.name}
                </Menu.Item>
            ))}
        </Menu>
    );
}

export default LanguageSelector;