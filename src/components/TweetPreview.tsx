'use client';

import { format } from 'date-fns';
import Image from 'next/image';
import html2canvas from 'html2canvas';
import { useRef } from 'react';
import { DefaultAvatar } from './DefaultAvatar';

interface TweetPreviewProps {
  username?: string;
  displayName?: string;
  content?: string;
  likes?: number;
  retweets?: number;
  replies?: number;
  views?: number;
  datetime?: string;
  profileImage?: string;
  verificationType?: 'verified' | 'business' | 'government' | null;
}

export default function TweetPreview({
  username = 'username',
  displayName = 'Display Name',
  content = 'Your tweet will appear here...',
  likes = 42,
  retweets = 7,
  replies = 3,
  views = 1337,
  datetime = new Date().toISOString(),
  profileImage = '/default-avatar.png',
  verificationType = null,
}: TweetPreviewProps) {
  const lightModeRef = useRef<HTMLDivElement>(null);
  const darkModeRef = useRef<HTMLDivElement>(null);

  const downloadTweet = async (mode: 'light' | 'dark') => {
    const element = mode === 'light' ? lightModeRef.current : darkModeRef.current;
    if (!element) return;

    try {
      const clone = element.cloneNode(true) as HTMLElement;
      clone.style.position = 'fixed';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      document.body.appendChild(clone);

      if (mode === 'dark') {
        clone.style.backgroundColor = '#000000';
        clone.style.color = '#ffffff';
      } else {
        clone.style.backgroundColor = '#ffffff';
        clone.style.color = '#000000';
      }

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: mode === 'dark' ? '#000000' : '#ffffff',
      });

      document.body.removeChild(clone);

      const link = document.createElement('a');
      link.download = `tweet-${mode}-mode.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  const VerificationBadge = ({ type, isDark }: { type: string | null, isDark: boolean }) => {
    if (!type) return null;

    const baseClasses = "w-4 h-4 ml-1";
    
    switch (type) {
      case 'verified':
        return (
          <svg className={`${baseClasses} text-blue-500`} viewBox="0 0 24 24" aria-label="Verified account" fill="currentColor">
            <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
          </svg>
        );
      case 'business':
        return (
          <svg className={`${baseClasses} text-yellow-500`} viewBox="0 0 24 24" aria-label="Business account" fill="currentColor">
            <path d="M20.75 2H3.25C2.007 2 1 3.007 1 4.25v15.5C1 20.993 2.007 22 3.25 22h17.5c1.243 0 2.25-1.007 2.25-2.25V4.25C23 3.007 21.993 2 20.75 2zM17.5 13.504c0 .483-.392.875-.875.875s-.875-.392-.875-.875.392-.875.875-.875.875.392.875.875zm-1.75-2.871c0-.483.392-.875.875-.875s.875.392.875.875-.392.875-.875.875-.875-.392-.875-.875zm-1.75 2.871c0-.483.392-.875.875-.875s.875.392.875.875-.392.875-.875.875-.875-.392-.875-.875zm-1.75-2.871c0-.483.392-.875.875-.875s.875.392.875.875-.392.875-.875.875-.875-.392-.875-.875z" />
          </svg>
        );
      case 'government':
        return (
          <svg className={`${baseClasses} text-gray-500`} viewBox="0 0 24 24" aria-label="Government account" fill="currentColor">
            <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const formatTweetContent = (content: string) => {
    const parts = content.split(/(@\w+)/g);
    
    return (
      <>
        {parts.map((part, index) => {
          if (part.startsWith('@')) {
            return (
              <span 
                key={index} 
                style={{ color: 'rgb(29, 155, 240)' }}
              >
                {part}
              </span>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </>
    );
  };

  const TweetContent = ({ isDark = false }) => (
    <div style={{
      padding: '1rem',
      borderRadius: '0.5rem',
      backgroundColor: isDark ? '#000000' : '#ffffff',
      color: isDark ? '#ffffff' : '#000000',
      border: `1px solid ${isDark ? '#333333' : '#e5e5e5'}`
    }}>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          borderRadius: '9999px', 
          overflow: 'hidden',
          position: 'relative'
        }}>
          <Image
            src={profileImage}
            alt={`${displayName}'s profile`}
            width={48}
            height={48}
            style={{ objectFit: 'cover' }}
            unoptimized
            priority
          />
        </div>
        <div style={{ flex: '1' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ 
              fontWeight: 'bold',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
            }}>
              {displayName}
            </span>
            <VerificationBadge type={verificationType} isDark={isDark} />
            <span style={{ 
              marginLeft: '0.5rem',
              color: isDark ? '#6e767d' : '#536471'
            }}>@{username}</span>
            <span style={{ 
              margin: '0 0.25rem',
              color: isDark ? '#6e767d' : '#536471'
            }}>·</span>
            <span style={{ color: isDark ? '#6e767d' : '#536471' }}>
              {format(new Date(datetime), 'MMM d')}
            </span>
          </div>
          <div style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>
            {formatTweetContent(content)}
          </div>
          <div style={{ 
            marginTop: '0.75rem', 
            display: 'flex', 
            alignItems: 'center',
            gap: '1.5rem'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              color: isDark ? '#6e767d' : '#536471'
            }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                />
              </svg>
              <span>{replies}</span>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              color: isDark ? '#6e767d' : '#536471'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="1.5"
                  d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"
                />
              </svg>
              <span>{retweets}</span>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              color: isDark ? '#6e767d' : '#536471'
            }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                />
              </svg>
              <span>{likes}</span>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              color: isDark ? '#6e767d' : '#536471'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z" />
              </svg>
              <span>{views}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-2">Preview</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2">Light Mode</h3>
          <div ref={lightModeRef}>
            <TweetContent isDark={false} />
          </div>
          <button
            onClick={() => downloadTweet('light')}
            style={{
              marginTop: '0.5rem',
              width: '100%',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            Download Light Mode
          </button>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Dark Mode</h3>
          <div ref={darkModeRef}>
            <TweetContent isDark={true} />
          </div>
          <button
            onClick={() => downloadTweet('dark')}
            style={{
              marginTop: '0.5rem',
              width: '100%',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            Download Dark Mode
          </button>
        </div>
      </div>
    </div>
  );
} 