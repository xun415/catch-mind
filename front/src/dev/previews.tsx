import React from 'react';
import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox';
import {PaletteTree} from './palette';
import GameBar from "@components/ui/GameBar";
import IndexForm from "@components/ui/IndexForm";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/GameBar">
                <GameBar/>
            </ComponentPreview>
            <ComponentPreview path="/IndexForm">
            </ComponentPreview>
        </Previews>
    );
};

export default ComponentPreviews;