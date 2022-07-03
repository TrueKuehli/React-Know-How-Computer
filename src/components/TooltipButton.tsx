import React from 'react';
import { Tooltip, Button } from '@mantine/core';

import './TooltipButton.scss';

type Props = {
    command: string;
    hover_text: string;
    onClick?: () => void;
}

function TooltipButton(props: Props) {
    return (
        <Tooltip
            label={props.hover_text}
            position="bottom"
            withArrow
        >
            <Button color="primary" className="CommandButton" size="xl" compact onClick={props.onClick}>
                {props.command}
            </Button>
        </Tooltip>
    );
}

export default TooltipButton;
