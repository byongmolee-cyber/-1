import React from 'react';
import { motion } from 'motion/react';
import { Download, Heart, Share2 } from 'lucide-react';

interface ImageItem {
  id: string;
  url: string;
  prompt?: string;
  type: 'sample' | 'user';
}

interface ImageGalleryProps {
  images: ImageItem[];
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((image, index) => (
        <motion.div
          key={image.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group relative aspect-square bg-white/5 rounded-2xl overflow-hidden border border-white/10"
        >
          <img
            src={image.url}
            alt={image.prompt || 'Nano Banana Art'}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
            {image.prompt && (
              <p className="text-white text-sm mb-4 line-clamp-2 font-medium">
                "{image.prompt}"
              </p>
            )}
            
            <div className="flex items-center gap-3">
              <button className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                <Heart className="w-4 h-4" />
              </button>
              <button className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
              <a 
                href={image.url} 
                download={`nano-banana-${image.id}.png`}
                className="ml-auto p-2 bg-yellow-400 hover:bg-yellow-500 rounded-full text-black transition-colors"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          {image.type === 'user' && (
            <div className="absolute top-4 left-4 bg-yellow-400 text-black text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              Your Creation
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};
