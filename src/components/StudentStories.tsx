"use client";

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import student1 from '../../public/student-1.jpg';
import student2 from '../../public/student-2.jpg';

const StudentStories = () => {
  const stories = [
    {
      id: 1,
      name: "Priya Nair",
      course: "Computer Science Engineering",
      institute: "Kerala Institute of Technology",
      photo: student1,
      testimonial: "StudyConnect helped me connect with seniors who guided me through the admission process. The real insights about campus life and placements were invaluable!",
    },
    {
      id: 2,
      name: "Arjun Krishna",
      course: "MBA",
      institute: "Trivandrum Business School",
      photo: student2,
      testimonial: "The peer mentoring program was amazing. I got honest reviews about different institutes and made the right choice for my career. Highly recommend!",
    },
  ];

  const [currentStory, setCurrentStory] = React.useState(0);

  const nextStory = () => {
    setCurrentStory((prev) => (prev + 1) % stories.length);
  };

  const prevStory = () => {
    setCurrentStory((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const story = stories[currentStory];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Hear It From The Students
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real experiences from students who found their perfect institutes through our platform
          </p>
        </div>

        {/* Story Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Student Info */}
            <div className="text-center md:text-left animate-fade-in">
              <div className="flex flex-col items-center md:items-start">
                {/* Student Photo */}
                <div className="relative mb-6">
                  <img
                    src={story.photo.src}
                    alt={`${story.name} photo`}
                    className="w-32 h-32 rounded-full object-cover shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>

                {/* Student Details */}
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-foreground">
                    {story.name}
                  </h3>
                  <p className="text-primary font-medium">
                    {story.course}
                  </p>
                  <p className="text-muted-foreground">
                    {story.institute}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Testimonial */}
            <div className="relative animate-slide-in-right">
              {/* Speech Bubble */}
              <div className="bg-card p-8 rounded-2xl shadow-glass relative">
                {/* Speech bubble arrow */}
                <div className="absolute -left-4 top-8 w-0 h-0 border-t-[20px] border-b-[20px] border-r-[20px] border-t-transparent border-b-transparent border-r-card"></div>

                {/* Quote marks */}
                <div className="text-primary text-4xl font-bold mb-4">"</div>

                {/* Testimonial text */}
                <p className="text-lg text-foreground leading-relaxed mb-4">
                  {story.testimonial}
                </p>

                {/* Rating stars */}
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          {stories.length > 1 && (
            <div className="flex justify-center items-center mt-12 space-x-4">
              <button
                onClick={prevStory}
                className="p-3 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label="Previous story"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Dots indicator */}
              <div className="flex space-x-2">
                {stories.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStory(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentStory ? 'bg-primary' : 'bg-border'
                      }`}
                    aria-label={`Go to story ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextStory}
                className="p-3 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label="Next story"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default StudentStories;