import React from 'react';

interface RangeSliderProps {
    isRange?: boolean;
    min?: number;
    max?: number;
    value?: number | [number, number];
    updateSlider: (val1: number | [number, number]) => void;
}

const NumInput: React.FC<RangeSliderProps> = ({ min, max, value, isRange, updateSlider }) => {

    const inputStyle: React.CSSProperties = {
        marginTop: '100px',
        width: '40px',
        padding: '5px',
        borderRadius: '5px',
    };

    if (isRange) {
        if (Array.isArray(value)) {
            return (
                <>
                    <input
                        type="number"
                        value={Math.ceil(value[0])}
                        style={inputStyle}
                        min={min}
                        max={max}
                        onChange={(e) => updateSlider([+e.target.value, value[1]])}
                    />
                    <input
                        type="number"
                        value={Math.ceil(value[1])}
                        style={inputStyle}
                        min={min}
                        max={max}
                        onChange={(e) => updateSlider([value[0], +e.target.value])}
                    />
                </>
            );
        }
    } else {
        if (typeof value === 'number') {
            return (
                <input
                    type="number"
                    value={Math.ceil(value)}
                    style={inputStyle}
                    onChange={(e) => updateSlider(+e.target.value)}
                />
            );
        }
    }
};

export default NumInput;