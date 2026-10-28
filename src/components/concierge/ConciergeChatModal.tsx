import React, { useState } from 'react';
import { 
  X, 
  Send, 
  ShoppingBag, 
  Eye, 
  ShieldCheck, 
  Phone, 
  MapPin, 
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface ChatMessage {
  id: string;
  sender: 'concierge' | 'user';
  text: string;
  suggestedProductIds?: string[];
  timestamp: string;
}

export const ConciergeChatModal: React.FC = () => {
  const { 
    isConciergeOpen, 
    setIsConciergeOpen, 
    products, 
    setSelectedProduct, 
    addToCart, 
    showToast, 
    userProfile,
    formatPrice,
    setIsCartOpen
  } = useStore();
  const [activeTab, setActiveTab] = useState<'advisory' | 'appointment' | 'contact'>('advisory');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Appointment Form State
  const [appointmentData, setAppointmentData] = useState({
    name: userProfile?.fullName || '',
    email: userProfile?.email || '',
    phone: userProfile?.phone || '08166612115',
    location: 'MellyStore Studio (Victoria Island, Lagos)',
    service: 'Gala & Eveningwear Consultation',
    date: '2026-10-15',
    time: '14:30',
    notes: 'Looking for a bespoke luxury fitting session.'
  });
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const handleAddLookToBag = (productIds: string[]) => {
    let count = 0;
    productIds.forEach(id => {
      const prod = products.find(p => p.id === id);
      if (prod) {
        addToCart(prod, prod.sizes[0] || 'M', prod.colors[0], 1);
        count++;
      }
    });
    if (count > 0) {
      showToast('Curated Look Added', `${count} bespoke pieces added to your shopping bag.`);
      setIsCartOpen(true);
      setIsConciergeOpen(false);
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'concierge',
      text: "Hello. I am Adaeze Okafor, Senior Client Stylist at MellyStore Studio. How may I assist your wardrobe curation today? I can guide you on bias-cut silk proportions, evening gala attire, noble fiber maintenance, or bespoke measurements.",
      suggestedProductIds: ['melly-01a', 'melly-04'],
      timestamp: 'Just now'
    }
  ]);

  if (!isConciergeOpen) return null;

  const quickPrompts = [
    "Black-tie gala & eveningwear recommendations",
    "How does the Aurelia Bias-Cut Silk Slip fit?",
    "Executive boardroom & tailoring capsule",
    "Transatlantic cashmere travel capsule",
    "Studio white-glove shipping & returns protocol"
  ];

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = "";
      let suggestedIds: string[] = [];
      const lower = query.toLowerCase();

      if (lower.includes('gala') || lower.includes('black-tie') || lower.includes('evening') || lower.includes('wedding')) {
        replyText = "For formal gala or black-tie occasions, our centerpiece is the Genevieve Pleated Organza Evening Gown. It features hand-pleated tiered hems and structured interior corsetry for effortless poise. Pair with the Vendôme Architectural Mules and our Woven Calfskin Clutch.";
        suggestedIds = ['melly-04', 'melly-09', 'melly-08'];
      } else if (lower.includes('size') || lower.includes('fit') || lower.includes('aurelia') || lower.includes('measure')) {
        replyText = "The Aurelia Slip Dress is sculpted from pure 22-momme Mulberry silk on a true 45-degree diagonal bias. This gives natural contouring without stiffness. If you are between sizes, we advise selecting your smaller size as the bias weave possesses gentle natural flexibility. If you share your bust and waist measurements, I will confirm your exact Studio size.";
        suggestedIds = ['melly-01a'];
      } else if (lower.includes('work') || lower.includes('office') || lower.includes('boardroom') || lower.includes('suit') || lower.includes('trouser')) {
        replyText = "For an executive presence that radiates effortless sophistication, pair our Italian Wool Sienna Double-Breasted Blazer with the Elara Wide-Leg Crepe Trousers and the fluid Nigerian Silk Necktie Blouse.";
        suggestedIds = ['melly-02', 'melly-14', 'melly-17'];
      } else if (lower.includes('cocktail') || lower.includes('party') || lower.includes('dinner') || lower.includes('ruched')) {
        replyText = "For cocktail soirées and intimate dinners, the Riviera Ruched Midi Dress is sublime. Sculpted in stretch satin with asymmetric gathers that celebrate feminine movement. Pair with the handcrafted Woven Calfskin Clutch.";
        suggestedIds = ['melly-15', 'melly-08'];
      } else if (lower.includes('travel') || lower.includes('comfort') || lower.includes('lounge') || lower.includes('cashmere')) {
        replyText = "For transatlantic travel, the Paloma Ribbed Cashmere Set is unmatched. Spun from 100% grade-A Mongolian cashmere with fluid wide trousers and a mock neck silhouette. Layer it with our Italian Virgin Wool Sienna Blazer for immediate arrival poise.";
        suggestedIds = ['melly-03', 'melly-02'];
      } else if (lower.includes('care') || lower.includes('wash') || lower.includes('clean') || lower.includes('silk')) {
        replyText = "For our Grade-6A Mulberry Silks, we recommend either luxury dry cleaning or gentle hand-washing in tepid water with specialized silk wash. Avoid wringing; roll inside a clean white cotton towel to absorb moisture and steam gently on the reverse.";
        suggestedIds = ['melly-01a'];
      } else if (lower.includes('delivery') || lower.includes('return') || lower.includes('shipping')) {
        replyText = "All MellyStore orders over $250 include complimentary international courier dispatch. Each piece is hand-wrapped in archival acid-free tissue paper within our signature champagne presentation box. We offer a 30-day Studio return privilege with complimentary door-to-door courier collection.";
        suggestedIds = [];
      } else {
        // Dynamic search across catalog
        const matching = products.filter(p => 
          p.name.toLowerCase().includes(lower) || 
          p.category.toLowerCase().includes(lower) || 
          p.composition.toLowerCase().includes(lower) ||
          p.description.toLowerCase().includes(lower) ||
          p.details.some(d => d.toLowerCase().includes(lower))
        ).slice(0, 3);

        if (matching.length > 0) {
          replyText = `Based on your enquiry, I have curated these bespoke silhouettes from our atelier that match your styling aesthetic:`;
          suggestedIds = matching.map(m => m.id);
        } else {
          replyText = "Understated architectural silhouettes and noble natural fibers define our collections. I recommend exploring our signature Aurelia Silk Slip paired with the Italian tailored Sienna Blazer for refined day-to-evening versatility.";
          suggestedIds = ['melly-01a', 'melly-02'];
        }
      }

      setMessages(prev => [
        ...prev,
        {
          id: `concierge-${Date.now()}`,
          sender: 'concierge',
          text: replyText,
          suggestedProductIds: suggestedIds,
          timestamp: 'Just now'
        }
      ]);
      setIsTyping(false);
    }, 700);
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingConfirmed(true);
    showToast('Private Appointment Reserved', `Confirmed for ${appointmentData.date} at ${appointmentData.time}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in flex items-end sm:items-center justify-end sm:justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsConciergeOpen(false)}
      />

      {/* Advisory Window */}
      <div className="relative w-full sm:max-w-xl bg-[#FAF8F5] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden z-10 border border-stone-300 h-[90vh] sm:h-[680px] flex flex-col">
        
        {/* Header */}
        <div className="bg-noir-950 p-4 text-white flex items-center justify-between border-b border-noir-800">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-stone-100 text-noir-950 flex items-center justify-center font-serif font-semibold text-sm border border-stone-300">
                CL
              </div>
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-noir-950 absolute -bottom-0.5 -right-0.5"></span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-serif text-sm font-medium tracking-wide">Adaeze Okafor</span>
                <ShieldCheck className="w-3.5 h-3.5 text-stone-300 stroke-[1.5]" />
              </div>
              <p className="text-[10px] text-stone-400 tracking-wider uppercase font-light">
                Senior Client Stylist • Lagos Flagship
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsConciergeOpen(false)}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 bg-white text-xs">
          <button
            onClick={() => setActiveTab('advisory')}
            className={`flex-1 py-3 px-3 text-center uppercase tracking-wider font-medium transition-colors flex items-center justify-center space-x-1.5 ${
              activeTab === 'advisory'
                ? 'border-b-2 border-noir-950 text-noir-950 font-semibold'
                : 'text-stone-500 hover:text-noir-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 stroke-[1.5]" />
            <span>Studio Advisory</span>
          </button>
          {/* Book Private Fitting — coming soon, hidden until space is ready */}
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex-1 py-3 px-3 text-center uppercase tracking-wider font-medium transition-colors flex items-center justify-center space-x-1.5 ${
              activeTab === 'contact'
                ? 'border-b-2 border-noir-950 text-noir-950 font-semibold'
                : 'text-stone-500 hover:text-noir-900'
            }`}
          >
            <Phone className="w-3.5 h-3.5 stroke-[1.5]" />
            <span>Studio Direct</span>
          </button>
        </div>

        {/* Tab 1: Advisory Chat Stream */}
        {activeTab === 'advisory' && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-noir-950 text-white rounded-br-none shadow-sm'
                        : 'bg-white border border-stone-200 text-noir-900 rounded-bl-none shadow-xs'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className={`block text-[9px] mt-1.5 ${msg.sender === 'user' ? 'text-stone-400' : 'text-stone-400'}`}>
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Product recommendations inside message */}
                  {msg.suggestedProductIds && msg.suggestedProductIds.length > 0 && (
                    <div className="mt-2.5 space-y-2 w-full max-w-[90%]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">
                          Curated Studio Pieces:
                        </span>
                        <span className="text-[10px] text-melly-800 font-medium">
                          {products.filter(p => msg.suggestedProductIds?.includes(p.id)).length} Recommended
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        {products
                          .filter(p => msg.suggestedProductIds?.includes(p.id))
                          .map(prod => (
                            <div
                              key={prod.id}
                              className="bg-white p-2.5 rounded-xl border border-stone-200 flex items-center justify-between gap-3 shadow-xs hover:border-noir-950 transition-colors"
                            >
                              <div className="flex items-center space-x-2.5">
                                <img src={prod.images[0]} alt={prod.name} className="w-10 h-12 object-cover rounded-lg" />
                                <div>
                                  <p className="font-serif text-[11px] font-medium text-noir-950 leading-tight">{prod.name}</p>
                                  <p className="text-[10px] text-melly-800 font-semibold">{formatPrice(prod.price)}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsConciergeOpen(false);
                                    setSelectedProduct(prod);
                                  }}
                                  className="p-1.5 border border-stone-200 hover:border-noir-900 rounded-lg text-stone-600 hover:text-noir-950 transition-colors cursor-pointer"
                                  title="Inspect Silhouette"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => addToCart(prod, prod.sizes[0] || 'M', prod.colors[0], 1)}
                                  className="p-1.5 bg-noir-950 hover:bg-melly-900 text-white rounded-lg transition-colors cursor-pointer shadow-xs"
                                  title="Add to Bag"
                                >
                                  <ShoppingBag className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>

                      {msg.suggestedProductIds.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleAddLookToBag(msg.suggestedProductIds!)}
                          className="w-full mt-1.5 py-2 px-3 bg-noir-950 hover:bg-melly-900 text-white text-[10px] uppercase tracking-luxury font-medium rounded-xl flex items-center justify-center space-x-1.5 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-sm"
                        >
                          <Sparkles className="w-3 h-3 text-amber-300" />
                          <span>Add Curated Capsule ({msg.suggestedProductIds.length} Silhouettes) to Bag</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center space-x-2 text-stone-500 text-xs italic bg-white px-3 py-2 rounded-full w-fit border border-stone-200">
                  <span className="w-1.5 h-1.5 bg-stone-500 rounded-full animate-pulse"></span>
                  <span className="w-1.5 h-1.5 bg-stone-500 rounded-full animate-pulse [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-stone-500 rounded-full animate-pulse [animation-delay:0.4s]"></span>
                  <span>Adaeze is responding...</span>
                </div>
              )}
            </div>

            {/* Quick Consultation Chips */}
            <div className="p-2.5 bg-[#F4EFEA] border-t border-stone-200 flex gap-2 overflow-x-auto text-[10px] no-scrollbar">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1.5 bg-white border border-stone-300 rounded-full text-stone-700 hover:border-noir-900 hover:text-noir-950 shrink-0 font-medium transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-stone-200 flex items-center space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                placeholder="Ask about fabric weight, gala dress codes, sizing..."
                className="flex-1 text-xs px-3.5 py-2.5 bg-[#FAF8F5] border border-stone-300 rounded-full focus:outline-none focus:border-noir-950 text-noir-900 placeholder:text-stone-400 font-light"
              />
              <button
                onClick={() => handleSendMessage()}
                className="p-2.5 bg-noir-950 hover:bg-stone-800 text-white rounded-full transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Book Private Appointment */}
        {activeTab === 'appointment' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
            {bookingConfirmed ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h4 className="font-serif text-xl text-noir-950">Studio Appointment Reserved</h4>
                <p className="text-stone-600 max-w-sm mx-auto font-light leading-relaxed">
                  We look forward to welcoming you. A private confirmation and salon itinerary have been dispatched to <strong>{appointmentData.email}</strong>.
                </p>
                <div className="bg-white p-4 rounded-xl border border-stone-200 max-w-md mx-auto text-left space-y-2">
                  <p><strong>Location:</strong> {appointmentData.location}</p>
                  <p><strong>Service:</strong> {appointmentData.service}</p>
                  <p><strong>Date & Time:</strong> {appointmentData.date} at {appointmentData.time}</p>
                  <p><strong>Private Stylist:</strong> Adaeze Okafor</p>
                </div>
                <button
                  onClick={() => setBookingConfirmed(false)}
                  className="px-5 py-2.5 bg-noir-950 text-white text-xs uppercase tracking-luxury font-medium rounded hover:bg-stone-800 transition-colors"
                >
                  Book Another Session
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookAppointment} className="space-y-4">
                <div>
                  <h4 className="font-serif text-lg text-noir-950">Private Fitting & Wardrobe Curation</h4>
                  <p className="text-stone-500 font-light text-[11px] mt-0.5">
                    Reserve dedicated salon time with Adaeze Okafor at our flagship or via private high-definition video.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-stone-500 font-semibold mb-1">
                      Salon Location / Mode
                    </label>
                    <select
                      value={appointmentData.location}
                      onChange={(e) => setAppointmentData({ ...appointmentData, location: e.target.value })}
                      className="w-full p-2.5 bg-white border border-stone-300 rounded text-noir-900 focus:outline-none focus:border-noir-950"
                    >
                      <option>MellyStore Studio (18 Rue du Faubourg Saint-Honoré)</option>
                      <option>London Mayfair Showroom (42 Mount Street)</option>
                      <option>Private 1-on-1 Virtual Video Consultation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-stone-500 font-semibold mb-1">
                      Curation Service
                    </label>
                    <select
                      value={appointmentData.service}
                      onChange={(e) => setAppointmentData({ ...appointmentData, service: e.target.value })}
                      className="w-full p-2.5 bg-white border border-stone-300 rounded text-noir-900 focus:outline-none focus:border-noir-950"
                    >
                      <option>Gala & Eveningwear Consultation</option>
                      <option>Seasonal Capsule Wardrobe Curation</option>
                      <option>Bridal & Black-Tie Dressing</option>
                      <option>Bespoke Silk & Tailoring Measurements</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-stone-500 font-semibold mb-1">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        required
                        value={appointmentData.date}
                        onChange={(e) => setAppointmentData({ ...appointmentData, date: e.target.value })}
                        className="w-full p-2.5 bg-white border border-stone-300 rounded text-noir-900 focus:outline-none focus:border-noir-950"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-stone-500 font-semibold mb-1">
                        Preferred Time
                      </label>
                      <select
                        value={appointmentData.time}
                        onChange={(e) => setAppointmentData({ ...appointmentData, time: e.target.value })}
                        className="w-full p-2.5 bg-white border border-stone-300 rounded text-noir-900 focus:outline-none focus:border-noir-950"
                      >
                        <option>10:00 AM</option>
                        <option>11:30 AM</option>
                        <option>14:00 PM</option>
                        <option>15:30 PM</option>
                        <option>17:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-stone-500 font-semibold mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={appointmentData.name}
                        onChange={(e) => setAppointmentData({ ...appointmentData, name: e.target.value })}
                        className="w-full p-2.5 bg-white border border-stone-300 rounded text-noir-900 focus:outline-none focus:border-noir-950"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-stone-500 font-semibold mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={appointmentData.email}
                        onChange={(e) => setAppointmentData({ ...appointmentData, email: e.target.value })}
                        className="w-full p-2.5 bg-white border border-stone-300 rounded text-noir-900 focus:outline-none focus:border-noir-950"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-stone-500 font-semibold mb-1">
                      Styling Preferences / Occasion Notes
                    </label>
                    <textarea
                      rows={2}
                      value={appointmentData.notes}
                      onChange={(e) => setAppointmentData({ ...appointmentData, notes: e.target.value })}
                      placeholder="Tell us about the upcoming event, size preferences, or silhouettes of interest..."
                      className="w-full p-2.5 bg-white border border-stone-300 rounded text-noir-900 focus:outline-none focus:border-noir-950 font-light"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-noir-950 hover:bg-stone-800 text-white text-xs uppercase tracking-luxury font-medium rounded transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Confirm Studio Appointment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        )}

        {/* Tab 3: Direct Contact */}
        {activeTab === 'contact' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs font-light text-stone-700">
            <div>
              <h4 className="font-serif text-lg text-noir-950 font-normal">Direct Studio Communication</h4>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Our private client advisors are reachable via telephone, WhatsApp, or at our flagship boutiques.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center space-x-2 text-noir-950 font-medium">
                  <Phone className="w-4 h-4 text-stone-600 stroke-[1.5]" />
                  <span className="font-serif text-sm">MellyStore Studio Telephone</span>
                </div>
                <p className="text-stone-600 font-mono text-xs">08166612115</p>
                <p className="text-[10px] text-stone-400">Available Monday through Saturday, 9:00 AM – 7:00 PM WAT.</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center space-x-2 text-noir-950 font-medium">
                  <MessageSquare className="w-4 h-4 text-emerald-600 stroke-[1.5]" />
                  <span className="font-serif text-sm">WhatsApp Client Advisory</span>
                </div>
                <p className="text-stone-600 text-xs">Direct encrypted messaging with our Lagos styling desk.</p>
                <a
                  href="https://wa.me/2348166612115?text=Hello%20MellyStore%20Concierge"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs uppercase tracking-wider font-semibold transition-colors"
                >
                  Open WhatsApp Chat
                </a>
              </div>

              <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center space-x-2 text-noir-950 font-medium">
                  <MapPin className="w-4 h-4 text-stone-600 stroke-[1.5]" />
                  <span className="font-serif text-sm">Boutique Address</span>
                </div>
                <p className="text-stone-600 text-xs leading-relaxed">
                  <strong>Lagos:</strong> Victoria Island, Lagos, Nigeria
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
