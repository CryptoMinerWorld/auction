import styled from "styled-components";
import React from "react";

const StyledButton = styled.div`

    background-color: ${props => props.outlineColor};
    clip-path: ${props => {
            const lowerVerticals = (props.edgeSizes[1] || props.edgeSizes) + "%";
            const lowerHorizontals = (props.edgeSizes[0] || props.edgeSizes) + "%";
            const higherVerticals = 100 - (props.edgeSizes[1] || props.edgeSizes) + "%";
            const higherHorizontals = 100 - (props.edgeSizes[0] || props.edgeSizes) + "%";
            return 'polygon(' + lowerHorizontals + ' 0, ' + higherHorizontals + ' 0, 100% ' +
            lowerVerticals + ', 100% ' + higherVerticals + ', ' + higherHorizontals + ' 100%, ' +
            lowerHorizontals + ' 100%, 0% ' + higherVerticals + ', 0 ' + lowerVerticals + ')';
    }};
    -webkit-clip-path: ${props => {
            const lowerVerticals = (props.edgeSizes[1] || props.edgeSizes) + "%";
            const lowerHorizontals = (props.edgeSizes[0] || props.edgeSizes) + "%";
            const higherVerticals = 100 - (props.edgeSizes[1] || props.edgeSizes) + "%";
            const higherHorizontals = 100 - (props.edgeSizes[0] || props.edgeSizes) + "%";
            return 'polygon(' + lowerHorizontals + ' 0, ' + higherHorizontals + ' 0, 100% ' +
            lowerVerticals + ', 100% ' + higherVerticals + ', ' + higherHorizontals + ' 100%, ' +
            lowerHorizontals + ' 100%, 0% ' + higherVerticals + ', 0 ' + lowerVerticals + ')';
    }};
    cursor: pointer;
    position: relative;
    height: ${props => props.height || "40"}px;
    width: 100%;
    ${props => props.otherStyles || ""}
    
    &:after {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        content: "${props => props.content || ""}";
        background-color: ${props => props.backgroundColor};
        top: ${props => props.outlineWidth}px;
        left: ${props => props.outlineWidth}px;
        right: ${props => props.outlineWidth}px;
        bottom: ${props => props.outlineWidth}px;
        color: ${props => props.fontColor || props.outlineColor || "white"}
        clip-path: ${props => {
            const lowerVerticals = (props.edgeSizes[1] || props.edgeSizes) + "%";
            const lowerHorizontals = (props.edgeSizes[0] || props.edgeSizes) + "%";
            const higherVerticals = 100 - (props.edgeSizes[1] || props.edgeSizes) + "%";
            const higherHorizontals = 100 - (props.edgeSizes[0] || props.edgeSizes) + "%";
            return 'polygon(' + lowerHorizontals + ' 0, ' + higherHorizontals + ' 0, 100% ' +
            lowerVerticals + ', 100% ' + higherVerticals + ', ' + higherHorizontals + ' 100%, ' +
            lowerHorizontals + ' 100%, 0% ' + higherVerticals + ', 0 ' + lowerVerticals + ')';
        }};
        -webkit-clip-path: ${props => {
            const lowerVerticals = (props.edgeSizes[1] || props.edgeSizes) + "%";
            const lowerHorizontals = (props.edgeSizes[0] || props.edgeSizes) + "%";
            const higherVerticals = 100 - (props.edgeSizes[1] || props.edgeSizes) + "%";
            const higherHorizontals = 100 - (props.edgeSizes[0] || props.edgeSizes) + "%";
            return 'polygon(' + lowerHorizontals + ' 0, ' + higherHorizontals + ' 0, 100% ' +
            lowerVerticals + ', 100% ' + higherVerticals + ', ' + higherHorizontals + ' 100%, ' +
            lowerHorizontals + ' 100%, 0% ' + higherVerticals + ', 0 ' + lowerVerticals + ')';
        }};
        font-size: ${props => props.fontSize || "14"}px;
    }
`;

export const CutEdgesButton = ({outlineColor, backgroundColor, fontColor, edgeSizes, outlineWidth, content, fontSize, height, style, ...props}) => {
    return (
      <StyledButton outlineColor={outlineColor}
                    fontColor={fontColor}
                    backgroundColor={backgroundColor}
                    edgeSizes={edgeSizes}
                    outlineWidth={outlineWidth}
                    content={content}
                    fontSize={fontSize}
                    height={height}
                    otherStyles={style}
                    {...props}
      />
    )
}