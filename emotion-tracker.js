import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Battery, Heart, MessageCircle, Save, BarChart2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, ResponsiveContainer, Legend } from 'recharts';

const IntrovertTracker = () => {
  const [socialBattery, setSocialBattery] = useState(100);
  const [emotion, setEmotion] = useState('');
  const [notes, setNotes] = useState('');
  const [logs, setLogs] = useState([]);

  const emotions = {
    'Energy Levels': [
      'Energized', 'Content', 'Tired', 'Exhausted', 'Drained'
    ],
    'Social States': [
      'Need Space', 'Open to Interaction', 'Seeking Connection', 'Social Overload'
    ],
    'Emotional States': [
      'Calm', 'Anxious', 'Peaceful', 'Overwhelmed', 'Frustrated', 'Happy'
    ],
    'Mental States': [
      'Focused', 'Scattered', 'Creative', 'Overthinking', 'Clear-minded'
    ],
    'Physical States': [
      'Relaxed', 'Tense', 'Restless', 'Grounded', 'Uncomfortable'
    ]
  };

  const handleSave = () => {
    const newLog = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      timestamp: Date.now(),
      socialBattery,
      emotion,
      notes
    };
    setLogs([newLog, ...logs]);
    setNotes('');
  };

  const getSocialBatteryColor = (level) => {
    if (level > 70) return 'text-green-500';
    if (level > 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Prepare data for charts
  const getChartData = () => {
    // Last 7 days of data
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const recentLogs = logs.filter(log => log.timestamp > sevenDaysAgo);
    
    return recentLogs.map(log => ({
      date: new Date(log.timestamp).toLocaleDateString(),
      battery: log.socialBattery,
      emotion: log.emotion
    })).reverse();
  };

  // Calculate emotion frequency
  const getEmotionFrequency = () => {
    const frequency = {};
    logs.forEach(log => {
      frequency[log.emotion] = (frequency[log.emotion] || 0) + 1;
    });
    return Object.entries(frequency)
      .map(([emotion, count]) => ({ emotion, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="text-pink-500" />
            Introvert Energy Tracker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Social Battery Slider */}
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <Battery className={getSocialBatteryColor(socialBattery)} />
              Social Battery Level: {socialBattery}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={socialBattery}
              onChange={(e) => setSocialBattery(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Emotions Grouped by Category */}
          <div className="space-y-4">
            {Object.entries(emotions).map(([category, categoryEmotions]) => (
              <div key={category} className="space-y-2">
                <label className="block font-medium">{category}:</label>
                <div className="flex flex-wrap gap-2">
                  {categoryEmotions.map((e) => (
                    <button
                      key={e}
                      onClick={() => setEmotion(e)}
                      className={`px-4 py-2 rounded-full ${
                        emotion === e 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Notes Section */}
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <MessageCircle />
              Notes:
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How are you feeling? What do you need?"
              className="w-full p-2 border rounded-md h-24"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <Save size={20} />
            Save Entry
          </button>

          {/* Analytics Section */}
          {logs.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BarChart2 />
                Analytics
              </h3>
              
              {/* Social Battery Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Social Battery Trends (Last 7 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={getChartData()}>
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="battery" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Emotion Frequency */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Most Frequent Emotions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getEmotionFrequency()}>
                        <XAxis dataKey="emotion" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Log History */}
          <div className="space-y-4">
            <h3 className="font-semibold">Recent Logs</h3>
            <div className="space-y-2">
              {logs.map((log) => (
                <div key={log.id} className="p-4 bg-gray-50 rounded-md">
                  <div className="text-sm text-gray-500">{log.date}</div>
                  <div className="flex items-center gap-2">
                    <Battery className={getSocialBatteryColor(log.socialBattery)} />
                    {log.socialBattery}% - {log.emotion}
                  </div>
                  {log.notes && <div className="mt-2 text-gray-700">{log.notes}</div>}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntrovertTracker;
