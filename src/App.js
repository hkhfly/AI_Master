import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, Send, ChevronLeft, MoreHorizontal, Image as ImageIcon, 
  Share2, Settings, User, HelpCircle, Info, Lock, 
  MessageCircle, Compass, Home, Volume2, VolumeX, X
} from 'lucide-react';
import './App.css';

// --- Local Images ---
import jigongImg from './images/jigong/jigong1.jpg';
import pangImg from './images/pang/panglinzhao1.jpeg';
import shakyamuniImg from './images/shakyamuni/buddha3.jpg';

// --- Assets / Data ---
const CHARACTERS = [
  {
    id: 'jigong',
    name: '济公活佛',
    title: '自在逍遥',
    desc: '鞋儿破，帽儿破，身上的袈裟破。嬉笑怒骂，皆是禅机。',
    avatar: jigongImg,
    style: 'realistic',
    locked: false,
    color: '#7241F2'
  },
  {
    id: 'pang',
    name: '庞灵照',
    title: '清净智慧',
    desc: '庞居士之女，灵照蕴空。可爱俏皮，智慧过人。',
    avatar: pangImg,
    style: 'cartoon',
    locked: false,
    color: '#00B75E'
  },
  {
    id: 'shakyamuni',
    name: '释迦牟尼',
    title: '大彻大悟',
    desc: '天上天下，唯我独尊。万法皆空，因果不空。',
    avatar: shakyamuniImg,
    style: 'buddhist',
    locked: true,
    color: '#F45805'
  }
];

const SUGGESTED_TOPICS = [
  "我最近感到很迷茫",
  "如何面对失恋的痛苦？",
  "工作压力太大怎么办？",
  "我想了解佛法入门",
  "人生的意义是什么？"
];

// --- Components ---

const StatusBar = () => (
  <div className="status-bar">
    <span>9:41</span>
    <div className="dynamic-island"></div>
    <div style={{ display: 'flex', gap: '6px' }}>
      <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><path d="M16 0H2C0.9 0 0 0.9 0 2V10C0 11.1 0.9 12 2 12H16C17.1 12 18 11.1 18 10V2C18 0.9 17.1 0 16 0ZM16 10H2V2H16V10Z"/><path d="M4 4H14V8H4V4Z"/></svg>
      <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor"><path d="M14 0H2C0.9 0 0 0.9 0 2V10C0 11.1 0.9 12 2 12H14C15.1 12 16 11.1 16 10V2C16 0.9 15.1 0 14 0Z"/></svg>
    </div>
  </div>
);

const BottomNav = ({ activeTab, setActiveTab }) => (
  <div className="bottom-nav">
    <div className="home-indicator"></div>
    <NavIcon icon={<MessageCircle size={24} />} label="对话" active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
    <NavIcon icon={<Compass size={24} />} label="发现" active={activeTab === 'discover'} onClick={() => setActiveTab('discover')} />
    <NavIcon icon={<User size={24} />} label="我的" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
  </div>
);

const NavIcon = ({ icon, label, active, onClick }) => (
  <div onClick={onClick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: active ? 1 : 0.5, cursor: 'pointer' }}>
    <div style={{ color: active ? 'var(--primary)' : 'white', marginBottom: '4px' }}>{icon}</div>
    <span style={{ fontSize: '10px', color: active ? 'var(--primary)' : 'white' }}>{label}</span>
  </div>
);

// --- Main App Component ---

function App() {
  const [view, setView] = useState('onboarding'); // onboarding, chat, deep, share
  const [selectedChar, setSelectedChar] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleCharSelect = (char) => {
    if (char.locked) return;
    setSelectedChar(char);
    setView('chat');
    // Initial greeting
    setMessages([
      { id: 1, sender: 'ai', text: `施主好，我是${char.name}。今日有缘相见，不知施主心中有何挂碍，不妨说来听听。`, type: 'text' }
    ]);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    const newMsg = { id: Date.now(), sender: 'user', text: inputText, type: 'text' };
    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    // Simulate AI Response
    setTimeout(() => {
      // Check for deep mode trigger
      if (inputText.includes("迷茫") || inputText.includes("痛苦") || inputText.includes("人生") || inputText.includes("深")) {
         // Trigger Deep Mode offer or entry
         const aiMsg = { id: Date.now() + 1, sender: 'ai', text: "施主所言，触及灵魂。此问题颇有深意，不如我们换个心境，细细道来？", type: 'text' };
         setMessages(prev => [...prev, aiMsg]);
         // Auto enter deep mode for demo purposes after a short delay
         setTimeout(() => setView('deep'), 2000);
      } else {
        const aiMsg = { id: Date.now() + 1, sender: 'ai', text: "酒肉穿肠过，佛祖心中留。施主不必过于执着。", type: 'text' };
        setMessages(prev => [...prev, aiMsg]);
      }
    }, 1500);
  };

  const handleDeepModeEnd = () => {
    setShowShareModal(true);
  };

  const closeShareModal = () => {
    setShowShareModal(false);
    setView('chat');
  };

  return (
    <div className="iphone-frame">
      <StatusBar />
      
      {/* --- Onboarding / Character Selection --- */}
      {view === 'onboarding' && (
        <div className="app-content" style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ padding: '20px 20px 10px 20px', flexShrink: 0 }}>
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: 'bold', 
              marginTop: '40px', 
              marginBottom: '10px',
              lineHeight: '1.2'
            }}>
              请选择您的 <span style={{ color: 'var(--primary)' }}>AI大师兄</span>
            </h1>
          </div>
          
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            padding: '0',
            overflow: 'hidden' /* Prevent scrolling, fit in screen */
          }}>
            {CHARACTERS.map((char, index) => (
              <div 
                key={char.id} 
                onClick={() => handleCharSelect(char)}
                className={`character-card animate-fade-in ${char.locked ? 'locked' : ''}`}
                style={{ 
                  borderColor: selectedChar?.id === char.id ? char.color : 'transparent',
                  flex: 1, /* Distribute height equally */
                  height: 'auto',
                  borderRadius: 0,
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Background Image */}
                <div className="card-bg" style={{ backgroundImage: `url(${char.avatar})` }}></div>
                
                {/* Overlay Gradient */}
                <div className="card-overlay"></div>

                {/* Locked Overlay */}
                {char.locked && <div className="card-locked-overlay"><Lock size={32} color="white" /></div>}

                {/* Content */}
                <div className="card-content" style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: char.color }}>{char.name}</h3>
                    </div>
                  </div>
                  <p style={{ margin: '8px 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{char.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- Chat View --- */}
      {view === 'chat' && selectedChar && (
        <>
          {/* Header */}
          <div style={{ 
            height: '60px', 
            padding: '0 20px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            position: 'absolute',
            top: '54px',
            width: '100%',
            zIndex: 10,
            background: 'var(--bg)'
          }}>
            <ChevronLeft onClick={() => setView('onboarding')} style={{ cursor: 'pointer' }} />
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontWeight: 'bold' }}>{selectedChar.name}</span>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
               <div onClick={() => setIsSoundOn(!isSoundOn)}>
                 {isSoundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
               </div>
               <Settings size={20} />
            </div>
          </div>

          {/* Messages */}
          <div 
            className="app-content" 
            ref={scrollRef}
            style={{ paddingTop: '120px', paddingBottom: '140px' }} // Extra padding for header and input
          >
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className="animate-fade-in"
                style={{ 
                  display: 'flex', 
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '20px',
                  padding: '0 20px'
                }}
              >
                {msg.sender === 'ai' && (
                  <img src={selectedChar.avatar} alt="AI" style={{ width: '36px', height: '36px', borderRadius: '50%', marginRight: '10px' }} />
                )}
                <div className={msg.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'} style={{ padding: '12px 16px', maxWidth: '75%', fontSize: '15px', lineHeight: '1.5' }}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Suggested Topics if few messages */}
            {messages.length < 3 && (
              <div style={{ padding: '0 20px', marginTop: '20px' }}>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px' }}>您可能想问：</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {SUGGESTED_TOPICS.map((topic, i) => (
                    <button 
                      key={i}
                      onClick={() => setInputText(topic)}
                      style={{ 
                        background: 'rgba(255,255,255,0.05)', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        color: 'var(--text-secondary)',
                        padding: '8px 12px',
                        borderRadius: '16px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div style={{ 
            position: 'absolute', 
            bottom: '80px', // Above bottom nav
            left: 0, 
            width: '100%', 
            padding: '12px 20px',
            background: 'var(--bg)',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <button 
              onClick={() => setIsVoiceMode(!isVoiceMode)}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <Mic size={24} color={isVoiceMode ? 'var(--primary)' : 'currentColor'} />
            </button>
            
            <div style={{ flex: 1, position: 'relative' }}>
               {isVoiceMode ? (
                 <button style={{ 
                   width: '100%', 
                   height: '40px', 
                   borderRadius: '20px', 
                   background: 'var(--primary)', 
                   color: 'white', 
                   border: 'none',
                   fontWeight: 'bold'
                 }}>
                   按住 说话
                 </button>
               ) : (
                 <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="向大师兄提问..."
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  style={{ 
                    width: '100%', 
                    height: '40px', 
                    borderRadius: '20px', 
                    background: 'var(--surface)', 
                    border: 'none', 
                    padding: '0 16px',
                    color: 'white',
                    outline: 'none'
                  }} 
                />
               )}
            </div>

            <button 
              onClick={handleSendMessage}
              style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                background: inputText.trim() ? 'var(--primary)' : 'var(--surface)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
            >
              <Send size={20} color="white" />
            </button>
          </div>
          
          <BottomNav activeTab="chat" setActiveTab={() => {}} />
        </>
      )}

      {/* --- Deep Mode View --- */}
      {view === 'deep' && (
        <div className="deep-mode-container animate-fade-in">
          {/* Top Illustration */}
          <div style={{ position: 'relative', height: '50%', width: '100%' }}>
            <img 
              src="https://images.unsplash.com/photo-1518155317743-a4f9034e0422?q=80&w=800&auto=format&fit=crop" 
              alt="Zen" 
              className="deep-mode-image" 
              style={{ height: '100%' }}
            />
            <button 
              onClick={() => handleDeepModeEnd()}
              style={{ position: 'absolute', top: '60px', right: '20px', background: 'rgba(0,0,0,0.3)', border: 'none', color: 'white', padding: '8px', borderRadius: '50%' }}
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Bottom Interaction */}
          <div className="deep-mode-text">
            <h2 style={{ fontFamily: 'serif', fontSize: '24px', marginBottom: '16px', color: 'var(--primary)' }}>放下执念</h2>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              人生如梦幻泡影，如露亦如电。你所执着的痛苦，不过是心念的投射。
              <br/><br/>
              试着深呼吸，感受当下的宁静。
            </p>
            <div style={{ padding: '20px', background: 'var(--surface)', borderRadius: '16px', borderLeft: '4px solid var(--accent)' }}>
              <p style={{ margin: 0, fontStyle: 'italic' }}>"万法皆空，因果不空。"</p>
            </div>
            
            <button 
              onClick={handleDeepModeEnd}
              style={{ 
                marginTop: '40px', 
                width: '100%', 
                padding: '16px', 
                borderRadius: '30px', 
                background: 'linear-gradient(90deg, var(--primary), var(--accent))', 
                border: 'none', 
                color: 'white', 
                fontWeight: 'bold', 
                fontSize: '16px',
                boxShadow: '0 4px 15px rgba(114, 65, 242, 0.4)'
              }}
            >
              我已顿悟，分享开示
            </button>
          </div>
        </div>
      )}

      {/* --- Share Modal --- */}
      {showShareModal && (
        <div style={{ 
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
          background: 'rgba(0,0,0,0.9)', zIndex: 200, 
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' 
        }}>
          <div className="animate-fade-in" style={{ 
            width: '85%', 
            background: 'white', 
            borderRadius: '20px', 
            overflow: 'hidden',
            color: 'black'
          }}>
            <img 
              src="https://images.unsplash.com/photo-1518155317743-a4f9034e0422?q=80&w=800&auto=format&fit=crop" 
              alt="Zen" 
              style={{ width: '100%', height: '300px', objectFit: 'cover' }}
            />
            <div style={{ padding: '24px' }}>
               <h3 style={{ fontFamily: 'serif', fontSize: '20px', marginBottom: '12px' }}>大师兄开示</h3>
               <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#666', marginBottom: '20px' }}>
                 "你所执着的痛苦，不过是心念的投射。万法皆空，唯有当下。"
               </p>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '16px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>AI</div>
                   <span style={{ fontWeight: 'bold', fontSize: '14px' }}>AI大师兄</span>
                 </div>
                 <div style={{ width: '40px', height: '40px', background: '#000', borderRadius: '4px' }}></div> {/* Fake QR */}
               </div>
            </div>
          </div>
          
          <button 
             onClick={closeShareModal}
             style={{ marginTop: '30px', background: 'transparent', border: '1px solid white', color: 'white', padding: '10px 24px', borderRadius: '20px' }}
          >
            关闭 / 返回
          </button>
        </div>
      )}

    </div>
  );
}

export default App;
