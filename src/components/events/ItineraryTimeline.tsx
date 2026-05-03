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

            <style dangerouslySetInnerHTML={{ __html: `
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
                    left: calc(-3rem - 1px);
                    top: 50%;
                    transform: translateY(-50%);
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background: white;
                    border: 3px solid var(--primary, #000);
                    box-shadow: 0 0 0 4px white;
                    z-index: 10;
                }

                @media (max-width: 768px) {
                    .itinerary-timeline-content strong::before,
                    .itinerary-timeline-content b::before,
                    .itinerary-timeline-content h1::before,
                    .itinerary-timeline-content h2::before,
                    .itinerary-timeline-content h3::before {
                        left: calc(-2.25rem - 1px);
                        width: 12px;
                        height: 12px;
                        border-width: 2px;
                    }
                }

                .itinerary-timeline-content p {
                    color: #4b5563;
                    line-height: 1.7;
                    margin-bottom: 1rem;
                    font-size: 15px;
                }
                
                .itinerary-timeline-content ul {
                    list-style-type: disc;
                    margin-left: 1.25rem;
                    margin-bottom: 1.5rem;
                    color: #4b5563;
                    font-size: 15px;
                }

                .itinerary-timeline-content li {
                    margin-bottom: 0.5rem;
                    position: absolute;
                    left: 0;
                    color: #36454F;
                    font-weight: 900;
                    font-size: 1.2rem;
                    line-height: 1;
                }
            `}} />
        </div>
    );
};
