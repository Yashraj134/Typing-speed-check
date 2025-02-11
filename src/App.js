import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const sampleTexts = [
  "The quick brown fox jumps over the lazy dog.",
  "To be or not to be, that is the question.",
  "All that glitters is not gold.",
  "A journey of a thousand miles begins with a single step.",
  "Practice makes perfect, but nobody's perfect, so why practice?"
];

function App() {
  const [text, setText] = useState('');
  const [sampleText, setSampleText] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTyping, setIsTyping] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isFinished, setIsFinished] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setSampleText(sampleTexts[Math.floor(Math.random() * sampleTexts.length)]);
  }, []);

  useEffect(() => {
    if (isTyping && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            finishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isTyping, timeLeft]);

  const startTest = () => {
    setText('');
    setTimeLeft(60);
    setIsTyping(true);
    setIsFinished(false);
    setWpm(0);
    setAccuracy(100);
    setSampleText(sampleTexts[Math.floor(Math.random() * sampleTexts.length)]);
    inputRef.current?.focus();
  };

  const finishTest = () => {
    setIsTyping(false);
    setIsFinished(true);
    
    const words = text.trim().split(/\s+/).length;
    const minutes = (60 - timeLeft) / 60;
    const wpm = Math.round(words / minutes);
    
    let correctChars = 0;
    const minLength = Math.min(text.length, sampleText.length);
    for (let i = 0; i < minLength; i++) {
      if (text[i] === sampleText[i]) correctChars++;
    }
    const accuracy = Math.round((correctChars / sampleText.length) * 100);
    
    setWpm(wpm);
    setAccuracy(accuracy);
  };

  const handleInputChange = (e) => {
    if (!isTyping && !isFinished) {
      setIsTyping(true);
    }
    setText(e.target.value);
    
    if (e.target.value === sampleText) {
      finishTest();
    }
  };

  return (
    <div className="container">
      <div className="content">
        <h1 className="title">Speed<span className="highlight">Type</span></h1>

        <div className="info">
          <span className="timer">{timeLeft}s</span>
          <button className="start-btn" onClick={startTest}>
            {isFinished ? 'Try Again' : 'Start Test'}
          </button>
        </div>

        <div className="sample-text">
          {sampleText.split('').map((char, index) => (
            <span
              key={index}
              className={
                text[index] ? (text[index] === char ? 'correct' : 'incorrect') : ''
              }
            >
              {char}
            </span>
          ))}
        </div>

        <textarea
          ref={inputRef}
          value={text}
          onChange={handleInputChange}
          disabled={!isTyping || isFinished}
          className="input-box"
          placeholder="Start typing here..."
        />

        {isFinished && (
          <div className="results">
            <div className="result-box">
              <span className="result-value">{wpm}</span>
              <span className="result-label">Words per Minute</span>
            </div>
            <div className="result-box">
              <span className="result-value">{accuracy}%</span>
              <span className="result-label">Accuracy</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
