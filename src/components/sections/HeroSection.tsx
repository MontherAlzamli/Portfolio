'use client';

import { useState, useEffect } from 'react';
import { ArrowDown, Github, Linkedin, Mail, Download } from 'lucide-react';
import { LoadingSpinner } from '@/components/LoadingComponents';

type ProfileData = {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  twitter: string;
  profileImage: string;
};

export function HeroSection() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
          },
        });
        if (res.ok) {
          const json = await res.json();
          setProfile(json?.data ?? null);
        } else {
          setError('Failed to load profile data');
        }
      } catch (error) {
        setError('Network error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <section
        id="home"
        className="min-h-screen flex items-center justify-center bg-background-primary relative overflow-hidden pt-20"
        aria-label="Loading profile information"
      >
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-text-secondary">Loading profile...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        id="home"
        className="min-h-screen flex items-center justify-center bg-background-primary relative overflow-hidden pt-20"
        aria-label="Profile loading error"
      >
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition-colors"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center bg-background-primary relative overflow-hidden pt-20"
      aria-label="Hero section with profile information"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-300/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div className="order-2 lg:order-1 text-left lg:text-left">
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-background-secondary text-text-secondary rounded-full text-sm font-semibold border border-border-primary">
                  Hello, I'm
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-text-primary mb-6 leading-tight">
                {profile?.name || 'Monther Alzamli'}
              </h1>

              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-4">
                  {profile?.title || 'Full Stack Developer'}
                </h2>
                <p className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl">
                  {profile?.bio ||
                    'I create beautiful, functional, and user-centered digital experiences using modern web technologies like React, Next.js, and TypeScript.'}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <a
                  href="#projects"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-primary-400 text-white font-semibold rounded-xl hover:bg-primary-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-primary-400/25 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-background-primary"
                  aria-label="View my projects and work portfolio"
                >
                  <span>View My Work</span>
                  <ArrowDown
                    className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform duration-200"
                    aria-hidden="true"
                  />
                </a>
                <a
                  href="#contact"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-background-secondary text-text-primary font-semibold rounded-xl border border-border-primary hover:border-primary-400 transition-all duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-background-primary"
                  aria-label="Contact me for collaboration or inquiries"
                >
                  <span>Get In Touch</span>
                  <Mail
                    className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform duration-200"
                    aria-hidden="true"
                  />
                </a>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-6">
                <span className="text-sm text-text-secondary font-medium">
                  Follow me:
                </span>
                <div className="flex gap-4">
                  {profile?.github && (
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-3 bg-background-secondary rounded-xl border border-border-primary hover:border-primary-400 transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-background-primary"
                      aria-label="Visit my GitHub profile"
                    >
                      <Github
                        className="h-6 w-6 text-text-secondary group-hover:text-primary-400 transition-colors"
                        aria-hidden="true"
                      />
                    </a>
                  )}
                  {profile?.linkedin && (
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-3 bg-background-secondary rounded-xl border border-border-primary hover:border-primary-400 transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-background-primary"
                      aria-label="Visit my LinkedIn profile"
                    >
                      <Linkedin
                        className="h-6 w-6 text-text-secondary group-hover:text-primary-400 transition-colors"
                        aria-hidden="true"
                      />
                    </a>
                  )}
                  {profile?.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-3 bg-background-secondary rounded-xl border border-border-primary hover:border-primary-400 transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-background-primary"
                      aria-label="Send me an email"
                    >
                      <Mail
                        className="h-6 w-6 text-text-secondary group-hover:text-primary-400 transition-colors"
                        aria-hidden="true"
                      />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right side - Profile Image */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative">
                {/* Main image container */}
                <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                  {/* Border */}
                  <div className="absolute inset-0 bg-primary-400 rounded-3xl p-1">
                    <div className="w-full h-full bg-background-primary rounded-3xl p-2">
                      {/* Image container */}
                      <div className="w-full h-full rounded-2xl overflow-hidden bg-background-secondary">
                        <img
                          src={profile?.profileImage || '/monther.jpg'}
                          alt={`Profile photo of ${profile?.name || 'Monther Alzamli'}`}
                          className="w-full h-full object-top object-cover"
                          loading="eager"
                          width="384"
                          height="384"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Floating elements */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary-400 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                    <span className="text-white font-bold text-lg">Dev</span>
                  </div>
                  <div
                    className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse"
                    style={{ animationDelay: '1s' }}
                  >
                    <span className="text-white font-bold text-lg">Code</span>
                  </div>
                </div>

                {/* Background decoration */}
                <div className="absolute inset-0 -z-10">
                  <div className="w-full h-full bg-primary-400/10 rounded-3xl blur-2xl scale-110"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="animate-bounce">
              <a
                href="#about"
                className="group flex flex-col items-center text-text-secondary hover:text-primary-400 transition-colors duration-200"
              >
                <span className="text-sm font-medium mb-2">
                  Scroll to explore
                </span>
                <ArrowDown className="h-6 w-6 group-hover:translate-y-1 transition-transform duration-200" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
