"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { BiRightArrow } from "react-icons/bi";

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

export const gallery = [
  { src: "/assets/images/packages/1.jpg", alt: "Gallery 1" },
  { src: "/assets/gallery/2.jpg", alt: "Gallery 2" },
  { src: "/assets/gallery/3.jpg", alt: "Gallery 3" },
  { src: "/assets/gallery/4.jpg", alt: "Gallery 4" },
  { src: "/assets/gallery/5.jpg", alt: "Gallery 5" },
  { src: "/assets/gallery/6.jpg", alt: "Gallery 6" },
  { src: "/assets/gallery/7.jpg", alt: "Gallery 7" },
  { src: "/assets/gallery/8.jpg", alt: "Gallery 8" },
  { src: "/assets/gallery/9.jpg", alt: "Gallery 9" },
  { src: "/assets/gallery/10.jpg", alt: "Gallery 10" },
  { src: "/assets/gallery/11.jpg", alt: "Gallery 11" },
  { src: "/assets/gallery/12.jpg", alt: "Gallery 12" },
  { src: "/assets/gallery/13.jpg", alt: "Gallery 13" },
  { src: "/assets/gallery/14.jpg", alt: "Gallery 14" },
  { src: "/assets/gallery/15.jpg", alt: "Gallery 15" },
  { src: "/assets/gallery/16.jpg", alt: "Gallery 16" },
  { src: "/assets/gallery/17.jpg", alt: "Gallery 17" },
  { src: "/assets/gallery/18.jpg", alt: "Gallery 18" },
  { src: "/assets/gallery/19.jpg", alt: "Gallery 19" },
  { src: "/assets/gallery/20.jpg", alt: "Gallery 20" },
  { src: "/assets/gallery/21.jpg", alt: "Gallery 21" },
  { src: "/assets/gallery/22.jpg", alt: "Gallery 22" },
  { src: "/assets/gallery/23.jpg", alt: "Gallery 23" },
  { src: "/assets/gallery/24.jpg", alt: "Gallery 24" },
  { src: "/assets/gallery/25.jpg", alt: "Gallery 25" },
  { src: "/assets/gallery/26.jpg", alt: "Gallery 26" },
  { src: "/assets/gallery/27.jpg", alt: "Gallery 27" },
  { src: "/assets/gallery/28.jpg", alt: "Gallery 28" },
  { src: "/assets/gallery/29.jpg", alt: "Gallery 29" },
  { src: "/assets/gallery/30.jpg", alt: "Gallery 30" },
  { src: "/assets/gallery/31.jpg", alt: "Gallery 31" },
  { src: "/assets/gallery/32.jpg", alt: "Gallery 32" },
  { src: "/assets/gallery/33.jpg", alt: "Gallery 33" },
  { src: "/assets/gallery/34.jpg", alt: "Gallery 34" },
  { src: "/assets/gallery/35.jpg", alt: "Gallery 35" },
  { src: "/assets/gallery/36.jpg", alt: "Gallery 36" },
  { src: "/assets/gallery/37.jpg", alt: "Gallery 37" },
  { src: "/assets/gallery/38.jpg", alt: "Gallery 38" },
  { src: "/assets/gallery/39.jpg", alt: "Gallery 39" },
  { src: "/assets/gallery/40.jpg", alt: "Gallery 40" },
  { src: "/assets/gallery/41.jpg", alt: "Gallery 41" },
  { src: "/assets/gallery/42.jpg", alt: "Gallery 42" },
  { src: "/assets/gallery/43.jpg", alt: "Gallery 43" },
  { src: "/assets/gallery/44.jpg", alt: "Gallery 44" },
  { src: "/assets/gallery/45.jpg", alt: "Gallery 45" },
  { src: "/assets/gallery/46.jpg", alt: "Gallery 46" },
  { src: "/assets/gallery/47.jpg", alt: "Gallery 47" },
  { src: "/assets/gallery/48.jpg", alt: "Gallery 48" },
  { src: "/assets/gallery/49.jpg", alt: "Gallery 49" },
  { src: "/assets/gallery/50.jpg", alt: "Gallery 50" },
  { src: "/assets/gallery/51.jpg", alt: "Gallery 51" },
  { src: "/assets/gallery/52.jpg", alt: "Gallery 52" },
  { src: "/assets/gallery/53.jpg", alt: "Gallery 53" },
  { src: "/assets/gallery/54.jpg", alt: "Gallery 54" },
  { src: "/assets/gallery/55.jpg", alt: "Gallery 55" },
  { src: "/assets/gallery/56.jpg", alt: "Gallery 56" },
  { src: "/assets/gallery/57.jpg", alt: "Gallery 57" },
  { src: "/assets/gallery/58.jpg", alt: "Gallery 58" },
  { src: "/assets/gallery/59.jpg", alt: "Gallery 59" },
  { src: "/assets/gallery/60.jpg", alt: "Gallery 60" },
  { src: "/assets/gallery/61.jpg", alt: "Gallery 61" },
  { src: "/assets/gallery/62.jpg", alt: "Gallery 62" },
  { src: "/assets/gallery/63.jpg", alt: "Gallery 63" },
  { src: "/assets/gallery/64.jpg", alt: "Gallery 64" },
  { src: "/assets/gallery/65.jpg", alt: "Gallery 65" },
  { src: "/assets/gallery/66.jpg", alt: "Gallery 66" },
  { src: "/assets/gallery/67.jpg", alt: "Gallery 67" },
  { src: "/assets/gallery/68.jpg", alt: "Gallery 68" },
  { src: "/assets/gallery/69.jpg", alt: "Gallery 69" },
  { src: "/assets/gallery/70.jpg", alt: "Gallery 70" },
  { src: "/assets/gallery/71.jpg", alt: "Gallery 71" },
  { src: "/assets/gallery/72.jpg", alt: "Gallery 72" },
  { src: "/assets/gallery/73.jpg", alt: "Gallery 73" },
  { src: "/assets/gallery/74.jpg", alt: "Gallery 74" },
  { src: "/assets/gallery/75.jpg", alt: "Gallery 75" },
  { src: "/assets/gallery/76.jpg", alt: "Gallery 76" },
  { src: "/assets/gallery/77.jpg", alt: "Gallery 77" },
  { src: "/assets/gallery/78.jpg", alt: "Gallery 78" },
  { src: "/assets/gallery/79.jpg", alt: "Gallery 79" },
  { src: "/assets/gallery/80.jpg", alt: "Gallery 80" },
  { src: "/assets/gallery/81.jpg", alt: "Gallery 81" },
  { src: "/assets/gallery/82.jpg", alt: "Gallery 82" },
  { src: "/assets/gallery/83.jpg", alt: "Gallery 83" },
  { src: "/assets/gallery/84.jpg", alt: "Gallery 84" },
  { src: "/assets/gallery/85.jpg", alt: "Gallery 85" },
  { src: "/assets/gallery/86.jpg", alt: "Gallery 86" },
  { src: "/assets/gallery/87.jpg", alt: "Gallery 87" },
  { src: "/assets/gallery/88.jpg", alt: "Gallery 88" },
  { src: "/assets/gallery/89.jpg", alt: "Gallery 89" },
  { src: "/assets/gallery/100.jpg", alt: "Gallery 100" },
  { src: "/assets/gallery/101.jpg", alt: "Gallery 101" },
  { src: "/assets/gallery/102.jpg", alt: "Gallery 102" },
  { src: "/assets/gallery/103.jpg", alt: "Gallery 103" },
  { src: "/assets/gallery/1.jpg", alt: "Gallery 1" },
  { src: "/assets/gallery/104.jpg", alt: "Gallery 104" },
  { src: "/assets/gallery/105.jpg", alt: "Gallery 105" },
  { src: "/assets/gallery/106.jpg", alt: "Gallery 106" },
  { src: "/assets/gallery/107.jpg", alt: "Gallery 107" },
  { src: "/assets/gallery/108.jpg", alt: "Gallery 108" },
  { src: "/assets/gallery/109.jpg", alt: "Gallery 109" },
  { src: "/assets/gallery/1.jpg", alt: "Gallery 1" },
  { src: "/assets/gallery/110.jpg", alt: "Gallery 110" },
  { src: "/assets/gallery/111.jpg", alt: "Gallery 111" },
  { src: "/assets/gallery/112.jpg", alt: "Gallery 112" },
  { src: "/assets/gallery/113.jpg", alt: "Gallery 113" },
  { src: "/assets/gallery/114.jpg", alt: "Gallery 114" },
  { src: "/assets/gallery/1.jpg", alt: "Gallery 1" },
  { src: "/assets/gallery/115.jpg", alt: "Gallery 115" },
  { src: "/assets/gallery/116.jpg", alt: "Gallery 116" },
  { src: "/assets/gallery/117.jpg", alt: "Gallery 117" },
  { src: "/assets/gallery/118.jpg", alt: "Gallery 118" },
  { src: "/assets/gallery/119.jpg", alt: "Gallery 119" }
];


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
  const [columnHeights, setColumnHeights] = useState<number[]>([]);

  // Calculate masonry layout
  const organizeImagesIntoColumns = useCallback(
    (images: GalleryImage[], columnCount: number) => {
      const columns: GalleryImage[][] = Array.from(
        { length: columnCount },
        () => []
      );
      const heights = new Array(columnCount).fill(0);

      images.forEach((image) => {
        // Find the column with the minimum current height
        const minHeightIndex = heights.indexOf(Math.min(...heights));

        // Add image to that column
        columns[minHeightIndex].push(image);

        // Estimate height based on aspect ratio (assuming fixed width of 300px)
        const aspectRatio =
          image.height && image.width ? image.height / image.width : 1.5;
        const estimatedHeight = 300 * aspectRatio;

        // Update column height
        heights[minHeightIndex] += estimatedHeight + 16; // 16px for margin
      });

      return { columns, heights };
    },
    []
  );

  // Get column count based on screen size
  const getColumnCount = () => {
    if (typeof window === "undefined") return 4;

    const width = window.innerWidth;
    if (width < 640) return 1;
    if (width < 768) return 2;
    if (width < 1024) return 3;
    return 4;
  };

  // Load more images function
  const loadMoreImages = useCallback((): void => {
    if (loading || !hasMore) return;

    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const currentCount: number = displayedImages.length;
      const nextImages: GalleryImage[] = images.slice(
        currentCount,
        currentCount + imagesPerPage
      );

      if (nextImages.length === 0) {
        setHasMore(false);
        setLoading(false);
        return;
      }

      setDisplayedImages((prev) => [...prev, ...nextImages]);
      setLoading(false);
    }, 500);
  }, [displayedImages.length, images, loading, hasMore, imagesPerPage]);

  // Initialize images
  useEffect(() => {
    loadMoreImages();
  }, []);

  // Recalculate layout when displayed images change or window resizes
  useEffect(() => {
    const columnCount = getColumnCount();
    const { columns, heights } = organizeImagesIntoColumns(
      displayedImages,
      columnCount
    );
    setColumnHeights(heights);
  }, [displayedImages, organizeImagesIntoColumns]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const columnCount = getColumnCount();
      const { columns, heights } = organizeImagesIntoColumns(
        displayedImages,
        columnCount
      );
      setColumnHeights(heights);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [displayedImages, organizeImagesIntoColumns]);

  // Infinite scroll handler
  useEffect(() => {
    if (!enableInfiniteScroll) return;

    const handleScroll = (): void => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
          document.documentElement.offsetHeight ||
        loading
      ) {
        return;
      }
      loadMoreImages();
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

  // Render masonry grid columns
  const renderMasonryGrid = () => {
    return (
      <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-2 space-y-2 md:mt-5">
        {displayedImages.map((image, index) => (
          <div
            key={image.id || `${image.src}-${index}`}
            className="break-inside-avoid mb-2 cursor-pointer transform transition-transform ease-in-out duration-300 hover:scale-[1.02]"
            onClick={() => handleImageClick(image, index)}
          >
            <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
              <div className="relative w-full" style={{ height: "auto" }}>
                <Image
                  src={image.src}
                  alt={getImageAlt(image, index)}
                  width={300}
                  height={400}
                  className="object-cover w-full"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-[1350px] mx-auto h-full px-5 md:px-8 my-8 md:my-20">
      {/* Custom Masonry Grid */}
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
