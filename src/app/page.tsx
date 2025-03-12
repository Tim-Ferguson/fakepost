'use client';

import { useState } from 'react';
import TweetForm from '@/components/TweetForm';
import TweetPreview from '@/components/TweetPreview';

interface TweetData {
  username: string;
  displayName: string;
  content: string;
  likes: number;
  retweets: number;
  replies: number;
  engagements: number;
  datetime: string;
  profileImage: string;
  verificationType?: 'verified' | 'business' | 'government' | null;
}

export default function Home() {
  const [previewData, setPreviewData] = useState<TweetData | null>(null);

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">
          Fake Tweet Maker
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <TweetForm onPreviewData={setPreviewData} />
          </div>
          <div>
            {previewData ? (
              <TweetPreview {...previewData} />
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md text-gray-500 text-center">
                Fill out the form to preview your tweet
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
