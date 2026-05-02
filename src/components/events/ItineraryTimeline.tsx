"use client";
import React from 'react';
import { FormattedContent } from './FormattedContent';

export const ItineraryTimeline = ({ content }: { content: string }) => {
    if (!content) return null;

    return (
        <div className="relative pt-2 pb-8 pl-4 md:pl-0">
            {/* The Connecting Line */}
            <div className="absolute left-6 md:left-[30px] top-0 bottom-0 w-[2px] bg-gray-200">
                <div className="absolute top-0 left-0 w-full h-[60%] bg-primary"></div>
            </div>
            
            <div className="itinerary-timeline-content ml-12 md:ml-16">
                <FormattedContent content={content} />
            </div>

            <style jsx global>{`
                .itinerary-timeline-content strong, 
                .itinerary-timeline-content b,
                .itinerary-timeline-content h1,
                .itinerary-timeline-content h2,
                .itinerary-timeline-content h3 {
                    position: relative;
                    display: block;
                    font-size: 1.1rem;
                    font-weight: 800;
                    color: #111827;
                    margin-top: 3rem;
                    margin-bottom: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .itinerary-timeline-content strong:first-child,
                .itinerary-timeline-content h1:first-child,
                .itinerary-timeline-content h2:first-child,
                .itinerary-timeline-content h3:first-child {
                    margin-top: 0;
                }

                .itinerary-timeline-content strong::before,
                .itinerary-timeline-content b::before,
                .itinerary-timeline-content h1::before,
                .itinerary-timeline-content h2::before,
                .itinerary-timeline-content h3::before {
                    content: '';
                    position: absolute;
                    left: -32px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 14px;
                    height: 14px;
                    background: #fff;
                    border: 3px solid #36454F;
                    border-radius: 50%;
                    z-index: 2;
                }

                @media (min-width: 768px) {
                    .itinerary-timeline-content strong::before,
                    .itinerary-timeline-content b::before,
                    .itinerary-timeline-content h1::before,
                    .itinerary-timeline-content h2::before,
                    .itinerary-timeline-content h3::before {
                        left: -42px;
                        width: 16px;
                        height: 16px;
                        border-width: 4px;
                    }
                }

                .itinerary-timeline-content p {
                    font-size: 0.95rem;
                    color: #4B5563;
                    line-height: 1.7;
                    margin-bottom: 1rem;
                }

                .itinerary-timeline-content ul {
                    list-style: none !important;
                    padding-left: 0 !important;
                    margin-bottom: 2rem;
                }

                .itinerary-timeline-content li {
                    position: relative;
                    padding-left: 1.5rem;
                    margin-bottom: 0.5rem;
                    font-size: 0.9rem;
                    color: #4B5563;
                }

                .itinerary-timeline-content li::before {
                    content: '•';
                    position: absolute;
                    left: 0;
                    color: #36454F;
                    font-weight: 900;
                    font-size: 1.2rem;
                    line-height: 1;
                }
            `}</style>
        </div>
    );
};
