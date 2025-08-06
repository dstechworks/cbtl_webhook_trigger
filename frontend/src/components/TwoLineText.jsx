import React, { useEffect, useRef } from 'react';
import './TwoLineText.css';

const TwoLineText = ({ text }) => {
    const line1Ref = useRef(null);
    const line2Ref = useRef(null);

    // Split into two balanced lines based on word count
    const splitIntoBalancedLines = () => {
        const words = text.split(/\s+/);
        
        if (words.length <= 1) {
            return { first: words[0] || '', second: '' };
        }

        let bestSplit = { first: '', second: '' };
        let minDiff = Infinity;

        for (let i = 1; i < words.length; i++) {
            const first = words.slice(0, i).join(' ');
            const second = words.slice(i).join(' ');
            const diff = Math.abs(first.length - second.length);

            if (diff < minDiff) {
                minDiff = diff;
                bestSplit = { first, second };
            }
        }

        return bestSplit;
    };

    // Adjust font size so text fits inside each box
    const fitText = () => {
        const line1 = line1Ref.current;
        const line2 = line2Ref.current;

        if (!line1 || !line2) return;

        // Calculate base max size using screen size
        const screenMin = Math.min(window.innerWidth, window.innerHeight);
        const baseMaxFontSize = screenMin / 6; // Scales with screen size

        // Adjust based on text length
        const totalLength = line1.textContent.length + line2.textContent.length;
        const lengthFactor = Math.max(1, totalLength / 20); // 20 is arbitrary for balancing
        const maxFontSize = Math.max(20, baseMaxFontSize / lengthFactor); // Clamp lower bound

        let minSize = 10;
        let maxSize = maxFontSize;

        while (minSize <= maxSize) {
            const mid = (minSize + maxSize) / 2;
            line1.style.fontSize = `${mid}px`;
            line2.style.fontSize = `${mid}px`;

            if (
                line1.scrollWidth <= line1.clientWidth &&
                line1.scrollHeight <= line1.clientHeight &&
                line2.scrollWidth <= line2.clientWidth &&
                line2.scrollHeight <= line2.clientHeight
            ) {
                minSize = mid + 0.5;
            } else {
                maxSize = mid - 0.5;
            }
        }

        const finalSize = Math.floor(maxSize);
        line1.style.fontSize = `130px`;
        line2.style.fontSize = `130px`;
    };


    useEffect(() => {
        const { first, second } = splitIntoBalancedLines();
        line1Ref.current.textContent = first;
        line2Ref.current.textContent = second;

        fitText();

        window.addEventListener('resize', fitText);
        return () => window.removeEventListener('resize', fitText);
    }, [text]);

    return (
        <div className="two-line-container">
            <div className="line-box line1-box">
                <div className="line line1" ref={line1Ref}></div>
            </div>
            <div className="line-box line2-box">
                <div className="line line2" ref={line2Ref}></div>
            </div>
        </div>
    );
};

export default TwoLineText;