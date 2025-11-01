"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { gallery } from "@/data/gallery";

interface GalleryImage {
  src: string;
  alt?: string;
  id?: string;
  width?: number;
  height?: number;
}

interface SelectedImage {
  src: string;
  index: number;
}

interface GalleryListingProps {
  initialImages?: GalleryImage[];
  imagesPerPage?: number;
  enableInfiniteScroll?: boolean;
}

const GalleryListing: React.FC<GalleryListingProps> = ({
  imagesPerPage = 10,
  enableInfiniteScroll = true
}) => {
  // State management with TypeScript types
  const [images, setImages] = useState<GalleryImage[]>(gallery);
  const [displayedImages, setDisplayedImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [columnCount, setColumnCount] = useState<number>(4);
  const [columns, setColumns] = useState<GalleryImage[][]>([]);

  // Get column count based on screen size
  const getColumnCount = (): number => {
    if (typeof window === "undefined") return 4;

    const width = window.innerWidth;
    if (width < 640) return 1;
    if (width < 768) return 2;
    if (width < 1024) return 3;
    return 4;
  };

  // Organize images into columns for masonry layout
  const organizeImagesIntoColumns = useCallback(
    (images: GalleryImage[], colCount: number): GalleryImage[][] => {
      const newColumns: GalleryImage[][] = Array.from(
        { length: colCount },
        () => []
      );

      images.forEach((image, index) => {
        // Simple round-robin distribution for equal column distribution
        const columnIndex = index % colCount;
        newColumns[columnIndex].push(image);
      });

      return newColumns;
    },
    []
  );

  const loadedCountRef = useRef(0);

  const loadMoreImages = useCallback((): void => {
    if (loading || !hasMore) return;
    setLoading(true);

    setTimeout(() => {
      const currentCount = loadedCountRef.current;
      const nextImages = images.slice(
        currentCount,
        currentCount + imagesPerPage
      );

      if (nextImages.length === 0) {
        setHasMore(false);
        setLoading(false);
        return;
      }

      setDisplayedImages((prev) => [...prev, ...nextImages]);
      loadedCountRef.current += nextImages.length;
      setLoading(false);
    }, 500);
  }, [images, loading, hasMore, imagesPerPage]);

  // Initialize images
  useEffect(() => {
    loadMoreImages();
  }, []);

  // Update columns when displayed images or column count changes
  useEffect(() => {
    const newColumnCount = getColumnCount();
    setColumnCount(newColumnCount);
    const newColumns = organizeImagesIntoColumns(
      displayedImages,
      newColumnCount
    );
    setColumns(newColumns);
  }, [displayedImages, organizeImagesIntoColumns]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newColumnCount = getColumnCount();
      setColumnCount(newColumnCount);
      const newColumns = organizeImagesIntoColumns(
        displayedImages,
        newColumnCount
      );
      setColumns(newColumns);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [displayedImages, organizeImagesIntoColumns]);

  // Infinite scroll handler
  useEffect(() => {
    if (!enableInfiniteScroll) return;

    const handleScroll = (): void => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 500 &&
        !loading
      ) {
        loadMoreImages();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, loadMoreImages, enableInfiniteScroll]);

  // Image click handler
  const handleImageClick = (image: GalleryImage, index: number): void => {
    setSelectedImage({ src: image.src, index });
    setIsModalOpen(true);
  };

  // Navigation in modal
  const handleNext = (): void => {
    if (!selectedImage) return;

    const currentIndex: number = selectedImage.index;
    const nextIndex: number = (currentIndex + 1) % displayedImages.length;
    setSelectedImage({
      src: displayedImages[nextIndex].src,
      index: nextIndex
    });
  };

  const handlePrev = (): void => {
    if (!selectedImage) return;

    const currentIndex: number = selectedImage.index;
    const prevIndex: number =
      (currentIndex - 1 + displayedImages.length) % displayedImages.length;
    setSelectedImage({
      src: displayedImages[prevIndex].src,
      index: prevIndex
    });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (!isModalOpen) return;

      switch (e.key) {
        case "ArrowRight":
          handleNext();
          break;
        case "ArrowLeft":
          handlePrev();
          break;
        case "Escape":
          setIsModalOpen(false);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  // Close modal when clicking backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  };

  // Get image alt text safely
  const getImageAlt = (image: GalleryImage, index: number): string => {
    return image.alt || `Gallery image ${index + 1}`;
  };

  // Calculate global index for modal navigation
  const getGlobalIndex = (columnIndex: number, itemIndex: number): number => {
    let globalIndex = 0;
    for (let i = 0; i < columnIndex; i++) {
      globalIndex += columns[i]?.length || 0;
    }
    return globalIndex + itemIndex;
  };

  // Render flexbox masonry grid
  const renderMasonryGrid = () => {
    return (
      <div className="flex gap-2 md:gap-2 w-full">
        {columns.map((column, columnIndex) => (
          <div
            key={columnIndex}
            className="flex-1 flex flex-col gap-2 md:gap-2"
          >
            {column.map((image, imageIndex) => {
              const globalIndex = getGlobalIndex(columnIndex, imageIndex);
              return (
                <div
                  key={image.alt || `${image.src}-${globalIndex}`}
                  className="break-inside-avoid cursor-pointer transform transition-transform ease-in-out duration-300 hover:scale-[1.02]"
                  onClick={() => handleImageClick(image, globalIndex)}
                >
                  <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
                    <div className="relative w-full" style={{ height: "auto" }}>
                      <Image
                        src={image.src}
                        alt={getImageAlt(image, globalIndex)}
                        width={300}
                        height={400}
                        className="object-cover w-full"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-[1350px] mx-auto h-full px-5 md:px-8 my-8 md:my-20">
      {/* Flexbox Masonry Grid */}
      {renderMasonryGrid()}

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mt-5 pb-10 md:mt-12">
          <button
            onClick={loadMoreImages}
            disabled={loading}
            className="relative overflow-hidden border rounded-full p-2.5 px-5 text-[16px] leading-[19px] text-black transition-all duration-500 ease-out group cursor-pointer"
          >
            {loading ? (
              <span className="relative z-10 transition-colors duration-500 group-hover:text-white text-nowrap text-[16px] font-[600] flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Loading...
              </span>
            ) : (
              <span className="relative z-10 transition-colors duration-500 group-hover:text-white text-nowrap text-[16px] font-[600] flex items-center justify-center gap-2">
                Load More Images
              </span>
            )}
            <span className="absolute inset-0 bg-black translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></span>
          </button>
        </div>
      )}

      {/* No more images message */}
      {!hasMore && displayedImages.length > 0 && (
        <div className="text-center mt-8 pb-10">
          <p className="text-gray-500 italic">You've seen all the images!</p>
        </div>
      )}

      {/* Image Viewer Modal */}
      {isModalOpen && selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <div className="relative max-w-6xl max-h-full w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white text-3xl z-10 cursor-pointer bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition-colors"
              aria-label="Close image viewer"
            >
              &times;
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={handlePrev}
              className="absolute left-4 text-white text-2xl z-10 cursor-pointer bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-70 transition-colors"
              aria-label="Previous image"
            >
              ‹
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 text-white text-2xl z-10 cursor-pointer bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-70 transition-colors"
              aria-label="Next image"
            >
              ›
            </button>

            {/* Image Display */}
            <div className="relative w-full h-full max-w-4xl max-h-[80vh] flex items-center justify-center">
              <Image
                src={selectedImage.src}
                alt={getImageAlt(
                  displayedImages[selectedImage.index],
                  selectedImage.index
                )}
                fill
                sizes="(max-width: 768px) 100vw, 80vw"
                className="object-contain"
                priority
              />
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full">
              {selectedImage.index + 1} / {displayedImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryListing;
