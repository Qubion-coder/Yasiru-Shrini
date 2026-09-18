import { useState } from 'react';
import { Link, MessageSquare } from 'lucide-react';

export default function Admin() {
  const [prefix, setPrefix] = useState('Mr.');
  const [guestName, setGuestName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  
  const prefixes = ['Mr.', 'Mrs.', 'Miss', 'Mr. & Mrs.', 'Family', 'Dear'];

  const handleGenerate = () => {
    if (!guestName.trim()) return;
    const url = new URL(window.location.origin);
    url.searchParams.set('p', prefix);
    url.searchParams.set('n', guestName.trim());
    setGeneratedLink(url.toString());
  };

  const getMessage = () => {
    return `Dear ${prefix} ${guestName} ❤️\n\nWith joyful hearts, we warmly invite you to celebrate one of the most special days of our lives as we begin our journey together.\n\nPlease view our wedding invitation and all the event details through the link below 🌐:\n\n${generatedLink}\n\nYour presence would truly mean the world to us, and we would be honored to celebrate this beautiful moment together.\n\nWith love,\n❤️ Yasiru & Shrini`;
  };

  const copyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      alert('Link copied!');
    }
  };

  const copyMessage = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(getMessage());
      alert('Message copied!');
    }
  };

  return (
    <div className="min-h-screen bg-[#f2eadc] p-8 font-sans text-ink flex flex-col items-center justify-center">
      <div className="w-full max-w-xl bg-white border border-gold/20 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-3xl font-display text-gold-dark mb-8 text-center">Invitation Generator</h1>
        
        <div className="space-y-6">
          <div>
            <label className="text-[10px] uppercase tracking-[0.35em] font-bold text-stone-700 block mb-3">Select Prefix</label>
            <select
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              className="w-full bg-transparent border border-gold/30 rounded-2xl px-5 py-4 focus:border-gold outline-none transition-all text-stone-900"
            >
              {prefixes.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.35em] font-bold text-stone-700 block mb-3">Guest Name</label>
            <input
              type="text"
              placeholder="e.g. Sanjaya"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full bg-transparent border border-gold/30 rounded-2xl px-5 py-4 focus:border-gold outline-none transition-all text-stone-900"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!guestName.trim()}
            className="w-full px-8 py-4 bg-ink text-ivory rounded-full text-[10px] uppercase tracking-[0.4em] font-bold shadow-2xl hover:bg-gold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate Link
          </button>

          {generatedLink && (
            <div className="mt-8 p-6 bg-ivory/30 rounded-2xl border border-gold/10 space-y-4">
              <p className="text-sm text-stone-800 break-all font-mono bg-white p-2 rounded">{generatedLink}</p>
              
              <div className="flex gap-4">
                <button
                  onClick={copyLink}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gold/30 text-stone-800 rounded-full text-xs font-bold hover:bg-gold hover:text-white transition-colors"
                >
                  <Link size={14} /> Link Only
                </button>
                <button
                  onClick={copyMessage}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gold text-white rounded-full text-xs font-bold shadow-lg hover:bg-gold-dark transition-colors"
                >
                  <MessageSquare size={14} /> Full Message
                </button>
              </div>

              <div className="mt-4 text-xs text-stone-700 whitespace-pre-wrap bg-white p-4 rounded-xl border border-gold/10">
                {getMessage()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
