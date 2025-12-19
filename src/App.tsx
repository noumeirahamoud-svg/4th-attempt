
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import { DayPlan, Activity } from './types';
import { generateHeroImage, getTeenInsight } from './services/geminiService';
import Spinner from './components/Spinner';

const DESSERT_DATA = [
  {
    title: "Eileen’s Special Cheesecake",
    address: "17 Cleveland Pl, Manhattan, NY 10012",
    atmosphere: "Charming & Historic",
    description: "Since 1975, Eileen has been serving what many call the best cheesecake in the world. It’s light, airy, and served in individual portions—perfect for trying multiple flavors.",
    signature: "Classic Plain or Strawberry Topped Cheesecake"
  },
  {
    title: "Magnolia Bakery",
    address: "W 11th St & Bleecker St (Original) or Rockefeller Center",
    atmosphere: "Classic Americana",
    description: "A global icon made famous by 'Sex and the City.' While their cupcakes are legendary, the cult favorite that teens obsess over is the rich, creamy banana pudding.",
    signature: "World-Famous Banana Pudding"
  }
];

const ITINERARY_DATA: DayPlan[] = [
  {
    dayNumber: 1,
    title: "Midtown Icons & Holiday Magic",
    atmosphere: "Festive, cinematic, unmistakably New York",
    activities: [
      {
        timeSlot: "Morning",
        title: "Grand Central & Bryant Park",
        atmosphere: "Historic Grandeur",
        signature: "Begin at Grand Central Terminal (celestial ceiling). Walk to Bryant Park Winter Village for seasonal stalls, hot chocolate, and the ice rink. Quick stop at NY Public Library.",
        slowPaceAlt: "Spend more time at Bryant Park and skip the Library; focus solely on the holiday market vibe.",
        transport: "NJ Transit to Penn Station (34th St) or PATH to 33rd St. From there, take the Q/R/W or walk 10 mins east to Grand Central."
      },
      {
        timeSlot: "Lunch",
        title: "Don Antonio Pizza",
        atmosphere: "Authentic & Lively",
        signature: "Head to Don Antonio (309 West 50th Street) for world-class Neapolitan pizza. It's a vibrant, high-quality spot that teenagers love and perfectly bridges the gap between Bryant Park and Rockefeller Center.",
        slowPaceAlt: "Enjoy a relaxed sit-down lunch at Don Antonio; the proximity to your afternoon stops ensures no rushing.",
        transport: "15-min festive walk north-west through the Theater District. If too cold, a 5-min Uber is the easiest door-to-door option."
      },
      {
        timeSlot: "Afternoon",
        title: "Rockefeller Center & Fifth Avenue",
        atmosphere: "The Core of Christmas",
        signature: "Visit the Rockefeller Christmas Tree. Ascend 'Top of the Rock' for skyline views (pre-booked). Stroll Fifth Avenue window displays and Nike/Apple/FAO Schwarz flagships.",
        slowPaceAlt: "Skip the observation deck; focus on street-level magic: the tree, windows, and light shopping.",
        transport: "8-min walk east. This area is best explored on foot to catch the iconic holiday window displays."
      },
      {
        timeSlot: "Evening",
        title: "Broadway District & Joe's Pizza",
        atmosphere: "Electric",
        signature: "Dinner in Hell’s Kitchen followed by a Broadway show. For a truly iconic, fast-paced NY experience, grab a legendary slice at Joe’s Pizza (1435 Broadway) before the curtain rises.",
        eveningAlt: "Enjoy a relaxed dinner and a short, intentional walk through Times Square to see the lights without lingering.",
        transport: "Short walk to your theater. Return via NJ Transit from Penn Station or PATH from 33rd St back to NJ."
      }
    ]
  },
  {
    dayNumber: 2,
    title: "Downtown Landmarks & Village Life",
    atmosphere: "Historic, architectural, vibrant",
    activities: [
      {
        timeSlot: "Morning",
        title: "Statue of Liberty or Skyline Cruise",
        atmosphere: "Iconic",
        signature: "Morning ferry to Statue of Liberty and Ellis Island.",
        slowPaceAlt: "Take the Staten Island Ferry for exceptional skyline and Statue views. For a local legend, take a 15-min Uber from the ferry to Denino’s Pizzeria & Tavern (524 Port Richmond Ave) for a thin-crust pie.",
        transport: "Take the PATH train directly to World Trade Center. From the Oculus, it's a scenic 10-min walk south to the Battery park ferries."
      },
      {
        timeSlot: "Late Morning",
        title: "9/11 Memorial & Oculus",
        atmosphere: "Reflective & Modern",
        signature: "Visit the 9/11 Memorial pools for reflection, then explore the Oculus—a striking architectural space with indoor shopping.",
        slowPaceAlt: "Focus on the Oculus only to stay warm and save energy.",
        transport: "5-min walk north from the Battery. The Oculus is your primary transit hub back to NJ later tonight."
      },
      {
        timeSlot: "Lunch",
        title: "The Village Pizza Pilgrimage",
        atmosphere: "Legendary NY Pizza",
        signature: "Head to John’s of Bleecker Street (278 Bleecker St). It’s a coal-fired institution with no slices, only whole pies, and a classic NY vibe that teens find genuinely 'cool'.",
        slowPaceAlt: "Grab a quick but famous bite at the original Joe's Pizza on Carmine St if you prefer a slice on the go.",
        transport: "Subway (A/C/E) from WTC to W 4th St. This is a quick 2-stop ride and drops you in the heart of the Village."
      },
      {
        timeSlot: "Evening",
        title: "The Gourmet Choice: DUMBO, Cosme, or Eataly",
        atmosphere: "Upscale & Atmospheric",
        signature: "Walk the Brooklyn Bridge at sunset. For dinner, choose between skyline views in DUMBO, refined contemporary Mexican at Cosme (Flatiron), or the vibrant food halls of Eataly (Flatiron).",
        isOptional: true,
        eveningAlt: "If cold/windy, stay in the Flatiron district for a sophisticated meal at Cosme or an interactive dining experience at Eataly.",
        transport: "Walk the Bridge (40 mins) to DUMBO. To return to NJ, take the A/C train back to WTC for the PATH or an Uber to Penn Station."
      }
    ]
  },
  {
    dayNumber: 3,
    title: "The High Line & Final Stops",
    atmosphere: "Contemporary, creative, relaxed",
    activities: [
      {
        timeSlot: "Morning",
        title: "The High Line",
        atmosphere: "Elevated",
        signature: "Begin at Hudson Yards and walk the High Line, an elevated park with winter art and river views. Exit near Chelsea.",
        slowPaceAlt: "Walk only a short section or skip if the weather is unfavorable.",
        transport: "NJ Transit to Penn Station. Hudson Yards is a 5-min walk west from the 31st St/8th Ave exit. Perfect for NJ families."
      },
      {
        timeSlot: "Lunch / Departure Meal",
        title: "Chelsea Market & Xi’an Famous Foods",
        atmosphere: "Gourmet Hall & Local Spice",
        signature: "Lunch at Chelsea Market food hall. For a high-flavor alternative, head to Xi’an Famous Foods (328 8th Ave) for their world-famous spicy cumin lamb noodles.",
        slowPaceAlt: "Browse Chelsea Market's unique shops and grab a light, quick snack before heading to the airport or train station.",
        transport: "Walkable from the High Line exit. For the return to NJ, walk 10 mins back to Penn Station or catch an Uber from Chelsea."
      }
    ]
  }
];

const App: React.FC = () => {
  const [isSlowPace, setIsSlowPace] = useState(false);
  const [heroImage, setHeroImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<Record<string, string>>({});
  const [insightLoading, setInsightLoading] = useState<string | null>(null);
  const [showShareToast, setShowShareToast] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const img = await generateHeroImage();
        setHeroImage(img);
      } catch (e) {
        console.error("Hero generation failed", e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleGetInsight = async (location: string) => {
    if (insights[location]) return;
    setInsightLoading(location);
    try {
      const tip = await getTeenInsight(location);
      setInsights(prev => ({ ...prev, [location]: tip }));
    } catch (e) {
      console.error(e);
    } finally {
      setInsightLoading(null);
    }
  };

  const handleGeneratePDF = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-zinc-50">
        <Spinner />
        <p className="mt-4 text-zinc-400 font-medium tracking-widest uppercase animate-pulse">Designing your journey...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-['Inter'] text-zinc-900 selection:bg-red-100 selection:text-red-900">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[65vh] overflow-hidden group">
        <img 
          src={heroImage || 'https://images.unsplash.com/photo-1546702289-506d98833799?auto=format&fit=crop&q=80&w=2000'} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
          alt="NYC Winter"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-12 left-0 right-0 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block bg-red-600 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest mb-4">Travel Philosophy</div>
            <h2 className="text-3xl md:text-4xl font-light text-white leading-relaxed max-w-2xl italic">
              "Capture New York’s most iconic moments during its most magical season, while avoiding exhaustion during the busiest week of the year."
            </h2>
          </div>
        </div>
      </section>

      {/* Control Bar */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-zinc-100 py-4 shadow-sm">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-6 items-center overflow-x-auto scrollbar-hide no-print">
            {[1, 2, 3].map(d => (
              <a key={d} href={`#day-${d}`} className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors whitespace-nowrap">Day {d}</a>
            ))}
            <a href="#desserts" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-red-600 transition-colors whitespace-nowrap">Desserts</a>
          </div>
          
          <div className="flex items-center gap-4 md:gap-6 no-print">
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-bold uppercase tracking-tighter ${!isSlowPace ? 'text-zinc-900' : 'text-zinc-400'}`}>Full</span>
              <button 
                onClick={() => setIsSlowPace(!isSlowPace)}
                className="relative inline-flex h-5 w-10 items-center rounded-full bg-zinc-200 transition-colors focus:outline-none"
              >
                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${isSlowPace ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
              <span className={`text-[10px] font-bold uppercase tracking-tighter ${isSlowPace ? 'text-red-600' : 'text-zinc-400'}`}>Slow</span>
            </div>

            <div className="h-4 w-px bg-zinc-200 hidden md:block" />

            <div className="flex items-center gap-2">
              <button 
                onClick={handleShare}
                className="flex items-center justify-center p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-all"
                title="Copy Link"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
              </button>
              
              <button 
                onClick={handleGeneratePDF}
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white bg-zinc-900 px-5 py-2.5 rounded-full hover:bg-red-600 transition-all shadow-md"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                PDF Guide
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Share Toast */}
      {showShareToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full shadow-2xl animate-fade-in no-print">
          Link copied to clipboard
        </div>
      )}

      {/* Itinerary Timeline */}
      <main className="container mx-auto px-6 py-20 max-w-5xl">
        {ITINERARY_DATA.map((day) => (
          <div key={day.dayNumber} id={`day-${day.dayNumber}`} className="mb-24 last:mb-0">
            <div className="flex items-baseline gap-4 mb-12">
              <span className="text-7xl font-black text-zinc-100 tabular-nums select-none">0{day.dayNumber}</span>
              <div>
                <h3 className="text-4xl font-bold text-zinc-900 tracking-tight">{day.title}</h3>
                <p className="text-sm text-zinc-500 uppercase tracking-widest font-semibold mt-1">{day.atmosphere}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 relative">
              <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-px bg-zinc-100 -translate-x-1/2 no-print" />
              
              {day.activities.map((activity, idx) => (
                <div 
                  key={idx} 
                  className={`relative flex flex-col ${idx % 2 === 0 ? 'md:items-end md:text-right' : 'md:items-start md:text-left'}`}
                >
                  <div className={`
                    p-8 rounded-[2rem] border transition-all duration-500 max-w-md w-full
                    ${isSlowPace && activity.slowPaceAlt ? 'bg-red-50/30 border-red-100 ring-1 ring-red-50' : 'bg-white border-zinc-100 hover:border-zinc-300 shadow-sm hover:shadow-xl'}
                  `}>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{activity.timeSlot}</span>
                      {activity.transport && (
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 bg-zinc-50 px-2.5 py-1 rounded-full border border-zinc-100 no-print">
                          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                          Transit
                        </span>
                      )}
                    </div>

                    <h4 className="text-2xl font-bold mb-3 text-zinc-900 tracking-tight">{activity.title}</h4>
                    <p className="text-zinc-600 text-[15px] leading-relaxed mb-6">
                      {isSlowPace && activity.slowPaceAlt ? activity.slowPaceAlt : activity.signature}
                    </p>
                    
                    {activity.transport && (
                      <div className="mb-6 p-4 bg-zinc-50 rounded-2xl border border-zinc-100/50 text-left">
                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block mb-1">Commuter Tip</span>
                        <p className="text-[11px] text-zinc-500 leading-normal">{activity.transport}</p>
                      </div>
                    )}

                    {activity.eveningAlt && !isSlowPace && (
                        <div className="mt-4 pt-4 border-t border-zinc-100 text-[12px] text-zinc-400 italic">
                          Evening Option: {activity.eveningAlt}
                        </div>
                    )}

                    <button 
                      onClick={() => handleGetInsight(activity.title)}
                      disabled={!!insightLoading}
                      className="mt-6 inline-flex items-center text-[11px] font-black uppercase tracking-[0.15em] text-red-600 hover:text-red-800 transition-colors no-print"
                    >
                      {insightLoading === activity.title ? 'Consulting Gemini...' : 'Insider Tips'}
                      <svg className="w-3.5 h-3.5 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
                    </button>

                    {insights[activity.title] && (
                      <div className="mt-6 p-5 bg-zinc-900 text-zinc-300 rounded-2xl text-[13px] text-left border border-zinc-800 animate-fade-in whitespace-pre-line leading-relaxed shadow-inner">
                        <span className="text-[9px] font-black text-red-500 uppercase tracking-widest block mb-3 border-b border-zinc-800 pb-2">Verified Insider Insight</span>
                        {insights[activity.title]}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Dessert Section */}
        <section id="desserts" className="mt-32 mb-32">
          <div className="flex flex-col items-center mb-16 text-center">
            <span className="text-red-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4">The Sweet Finish</span>
            <h3 className="text-5xl font-black text-zinc-900 tracking-tight">Iconic Dessert Stops</h3>
            <p className="text-zinc-500 mt-4 max-w-md">No NYC journey is complete without these legendary sugar rushes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {DESSERT_DATA.map((dessert, idx) => (
              <div key={idx} className="bg-zinc-50 rounded-[3rem] p-12 border border-zinc-100 hover:border-red-100 transition-all group hover:shadow-2xl">
                <span className="text-[10px] font-bold uppercase tracking-widest text-red-500 mb-2 block">{dessert.atmosphere}</span>
                <h4 className="text-3xl font-bold text-zinc-900 mb-2">{dessert.title}</h4>
                <p className="text-[12px] text-zinc-400 font-bold uppercase tracking-tighter mb-8">{dessert.address}</p>
                <p className="text-zinc-600 text-base leading-relaxed mb-8 italic">"{dessert.description}"</p>
                
                <div className="bg-white rounded-2xl p-6 border border-zinc-100 mb-8 shadow-sm">
                  <span className="text-[10px] font-black uppercase text-zinc-400 block mb-1">Must Order</span>
                  <span className="text-lg font-bold text-zinc-800">{dessert.signature}</span>
                </div>

                <button 
                  onClick={() => handleGetInsight(dessert.title)}
                  disabled={!!insightLoading}
                  className="inline-flex items-center text-[11px] font-black uppercase tracking-[0.15em] text-zinc-900 hover:text-red-600 transition-colors no-print"
                >
                  {insightLoading === dessert.title ? 'Consulting Gemini...' : 'Insider Tips'}
                  <svg className="w-3.5 h-3.5 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
                </button>

                {insights[dessert.title] && (
                  <div className="mt-6 p-6 bg-white rounded-2xl text-[13px] text-zinc-600 border border-zinc-200 animate-fade-in whitespace-pre-line leading-relaxed shadow-xl text-left">
                    <span className="text-[9px] font-black text-red-600 uppercase tracking-widest block mb-2">Insider Tip</span>
                    {insights[dessert.title]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Departure Add-on */}
        <div className="mt-32 p-16 bg-zinc-900 rounded-[4rem] text-white shadow-2xl relative overflow-hidden no-print">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M11 1.07c-3.66.44-6.63 3.34-7.14 7.01-.13.91-.13 1.83 0 2.74.5 3.67 3.48 6.57 7.14 7.01.91.13 1.83.13 2.74 0 3.66-.44 6.63-3.34 7.14-7.01.13-.91.13-1.83 0-2.74-.5-3.67-3.48-6.57-7.14-7.01-.91-.13-1.83-.13-2.74 0zm1.75 12.18l-1.75-1.75-1.75 1.75c-.29.29-.77.29-1.06 0s-.29-.77 0-1.06l1.75-1.75-1.75-1.75c-.29-.29-.29-.77 0-1.06s.77-.29 1.06 0l1.75 1.75 1.75-1.75c.29-.29.77-.29 1.06 0s.29.77 0 1.06l-1.75 1.75 1.75 1.75c.29.29.29.77 0 1.06s-.77.29-1.06 0z"/></svg>
          </div>
          <div className="max-w-2xl relative z-10">
            <span className="text-red-500 font-black uppercase tracking-[0.3em] text-[10px]">Optional Departure</span>
            <h3 className="text-5xl font-bold mt-4 mb-8 italic tracking-tight">Woodbury Common Outlets</h3>
            <p className="text-zinc-400 text-lg leading-relaxed mb-10">
              Perfect for brand-focused families. Located 1 hour outside NYC, offering world-class designer brands at outlet pricing. Best visited via private car for a quick morning shopping sprint.
            </p>
            <div className="flex gap-6">
              <div className="flex-1 p-6 bg-white/5 rounded-3xl border border-white/10 text-center">
                <span className="block text-2xl font-bold mb-1">2.5 hrs</span>
                <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Target Window</span>
              </div>
              <div className="flex-1 p-6 bg-white/5 rounded-3xl border border-white/10 text-center">
                <span className="block text-2xl font-bold mb-1">Outlet</span>
                <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Pricing</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-24 text-center border-t border-zinc-50 bg-zinc-50/50">
        <div className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">New York City 2025</div>
        <p className="text-zinc-400 text-xs">Curated for an Unforgettable Winter Experience</p>
      </footer>
    </div>
  );
};

export default App;
