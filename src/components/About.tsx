import React, {useState} from "react";
import {Modal, Text} from "@mantine/core";
import {useTranslation, Trans} from 'react-i18next';
import InfoIcon from '@mui/icons-material/Info';

import TooltipIconButton from "./TooltipIconButton";
import './About.scss';


type Props = {
    buttonSize?: "sm" | "md" | "lg" | "xl";
}

function About(props: Props) {
    const [aboutOpened, setAboutOpened] = useState(false);
    const {t} = useTranslation();

    return (
        <>
            <Modal
                opened={aboutOpened}
                onClose={() => setAboutOpened(false)}
                title={t("About.Title")}
                styles={{
                    title: {
                        fontSize: '1.5rem',
                    }
                }}
            >
                <Text size={"lg"}>
                    <Trans i18nKey={"About.KnowHowComputerDescription"}>
                        The <a href={"https://en.wikipedia.org/wiki/WDR_paper_computer"}>Know-How Computer</a> (also
                        known as the WDR paper computer) is a teaching tool roughly based
                        on <a href={"https://en.wikipedia.org/wiki/Register_machine"}>register machines</a>. This web
                        application can be used to emulate the Know-How Computer by writing a program in the Commands
                        field and executing it by using the controls at the bottom of the screen. Commands can be
                        entered using the keyboard or by clicking on the corresponding buttons at the top of the screen.
                        The program can be saved to a file or to the browser to restore the current state at a later
                        time.
                    </Trans>
                </Text>

                <Text size={"md"} className={"License"}>
                    <Trans i18nKey={"About.License"}>
                        © 2022 Timon Scholz. The <a href={"https://github.com/TrueKuehli/React-Know-How-Computer"}>
                        source code</a> is available on GitHub under MIT license.
                    </Trans>
                </Text>
            </Modal>

            <TooltipIconButton className={"AboutButton"}
                               color={"primary"}
                               size={props.buttonSize}
                               hoverText={t("About.Button.HoverText")}
                               ariaLabel={t("About.Button.AriaLabel")}
                               onClick={() => setAboutOpened(true)}>
                <InfoIcon fontSize="large"/>
            </TooltipIconButton>
        </>
    );
}

export default About;