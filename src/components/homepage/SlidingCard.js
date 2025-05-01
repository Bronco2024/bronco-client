import { useEffect, useRef, useState } from 'react';
import './SlidingCard.css';

export default function SlidingCard({ title, text }) {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div ref={ref} className={`card ${visible ? 'slide-in' : ''}`}>
      <h2 className="card-title">{title}</h2>
      <p className="card-text">{text}</p>
    </div>
  );
}