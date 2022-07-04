import i18next from "i18next";
import React, {useCallback} from "react";
import {useTranslation} from "react-i18next";
import {useMantineTheme, Text} from "@mantine/core";
import {FullScreenDropzone, DropzoneStatus} from '@mantine/dropzone';
import {showNotification} from '@mantine/notifications';
import {SvgIconProps} from "@mui/material/SvgIcon/SvgIcon";
import UploadIcon from "@mui/icons-material/Upload";
import CancelIcon from '@mui/icons-material/Cancel';
import ErrorIcon from '@mui/icons-material/Error';

import "./ProgramUpload.scss";

type UploadIconProps = SvgIconProps & {
    status: DropzoneStatus;
}

type Props = {
    loadFile: (file: string) => void;
}

function ImageUploadIcon(props: UploadIconProps) {
    const {status, ...iconProps} = props;

    if (props.status.accepted) {
        return <UploadIcon {...iconProps} color={"success"}/>;
    }

    if (props.status.rejected) {
        return <CancelIcon {...iconProps} color={"error"}/>;
    }

    return <></>;
}

function dropzoneChildren(status: DropzoneStatus) {
    if (!status.accepted && !status.rejected) {
        return <></>;
    }

    return (
        <div className={"DropzoneContent"}>
            <ImageUploadIcon status={status} fontSize={"inherit"} className={"DropzoneIcon"} />

            <div>
                <Text size="xl" className={"DropzoneText"}>
                    {status.accepted ? i18next.t("ProgramUpload.Dropzone.TitleAccept")
                                     : i18next.t("ProgramUpload.Dropzone.TitleReject")}
                </Text>
            </div>
        </div>
    );
}

function ProgramUpload(props: Props) {
    const theme = useMantineTheme();
    const {t} = useTranslation();

    const handleFiles = useCallback((files: File[] | FileList | null) => {
        if (files) {
            if (files[0].type !== "application/json") {
                return showNotification({
                    title: t("ProgramUpload.Notification.Error.Title"),
                    message: t("ProgramUpload.Notification.Error.Message"),
                    autoClose: 5000,
                    color: "red",
                    icon: <ErrorIcon/>,
                });
            }

            let reader = new FileReader();
            reader.onload = (event) => {
                props.loadFile(event.target?.result as string)
            }

            reader.readAsText(files[0]);
        }
    }, [props, t]);

    return (
        <>
            <FullScreenDropzone className="ProgramDropzone" accept={["application/json"]}
                                onDrop={handleFiles}>
                {(status) => dropzoneChildren(status)}
            </FullScreenDropzone>
            <div className={"ProgramLoadButton Upload"}
                 style={{["--background-color" as any]: theme.colors[theme.primaryColor][0],
                         ["--background-color-hover" as any]: theme.colors[theme.primaryColor][2]}}
                 aria-label={t("ProgramUpload.UploadButton.AriaLabel")}
                 tabIndex={0} // Making the div focusable so programs may be uploaded using only the keyboard
                 role={"button"}
                 onClick={() => {
                     let input = document.createElement("input");
                     input.type = "file";
                     input.accept = "application/json";

                     input.addEventListener<"change">("change", (event) => {
                         let files = (event.target as HTMLInputElement).files;
                         handleFiles(files);
                    });
                    input.click();
                 }}
            >
                <UploadIcon fontSize={"medium"}/>
                <div className={"UploadFileText"}>
                    {t("ProgramUpload.UploadButton.Label")}
                </div>
            </div>
        </>
    );
}

export default ProgramUpload;
