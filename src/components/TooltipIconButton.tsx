import React, {ReactNode} from 'react';
import {Tooltip, ActionIcon, DefaultMantineColor} from '@mantine/core';

import './TooltipButton.scss';

type Props = {
    children: ReactNode;
    hoverText: string;
    className: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    position?: 'top' | 'bottom' | 'left' | 'right';
    color?: DefaultMantineColor | undefined;
    onClick?: (() => void) | ((e: React.MouseEvent) => void);
}

function TooltipIconButton(props: Props) {
    return (
        <Tooltip
            label={props.hoverText}
            position={props.position}
            withArrow
        >
            <ActionIcon color={props.color} size={props.size || "xl"} className={props.className} onClick={props.onClick}>
                {props.children}
            </ActionIcon>
        </Tooltip>
    );
}

export default TooltipIconButton;
