import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Banana, 
  Upload, 
  Image as ImageIcon, 
  Sparkles, 
  ChevronRight, 
  Github, 
  Twitter, 
  Instagram,
  Plus,
  X
} from 'lucide-react';
import { ImageGenerator } from './components/ImageGenerator';
import { ImageGallery } from './components/ImageGallery';
import { VideoAd } from './components/VideoAd';
import { generateImage } from './services/gemini';

interface ImageItem {
  id: string;
  url: string;
  prompt?: string;
  type: 'sample' | 'user';
}

export default function App() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isGeneratingSamples, setIsGeneratingSamples] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Generate some initial sample images
    const loadSamples = async () => {
      try {
        const samplePrompts = [
          "A majestic grizzly bear sitting in a magical forest, gently holding a glowing golden Nano Banana, cinematic lighting, 4k.",
          "A vibrant 3D render of a banana wearing futuristic sunglasses and a leather jacket, neon background.",
          "A surreal oil painting of a giant banana floating over a futuristic city at sunset.",
          "A minimalist geometric art of a banana sliced into colorful cubes, high contrast."
        ];
        
        const sampleImages: ImageItem[] = await Promise.all(
          samplePrompts.map(async (prompt, i) => {
            try {
              const url = await generateImage(prompt);
              return { id: `sample-${i}`, url, prompt, type: 'sample' };
            } catch (e) {
              // Fallback to picsum if generation fails
              return { 
                id: `sample-${i}`, 
                url: `https://picsum.photos/seed/banana-${i}/800/800`, 
                prompt: "Sample Banana Art", 
                type: 'sample' 
              };
            }
          })
        );
        
        setImages(sampleImages);
      } catch (err) {
        console.error("Failed to load samples", err);
      } finally {
        setIsGeneratingSamples(false);
      }
    };

    loadSamples();
  }, []);

  const handleImageGenerated = (url: string) => {
    const newImage: ImageItem = {
      id: Date.now().toString(),
      url,
      type: 'user'
    };
    setImages(prev => [newImage, ...prev]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage: ImageItem = {
          id: Date.now().toString(),
          url: reader.result as string,
          type: 'user'
        };
        setImages(prev => [newImage, ...prev]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-yellow-400 selection:text-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/20">
              <Banana className="w-6 h-6 text-black" />
            </div>
            <span className="text-xl font-bold tracking-tight">NANO BANANA</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            <a href="#gallery" className="hover:text-white transition-colors">Gallery</a>
            <a href="#create" className="hover:text-white transition-colors">Create</a>
            <a href="#video" className="hover:text-white transition-colors">Commercial</a>
          </div>

          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 transition-all border border-white/10"
          >
            <Upload className="w-4 h-4" />
            Upload Your Art
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept="image/*"
          />
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl aspect-square bg-yellow-400/10 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-yellow-400 text-xs font-bold tracking-widest uppercase mb-8"
          >
            <Sparkles className="w-3 h-3" />
            Powered by Gemini 2.5 Flash
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]"
          >
            ART BEYOND <br />
            <span className="text-yellow-400">IMAGINATION.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12"
          >
            The world's first AI art studio dedicated to the Nano Banana aesthetic. 
            Generate, showcase, and experience the future of creative intelligence.
          </motion.p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 space-y-32 pb-32">
        {/* Video Ad Section */}
        <section id="video" className="scroll-mt-32">
          <VideoAd />
        </section>

        {/* Creation Section */}
        <section id="create" className="scroll-mt-32 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Unleash Your <br />Creative Power</h2>
            <p className="text-white/60 mb-8 text-lg">
              Our advanced Nano Banana model understands your vision. 
              Simply describe what you want to see, and watch it come to life in seconds.
            </p>
            <div className="space-y-4">
              {[
                "Instant High-Resolution Generation",
                "Advanced Style Consistency",
                "Futuristic Nano Banana Aesthetic"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-white/80">
                  <div className="w-5 h-5 rounded-full bg-yellow-400/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  </div>
                  {feature}
                </div>
              ))}
            </div>
          </div>
          <ImageGenerator onImageGenerated={handleImageGenerated} />
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="scroll-mt-32">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-4">The Collection</h2>
              <p className="text-white/60">A curated showcase of Nano Banana masterpieces</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors">
                Newest
              </button>
              <button className="px-4 py-2 rounded-full bg-yellow-400 text-black text-sm font-bold">
                Popular
              </button>
            </div>
          </div>

          {isGeneratingSamples ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-square bg-white/5 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <ImageGallery images={images} />
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <Banana className="w-8 h-8 text-yellow-400" />
              <span className="text-2xl font-bold tracking-tight">NANO BANANA</span>
            </div>
            <p className="text-white/40 text-sm max-w-xs text-center md:text-left">
              Pushing the boundaries of AI art and video generation. Built with passion for the future.
            </p>
          </div>
          
          <div className="flex gap-6">
            <a href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all">
              <Github className="w-5 h-5" />
            </a>
          </div>
          
          <div className="text-white/40 text-sm">
            © 2026 Nano Banana Studio. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
