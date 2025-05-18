// Format a date to a readable string (e.g., "Jan 15, 2025")
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Format a date to a time string (e.g., "3:45 PM")
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
};

// Calculate days since a date
export const daysSince = (dateString: string): number => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Get days of the past week as date strings
export const getPastWeekDates = (): string[] => {
  const dates: string[] = [];
  const now = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
};

// Get months of the past year as strings (e.g., "Jan", "Feb")
export const getPastYearMonths = (): string[] => {
  const months: string[] = [];
  const now = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(now.getMonth() - i);
    months.push(date.toLocaleDateString('en-US', { month: 'short' }));
  }
  
  return months;
};

// Calculate learning streak (consecutive days with study activity)
export const calculateStreak = (studyDates: string[]): number => {
  if (studyDates.length === 0) return 0;
  
  // Sort dates in descending order
  const sortedDates = [...studyDates].sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );
  
  // Check if user studied today
  const today = new Date().toISOString().split('T')[0];
  const studiedToday = sortedDates.some(date => date.startsWith(today));
  
  if (!studiedToday) return 0;
  
  let streak = 1;
  const dates = new Set(sortedDates.map(date => date.split('T')[0]));
  
  // Check previous days
  for (let i = 1; i <= 365; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    if (dates.has(dateString)) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};