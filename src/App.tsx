import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import blank from './wednesday_blank.jpeg';
import { on } from 'events';

type Metrics = {
  fontSize: number;
  width: number;
  height: number;
}

function App() {
  const [captainBubble, setCaptainBubble] = useState('What a week, huh?');
  const [captainBubbleMetrics, setCaptainBubbleMetrics] = useState({} as Metrics);

  const captainTotalWidth = 393;
  const captainTotalHeight = 73;

  const canvas = useRef<HTMLCanvasElement>(null);

  const onCaptainBubbleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const m = findFontSize(e.currentTarget.value, captainTotalWidth);
    setCaptainBubbleMetrics(m);
    setCaptainBubble(e.currentTarget.value);
  };

  const findFontSize = (text: string, targetWidth: number): Metrics => {
    if (text.length === 0) return {
      fontSize: 0,
      width: 0,
      height: 0,
    };

    const ctx = canvas.current?.getContext('2d');
    if (!ctx) return {
      fontSize: 0,
      width: 0,
      height: 0,
    }

    let fontSize = 10;
    ctx.font = `${fontSize}px 'Polsyh'`;
    while (true) {
      const metrics = ctx.measureText(text);
      if (metrics.width > targetWidth) {
        fontSize--;
        break;
      }
      fontSize++;
      console.log(`findFontSize: ${fontSize}`);
      ctx.font = `${fontSize}px 'Polsyh'`;
    }

    const metrics = ctx.measureText(text);
    return {
      fontSize,
      width: metrics.width,
      height: metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent,
    };
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <img src={blank} alt="wednesday" />
          <div
            className="captain-bubble"
            style={{ fontSize: `${captainBubbleMetrics.fontSize}px` }}
          >
            <div style={{
              position: 'absolute',
              left: `${(captainTotalWidth - captainBubbleMetrics.width) / 2}px`,
              top: `${(captainTotalHeight - captainBubbleMetrics.height) / 2}px`,
            }}>
              {captainBubble}
            </div>
          </div>
        </div>
        <canvas id="canvas" ref={canvas} />
      </header>
      <div>
        <form>
          <input
            type="text"
            placeholder="What a week, huh?"
            value={captainBubble}
            onChange={e => onCaptainBubbleChange(e)}
          />
          <div>{captainBubbleMetrics.fontSize}</div>
          <div>{captainBubbleMetrics.height}</div>
          <div>{captainBubbleMetrics.width}</div>
        </form>
      </div>
    </div>
  );
}

export default App;
