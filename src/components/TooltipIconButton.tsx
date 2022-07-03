import React, {ReactNode} from 'react';
import {Tooltip, ActionIcon, useMantineTheme} from '@mantine/core';
import {MantineColor} from "@mantine/styles";

import './TooltipButton.scss';

type Props = {
    children: ReactNode;
    hoverText: string;
    className: string;
    ariaLabel: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    position?: 'top' | 'bottom' | 'left' | 'right';
    color?: MantineColor | undefined;
    shade?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | undefined;
    onClick?: (() => void) | ((e: React.MouseEvent) => void);
}

function TooltipIconButton(props: Props) {
    const theme = useMantineTheme();
    const color = (props.color === undefined || props.color === "primary")
        ? theme.primaryColor : props.color;

    return (
        <Tooltip
            label={props.hoverText}
            position={props.position}
            withArrow
        >
            <ActionIcon style={{color: theme.colors[color][props.shade || (theme.primaryShade as number)]}}
                        size={props.size || "xl"} className={props.className}
                        onClick={props.onClick} aria-label={props.ariaLabel}>
                {props.children}
            </ActionIcon>
        </Tooltip>
    );
}

export default TooltipIconButton;
