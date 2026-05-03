"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { FiDownload, FiX, FiMaximize2, FiImage, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface EventGalleryProps {
    images: string[];
    title: string;
}

export const EventGallery: React.FC<EventGalleryProps> = ({ images, title }) => {
    const [isOpen, setIsOpen] = useState(false);

    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!images || images.length === 0) return null;

    const displayImages = images.slice(0, 8);
    const hasMore = images.length > 8;
    const moreCount = images.length - 8;

    const handleDownload = async (url: string, filename: string) => {
        try {
            const response = await fetch(url, { mode: 'cors' });
            if (!response.ok) throw new Error('Network response was not ok');
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename || 'image.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Download failed, falling back to new tab:", error);
            // Fallback for CORS issues: open in new tab
            window.open(url, '_blank');
            toast.success("Opening image in new tab for download...");
        }
    };

    const handleDownloadAll = async () => {
        toast.loading("Preparing downloads...", { id: 'download-all' });
        try {
            for (let i = 0; i < images.length; i++) {
                const url = images[i];
                const name = `${title.replace(/\s+/g, '_')}_${i + 1}.jpg`;
                // We don't await to avoid total blockage, but we space them
                setTimeout(() => handleDownload(url, name), i * 300);
            }
            toast.success("Processing all downloads...", { id: 'download-all' });
        } catch (err) {
            toast.error("Bulk download encountered an issue.", { id: 'download-all' });
        }
    };

    return (
        <>
            <section className="space-y-6 pt-6">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                    <h3 className="titleHeader text-xl md:text-2xl uppercase text-gray-900">Journey Gallery</h3>
                    {hasMore && (
                        <button
                            onClick={() => setIsOpen(true)}
                            className="text-xs font-bold text-primary hover:underline flex items-center gap-1 uppercase tracking-widest"
                        >
                            View All <FiArrowRight />
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    {displayImages.map((img, idx) => (
                        <div
                            key={idx}
                            onClick={() => setIsOpen(true)}
                            className={`relative rounded-xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-lg transition-all duration-500 ${idx === 0 ? "md:col-span-2 md:row-span-2 aspect-[16/9] md:aspect-auto" : "aspect-square"
                                }`}
                        >
                            <Image src={img} alt={`Gallery ${idx}`} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                                <FiMaximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity scale-75 group-hover:scale-100 duration-300" size={24} />
                            </div>

                            {idx === 7 && hasMore && (
                                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white backdrop-blur-[2px]">
                                    <span className="text-2xl font-black italic">+{moreCount}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest">More Shots</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Gallery Overlay / Bottom Sheet */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-end justify-center p-0">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/55 backdrop-blur-md animate-in fade-in duration-300"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Content Container */}
                    <div className="relative w-full max-w-[1400px] h-full md:h-[90vh] bg-white rounded-t-[2rem]  shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-500  overflow-y-auto">

                        {/* Header */}
                        <div className="flex-none p-6 md:p-8 flex items-center justify-between border-b border-gray-100 bg-white z-10">
                            <div>
                                <h2 className="text-lg md:text-2xl font-black italic uppercase tracking-tighter text-gray-900 leading-none">{title}</h2>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                                    <FiImage className="text-primary" /> {images.length} Captures
                                </p>
                            </div>
                            <div className="flex items-center gap-2 md:gap-4">
                                <button
                                    onClick={handleDownloadAll}
                                    className="hidden sm:flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] hover:bg-black transition-all shadow-lg"
                                >
                                    <FiDownload /> Download All
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-3 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-all"
                                >
                                    <FiX size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Scrollable Area */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <div className="p-4 md:p-8">
                                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                                    {images.map((img, idx) => (
                                        <div key={idx} className="break-inside-avoid group relative rounded-xl overflow-hidden bg-gray-50 shadow-sm border border-gray-100">
                                            <img
                                                src={img}
                                                alt={`Gallery Full ${idx}`}
                                                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                                            />

                                            {/* Individual Download Button */}
                                            <div className="absolute top-3 right-3 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDownload(img, `BS_${idx + 1}.jpg`);
                                                    }}
                                                    className="p-3 bg-white/95 backdrop-blur-md rounded-full text-gray-900 shadow-xl hover:bg-primary hover:text-white transition-all"
                                                >
                                                    <FiDownload size={14} />
                                                </button>
                                            </div>

                                            <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-[9px] text-white/80 font-bold uppercase tracking-widest">Shot {idx + 1}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Mobile Download All Button */}
                                <div className="sm:hidden mt-8 mb-6">
                                    <button
                                        onClick={handleDownloadAll}
                                        className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.1em] shadow-xl"
                                    >
                                        <FiDownload /> Download All Images
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #a2a4a7ff;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </>
    );
};
