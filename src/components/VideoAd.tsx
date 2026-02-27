import React, { useState, useEffect } from 'react';
import { generateVideo, checkApiKey, openApiKeySelector } from '../services/gemini';
import { Play, Loader2, Video, Key, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const VideoAd: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkApiKey().then(setHasKey);
  }, []);

  const handleGenerateAd = async () => {
    if (!hasKey) {
      await openApiKeySelector();
      setHasKey(true);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Prompt for a phone ad featuring Nano Banana
      const prompt = "A high-end cinematic commercial for a futuristic smartphone called 'Nano Banana Phone'. The phone is sleek, yellow-tinted, and features a glowing banana logo. It's being held by a stylish person in a neon-lit city. High quality, 4k, professional lighting.";
      const url = await generateVideo(prompt, "16:9");
      setVideoUrl(url);
    } catch (err: any) {
      if (err.message?.includes("Requested entity was not found")) {
        setHasKey(false);
        setError("API Key session expired. Please select your key again.");
      } else {
        setError("Failed to generate video. This can take a few minutes.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
      <div className="p-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Nano Banana Mobile</h2>
        <p className="text-white/60 mb-6">Experience the future of mobile technology</p>

        <div className="relative aspect-video bg-white/5 rounded-2xl flex items-center justify-center overflow-hidden group">
          <AnimatePresence mode="wait">
            {videoUrl ? (
              <motion.video
                key="video"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={videoUrl}
                controls
                className="w-full h-full object-cover"
              />
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4"
              >
                {loading ? (
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-yellow-400 animate-spin" />
                    <div className="space-y-2">
                      <p className="text-white font-medium">Generating cinematic ad...</p>
                      <p className="text-white/40 text-sm">This usually takes about 1-2 minutes</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <Video className="w-16 h-16 text-white/20" />
                    <button
                      onClick={handleGenerateAd}
                      className="bg-white text-black px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-yellow-400 transition-colors"
                    >
                      {!hasKey ? <Key className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      {!hasKey ? "Connect API Key to Start" : "Generate Commercial"}
                    </button>
                    {!hasKey && (
                      <p className="text-white/40 text-xs max-w-xs">
                        Video generation requires a paid Google Cloud project API key. 
                        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline ml-1">Learn more</a>
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          
          {error && (
            <div className="absolute bottom-4 left-4 right-4 bg-red-500/20 border border-red-500/50 backdrop-blur-md p-3 rounded-xl flex items-center gap-2 text-red-200 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
