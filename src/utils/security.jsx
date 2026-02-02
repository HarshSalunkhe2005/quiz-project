export const isIST = () => {
  const offset = new Date().getTimezoneOffset();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // India is UTC +5:30, which is -330 minutes in JS offset
  const hasCorrectOffset = offset === -330;
  
  // Common strings for Indian timezones
  const validZones = ['Asia/Kolkata', 'Asia/Chennai', 'Asia/New Delhi', 'Asia/Mumbai', 'Asia/Calcutta'];
  const hasCorrectZone = validZones.includes(timezone);

  return hasCorrectOffset && hasCorrectZone;
};