export const dateUtils = {
  // Format date to locale string
  formatDate: (date: string | Date): string => {
    return new Date(date).toLocaleDateString();
  },

  // Format date with time
  formatDateTime: (date: string | Date): string => {
    return new Date(date).toLocaleString();
  },

  getRelativeTime: (date: string | Date): string => {
    const now = new Date();
    const then = new Date(date);
    const diffInMs = now.getTime() - then.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  },

  //if date is past
  isPastDate: (date: string | Date): boolean => {
    return new Date(date) < new Date();
  },

 
  formatForInput: (date: string | Date): string => {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  },
};