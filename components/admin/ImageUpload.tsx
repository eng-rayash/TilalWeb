'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
}

export default function ImageUpload({ value, onChange, label, placeholder }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('يرجى اختيار ملف صورة صالح (PNG, JPG, WebP...)');
      return;
    }

    // Validate size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      setError('حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 8 ميجابايت');
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'حدث خطأ أثناء رفع الصورة');
      }

      onChange(data.url);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'فشل رفع الصورة، يرجى المحاولة مرة أخرى');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2" dir="rtl">
      {label && <label className="text-neutral-400 text-xs font-bold block mb-2">{label}</label>}
      
      {value ? (
        // Preview state
        <div className="relative rounded-xl overflow-hidden bg-neutral-800 border border-white/10 aspect-video group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Uploaded preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-neutral-900 rounded-lg text-xs font-bold hover:bg-neutral-100 transition-colors"
            >
              تغيير الصورة
            </button>
            <button
              type="button"
              onClick={removeImage}
              className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        // Upload trigger state
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:border-amber-500/50 hover:bg-white/2 ${
            uploading ? 'border-amber-500/30 bg-white/1 pointer-events-none' : 'border-white/10'
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
              <p className="text-neutral-400 text-xs font-bold">جاري رفع الصورة إلى ImageKit...</p>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-neutral-800 border border-white/5 flex items-center justify-center">
                <Upload className="w-5 h-5 text-neutral-400" />
              </div>
              <div className="text-center">
                <p className="text-white text-xs font-bold">اضغط لرفع صورة</p>
                <p className="text-neutral-500 text-[10px] mt-1">أو اسحب وأسقط الملف هنا (PNG, JPG, WebP حتى 8MB)</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Manual URL Input fallback / helper */}
      <div className="mt-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "أو أدخل رابط الصورة المباشر هنا..."}
          className="w-full bg-neutral-800 border border-white/10 text-white rounded-xl px-4 py-2 text-xs placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 transition-all font-mono"
        />
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {error && (
        <p className="text-red-400 text-[11px] font-bold mt-1">⚠️ {error}</p>
      )}
    </div>
  );
}
