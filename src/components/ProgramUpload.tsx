import React from "react";
import {useMantineTheme, Text} from "@mantine/core";
import {FullScreenDropzone, DropzoneStatus} from '@mantine/dropzone';
import UploadIcon from "@mui/icons-material/Upload";
import CancelIcon from '@mui/icons-material/Cancel';

import "./ProgramUpload.scss";
import {SvgIconProps} from "@mui/material/SvgIcon/SvgIcon";

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
                    {status.accepted ? "Drop program here to load..." : "Only .json files are accepted."}
                </Text>
            </div>
        </div>
    );
}

function ProgramUpload(props: Props) {
    const theme = useMantineTheme();

    return (
        <>
            <FullScreenDropzone className="ProgramDropzone" accept={["application/json"]}
                                onDrop={(files) => {console.log(files)}}>
                {(status) => dropzoneChildren(status)}
            </FullScreenDropzone>
            <div className={"ProgramLoadButton Upload"}
                 style={{["--background-color" as any]: theme.colors[theme.primaryColor][0],
                         ["--background-color-hover" as any]: theme.colors[theme.primaryColor][2]}}
                 aria-label={"Upload program"}
                 tabIndex={0} // Making the div focusable so programs may be uploaded using only the keyboard
                 role={"button"}
                 onClick={() => {
                     let input = document.createElement("input");
                     input.type = "file";
                     input.accept = "application/json";

                     input.addEventListener<"change">("change", (event) => {
                         let files = (event.target as HTMLInputElement).files;
                         if (files) {
                             if (files[0].type !== "application/json") {
                                 return alert("Only .json files are accepted.");
                             }

                             let reader = new FileReader();
                             reader.onload = (event) => {
                                 props.loadFile(event.target?.result as string)
                             }

                             reader.readAsText(files[0]);
                         }
                    });
                    input.click();
                 }}
            >
                <UploadIcon fontSize={"medium"}/>
                <div className={"UploadFileText"}>
                    Upload file...
                </div>
            </div>
        </>
    );
}

export default ProgramUpload;
