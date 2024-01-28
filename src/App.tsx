import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import blank from './wednesday_blank.jpeg';
import html2canvas from 'html2canvas';

type Metrics = {
  fontSize: number;
  width: number;
  height: number;
}

function App() {
  const [captainBubble, setCaptainBubble] = useState('');
  const [captainBubbleMetrics, setCaptainBubbleMetrics] = useState({} as Metrics);

  const captainTotalWidth = 393;
  const captainTotalHeight = 73;

  const [tintinBubble, setTintinBubble] = useState('');
  const [tintinBubbleMetrics, setTintinBubbleMetrics] = useState({} as Metrics);

  const tintinTotalWidth = 275;
  const tintinTotalHeight = 43;

  const canvas = useRef<HTMLCanvasElement>(null);
  const comic = useRef<HTMLDivElement>(null);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    onCaptainBubbleChange({ currentTarget: { value: 'What a week, huh?' } } as React.ChangeEvent<HTMLInputElement>);
    onTintinBubbleChange({ currentTarget: { value: 'Captain, it\'s Wednesday' } } as React.ChangeEvent<HTMLInputElement>);
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  const onCaptainBubbleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const m = findFontSize(e.currentTarget.value, captainTotalWidth);
    setCaptainBubbleMetrics(m);
    setCaptainBubble(e.currentTarget.value);
  };

  const onTintinBubbleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const m = findFontSize(e.currentTarget.value, tintinTotalWidth);
    setTintinBubbleMetrics(m);
    setTintinBubble(e.currentTarget.value);
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
    while (true) {
      ctx.font = `${fontSize}px 'Polsyh'`;
      const metrics = ctx.measureText(text);
      if (metrics.width > targetWidth) {
        fontSize--;
        ctx.font = `${fontSize}px 'Polsyh'`;
        break;
      }
      fontSize++;
    }

    const metrics = ctx.measureText(text);
    return {
      fontSize,
      width: metrics.width,
      height: metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent,
    };
  };

  const download = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!comic.current) return;
    html2canvas(comic.current).then(canvas => {
      const out = canvas.toDataURL('image/jpeg');
      console.log(out);
      const link = document.createElement('a');
      link.href = out;
      link.setAttribute('download', 'wednesday.jpeg')
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <div className="App">
      <div className="comic">
        <div ref={comic}>
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
          <div
            className="tintin-bubble"
            style={{ fontSize: `${tintinBubbleMetrics.fontSize}px` }}
          >
            <div style={{
              position: 'absolute',
              left: `${(tintinTotalWidth - tintinBubbleMetrics.width) / 2}px`,
              top: `${(tintinTotalHeight - tintinBubbleMetrics.height) / 2}px`,
            }}>
              {tintinBubble}
            </div>
          </div>
        </div>
        <canvas id="canvas" ref={canvas} style={{display: 'none'}}/>
      </div >
      <div className="controls">
        <form>
          <div className="item">
            <label htmlFor="captain">Captain</label>
            <input
              name="captain"
              type="text"
              placeholder="What a week, huh?"
              value={captainBubble}
              onChange={e => onCaptainBubbleChange(e)}
            />
            {/* <div>{captainBubbleMetrics.fontSize}</div>
            <div>{captainBubbleMetrics.height}</div>
            <div>{captainBubbleMetrics.width}</div> */}
          </div>

          <div className="item">
            <label htmlFor="tintin">Tintin</label>
            <input
              name="tintin"
              type="text"
              placeholder="Captain, it's Wednesday"
              value={tintinBubble}
              onChange={onTintinBubbleChange}
            />
            {/* <div>{tintinBubbleMetrics.fontSize}</div>
            <div>{tintinBubbleMetrics.height}</div>
            <div>{tintinBubbleMetrics.width}</div> */}
          </div>

          <button type="button" className="item" onClick={download}>Download</button>
        </form>
      </div>
    </div>
  );
}

export default App;
