import { useState, useEffect } from 'react';
import './App.css';

const FLOWERS = [
  {
    name: 'Kırmızı Gül',
    img: 'https://www.bakirkoycicekevi.com/uploads/WhatsApp_Image_2023-02-19_at_14.19.34_1.jpeg',
    info: 'Aşkın ve tutkunun simgesi.'
  },
  {
    name: 'Beyaz Gül',
    img: 'https://www.ruzgarbotanik.com/idea/gs/40/myassets/products/337/ruz1073-1.jpg?revision=1697143329',
    info: 'Saflık ve masumiyetin simgesi.'
  },
  {
    name: 'Papatya',
    img: 'https://st3.depositphotos.com/1194063/13304/i/450/depositphotos_133043374-stock-photo-daisy-flowers-on-wooden-background.jpg',
    info: 'Neşe ve sadeliğin simgesi.'
  }
];

const MESSAGES = [
  'Bugün de çiçeğine iyi bak! 🌸',
  'Unutma, sevgiyle büyür! 💧',
  'Her gün küçük bir iyilik, büyük bir güzellik getirir.',
  'Çiçeğin de senin gibi özel!',
  'Gülümse, hayat güzelleşir.'
];

function getRandomMessage() {
  return MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Ses dosyasını önceden yükle
const waterAudio = new Audio('https://cdn.pixabay.com/audio/2023/02/24/audio_12c7b6b6e2.mp3');
waterAudio.load();

function App() {
  const [selectedFlower, setSelectedFlower] = useState(0);
  const [flowerName, setFlowerName] = useState('');
  const [lastWatered, setLastWatered] = useState(() => {
    const saved = localStorage.getItem('lastWatered');
    return saved ? JSON.parse(saved) : [];
  });
  const [isWilted, setIsWilted] = useState(false);
  const [message, setMessage] = useState(getRandomMessage());
  const [showReminder, setShowReminder] = useState(false);
  const [wateringAnim, setWateringAnim] = useState([]);
  const [rainAnim, setRainAnim] = useState(false);

  useEffect(() => {
    localStorage.setItem('lastWatered', JSON.stringify(lastWatered));
    checkFlowerHealth();
    if (lastWatered.length > 0) {
      const last = new Date(lastWatered[lastWatered.length - 1]);
      const now = new Date();
      if ((now - last) > 24 * 60 * 60 * 1000) {
        setShowReminder(true);
      } else {
        setShowReminder(false);
      }
    }
  }, [lastWatered]);

  const checkFlowerHealth = () => {
    if (lastWatered.length === 0) {
      setIsWilted(false);
      return;
    }
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000));
    const recentWaterings = lastWatered.filter(date => new Date(date) > threeDaysAgo);
    if (recentWaterings.length === 0) {
      setIsWilted(true);
    } else {
      setIsWilted(false);
    }
  };

  const handleWater = () => {
    const now = new Date();
    setLastWatered(prev => [...prev, now.toISOString()]);
    // Çoklu damla animasyonu (daha fazla ve yavaş)
    const drops = Array.from({length: getRandomInt(25, 35)}, (_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 80 + 10,
      delay: Math.random() * 1.2 // 0-1.2s arası gecikme
    }));
    setWateringAnim(drops);
    setTimeout(() => setWateringAnim([]), 2200);
    // Yağmur efekti (daha fazla ve yavaş)
    setRainAnim(true);
    setTimeout(() => setRainAnim(false), 2500);
    setMessage(getRandomMessage());
    // Su sesi
    try {
      const audio = new Audio('/water.mp3');
      audio.currentTime = 0;
      audio.play();
    } catch (e) {
      console.log('Su sesi çalmadı (try/catch):', e);
    }
  };

  const handleFlowerChange = (idx) => {
    setSelectedFlower(idx);
    setLastWatered([]);
    setIsWilted(false);
    setMessage(getRandomMessage());
  };

  const handleNameChange = (e) => {
    setFlowerName(e.target.value);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Çiçeğim',
        text: `${flowerName || FLOWERS[selectedFlower].name} çiçeğim şu an ${isWilted ? 'soldu' : 'sağlıklı'}! Sen de çiçeğini sula!`,
        url: window.location.href
      });
    } else {
      alert('Paylaşım özelliği bu tarayıcıda desteklenmiyor.');
    }
  };

  const wateringDays = Array.from(new Set(lastWatered.map(d => new Date(d).toLocaleDateString('tr-TR'))));

  return (
    <div className="app">
      {rainAnim && (
        <div className="rain-overlay">
          {Array.from({length: 30}).map((_, i) => (
            <div
              key={i}
              className="rain-drop"
              style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random()}s` }}
            />
          ))}
        </div>
      )}
      <div className="flower-select">
        {FLOWERS.map((f, i) => (
          <button key={i} className={i === selectedFlower ? 'selected' : ''} onClick={() => handleFlowerChange(i)}>
            <img src={f.img} alt={f.name} />
          </button>
        ))}
      </div>
      <div className="image-container">
        <img
          src={FLOWERS[selectedFlower].img}
          alt="Çiçek"
          className={isWilted ? 'wilted' : ''}
        />
        {wateringAnim.map(drop => (
          <div
            key={drop.id}
            className="water-anim"
            style={{ left: `${drop.left}%`, animationDelay: `${drop.delay}s` }}
          >
            💧
          </div>
        ))}
      </div>
      <input
        className="flower-name-input"
        type="text"
        placeholder="Çiçeğine isim ver..."
        value={flowerName}
        onChange={handleNameChange}
        maxLength={20}
      />
      <button 
        className="water-button"
        onClick={handleWater}
        disabled={isWilted}
      >
        Çiçeği Sula
      </button>
      <button className="share-btn" onClick={handleShare}>Paylaş</button>
      <div className="info">
        <p><b>{flowerName || FLOWERS[selectedFlower].name}</b></p>
        <p>{FLOWERS[selectedFlower].info}</p>
        <p>Son sulama sayısı: {lastWatered.length}</p>
        <p>Durum: {isWilted ? 'Çiçek soldu!' : 'Çiçek sağlıklı'}</p>
        <p>Günlük sulama yapılan gün sayısı: {wateringDays.length}</p>
        <p className="message">{message}</p>
        <div className="watering-history">
          <b>Sulama Geçmişi:</b>
          <ul>
            {wateringDays.slice(-7).map((d, i) => <li key={i}>{d}</li>)}
          </ul>
        </div>
      </div>
      {showReminder && <div className="reminder">Çiçeğini sulamayı unutma! 💧</div>}
    </div>
  );
}

export default App; 