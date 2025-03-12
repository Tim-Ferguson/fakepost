'use client';

import { useState, Dispatch, SetStateAction } from 'react';
import { format } from 'date-fns';
import axios from 'axios';

interface TweetFormData {
  username: string;
  content: string;
  likes: number;
  retweets: number;
  replies: number;
  views: number;
  datetime: string;
}

interface PreviewData extends TweetFormData {
  displayName: string;
  profileImage: string;
  verificationType?: 'verified' | 'business' | 'government' | null;
}

interface TweetFormProps {
  onPreviewData: (data: PreviewData | null) => void;
}

export default function TweetForm({ onPreviewData }: TweetFormProps) {
  const [formData, setFormData] = useState<TweetFormData>({
    username: '',
    content: '',
    likes: 42,
    retweets: 7,
    replies: 3,
    views: 1337,
    datetime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/user?username=${encodeURIComponent(formData.username)}`);
      const { profileImage, displayName, verificationType } = response.data;

      onPreviewData({
        ...formData,
        profileImage: profileImage || '/default-avatar.png',
        displayName: displayName || formData.username,
        verificationType
      });
    } catch (error) {
      setError('Failed to fetch user data. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username (without @)
          </label>
          <input
            type="text"
            id="username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900 p-2"
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Tweet Content
          </label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900 p-2"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="likes" className="block text-sm font-medium text-gray-700">
              Likes
            </label>
            <input
              type="number"
              id="likes"
              value={formData.likes}
              onChange={(e) => setFormData({ ...formData, likes: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900 p-2"
            />
          </div>

          <div>
            <label htmlFor="retweets" className="block text-sm font-medium text-gray-700">
              Retweets
            </label>
            <input
              type="number"
              id="retweets"
              value={formData.retweets}
              onChange={(e) => setFormData({ ...formData, retweets: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900 p-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label htmlFor="replies" className="block text-sm font-medium text-gray-700">
              Replies
            </label>
            <input
              type="number"
              id="replies"
              value={formData.replies}
              onChange={(e) => setFormData({ ...formData, replies: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900 p-2"
            />
          </div>

          <div>
            <label htmlFor="views" className="block text-sm font-medium text-gray-700">
              Views
            </label>
            <input
              type="number"
              id="views"
              value={formData.views}
              onChange={(e) => setFormData({ ...formData, views: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900 p-2"
            />
          </div>
        </div>

        <div>
          <label htmlFor="datetime" className="block text-sm font-medium text-gray-700">
            Date & Time
          </label>
          <input
            type="datetime-local"
            id="datetime"
            value={formData.datetime}
            onChange={(e) => setFormData({ ...formData, datetime: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900 p-2"
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Creating...' : 'Create Fake Post'}
        </button>
      </div>
    </form>
  );
} 