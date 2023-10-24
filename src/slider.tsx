import React, { useState, useRef } from 'react';
import NumInput from './numInput.tsx';

interface RangeSliderProps {
  isRange?: boolean;
  min?: number;
  max?: number;
  showInput?:boolean;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  isRange = false,
  min = 0,
  max = 100,
  showInput = false
}) => {
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const sliderTrackRef = useRef<HTMLDivElement>(null);
  const sliderThumbRef = useRef<HTMLDivElement>(null);
  const sliderThumbRef2 = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<string>('');

  const [value, setValue] = useState<number | [number, number]>(
     isRange ? [min, max] : min
  );

  const getPercentage = (val: number, range: number = max - min) => {
    return (val / range) * 100;
  };

  const updateSlider = (val: number | [number, number]) => {
    if (isRange) {
      if (Array.isArray(val)) {
        setValue(val);
        if (
          sliderTrackRef.current &&
          sliderThumbRef.current &&
          sliderThumbRef2.current
        ) {
          const range = max - min;
          const trackWidth = getPercentage(val[1] - val[0], range);
          const thumbLeft1 = getPercentage(val[0] - min, range);
          const thumbLeft2 = getPercentage(val[1] - min, range);

          sliderTrackRef.current.style.width = trackWidth + '%';
          sliderTrackRef.current.style.left = thumbLeft1 + '%';
          sliderThumbRef.current.style.left = `calc(${thumbLeft1}% - 6px)`;
          sliderThumbRef2.current.style.left = `calc(${thumbLeft2}% - 6px)`;
        }
      }
    } else {
      if (typeof val === 'number') {
        setValue(val);
        if (sliderTrackRef.current && sliderThumbRef.current) {
          const range = max - min;
          const trackWidth = getPercentage(val - min, range);
          sliderTrackRef.current.style.width = trackWidth + '%';
          sliderThumbRef.current.style.left = `calc(${trackWidth}% - 6px)`;
        }
      }
    }
  };

  const onMouseDown = (e: React.MouseEvent, thumb: 'first' | 'second' = 'first') => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    if (thumb === 'first') {
      isDragging.current = 'first';
    } else if (thumb === 'second') {
      isDragging.current = 'second';
    }
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !sliderContainerRef.current) return;

    const containerRect = sliderContainerRef.current.getBoundingClientRect();
    const offsetX = e.clientX - containerRect.left;
    const percentage = (offsetX / containerRect.width) * 100;

    if (isRange) {
      if (sliderThumbRef.current && sliderThumbRef2.current) {
        if (percentage >= 0 && percentage <= 100) {
          if (isDragging.current === 'first') {
            const minVal = (percentage / 100) * (max - min) + min;
            const maxVal = value[1];
            if (minVal <= maxVal) {
              updateSlider([minVal, maxVal]);
            }
          } else if (isDragging.current === 'second') {
            const minVal = value[0];
            const maxVal = (percentage / 100) * (max - min) + min;
            if (maxVal <= max) {
              updateSlider([minVal, maxVal]);
            }
          }
        }
      }
    } else {
      if (sliderThumbRef.current) {
        if (percentage >= 0 && percentage <= 100) {
          const val = (percentage / 100) * (max - min) + min;
          if (val <= max) {
            updateSlider(val);
          }
        }
      }
    }
  };

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  const showTooltip = (e: React.MouseEvent) => {
    if (
      tooltipRef.current &&
      (sliderThumbRef.current || sliderThumbRef2.current) &&
      sliderTrackRef.current
    ) {
      tooltipRef.current.style.display = 'block';
      if (isRange && e.currentTarget === sliderThumbRef.current) {
        tooltipRef.current.style.left = `calc(${sliderThumbRef.current.style.left})`;
        tooltipRef.current.textContent = Math.ceil(value[0]).toString();
        tooltipRef.current.style.opacity = '1';
        sliderThumbRef.current.style.border = '3px solid #0498fe';
        sliderTrackRef.current.style.backgroundColor = '#0498fe';
      } else if (isRange && e.currentTarget === sliderThumbRef2.current) {
        tooltipRef.current.style.left = `calc(${sliderThumbRef2.current.style.left})`;
        tooltipRef.current.textContent = Math.ceil(value[1]).toString();
        tooltipRef.current.style.opacity = '1';
        sliderThumbRef2.current.style.border = '3px solid #0498fe';
        sliderTrackRef.current.style.backgroundColor = '#0498fe';
      } else {
        if (sliderThumbRef.current && !Array.isArray(value)) {
          tooltipRef.current.style.left = `calc(${sliderThumbRef.current.style.left})`;
          tooltipRef.current.textContent = Math.ceil(value).toString();
          tooltipRef.current.style.opacity = '1';
          sliderThumbRef.current.style.border = '3px solid #0498fe';
          sliderTrackRef.current.style.backgroundColor = '#0498fe';
        }
      }
    }
  };

  const hideTooltip = () => {
    if (
      tooltipRef.current &&
      (sliderThumbRef.current ||
        sliderThumbRef2.current) &&
      sliderTrackRef.current
    ) {
      tooltipRef.current.style.opacity = '0';
      sliderThumbRef.current && (sliderThumbRef.current.style.border = '2px solid #9ed4f9');
      isRange && sliderThumbRef2.current && (sliderThumbRef2.current.style.border = '2px solid #9ed4f9');
      sliderTrackRef.current.style.backgroundColor = '#9ed4f9';
    }
  };

  const trackStyle: React.CSSProperties = {
    backgroundColor: '#9ed4f9',
  };

  const thumbStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    border: '2px solid #9ed4f9',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    cursor: 'pointer',
    position: 'absolute',
  };

  const thumbStyle2: React.CSSProperties = {
    ...thumbStyle,
    left: isRange ? '100%' : '0',
  };

  const backgroundStyle: React.CSSProperties = {
    display: 'inline-block',
    backgroundColor: '#f5f4f4',
    height: '4px',
    position: 'absolute',
    right: '0px',
    width: '100%',
  };

  const tooltipStyle: React.CSSProperties = {
    backgroundColor: '#000',
    color: '#fff',
    padding: '5px',
    borderRadius: '5px',
    display: 'none',
    position: 'absolute',
    top: '-40px',
    left: '0',
  };

  return (
    <div className='container'>
      <div className="slider-container" ref={sliderContainerRef}>
        <div
          className="slider-background"
          style={backgroundStyle}
        ></div>
        <div
          className="slider-track"
          ref={sliderTrackRef}
          style={trackStyle}
        ></div>
        <div
          className="slider-thumb"
          ref={sliderThumbRef}
          onMouseEnter={showTooltip}
          onMouseLeave={hideTooltip}
          onMouseDown={(e) => onMouseDown(e, 'first')}
          style={thumbStyle}
        ></div>
        {isRange && (
          <div
            className="slider-thumb"
            ref={sliderThumbRef2}
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
            onMouseDown={(e) => onMouseDown(e, 'second')}
            style={thumbStyle2}
          ></div>
        )}
        <div
          className="slider-tooltip"
          ref={tooltipRef}
          style={tooltipStyle}
        ></div>
      </div>
      {showInput && <div className='input-container'>
        <NumInput
          min={min}
          max={max}
          value={value}
          isRange={isRange}
          updateSlider={updateSlider}
        />
      </div>}
    </div>
  );
};

export default RangeSlider;
