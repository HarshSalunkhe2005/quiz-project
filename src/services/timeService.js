export const getServerHour = async () => {
  try {
    const response = await fetch('https://worldtimeapi.org/api/timezone/Asia/Kolkata');
    const data = await response.json();
    // data.datetime looks like "2026-02-03T01:48:..."
    const serverDate = new Date(data.datetime);
    return serverDate.getHours();
  } catch (error) {
    console.error("Time Sync Failed:", error);
    return null; // Return null so we can handle the fallback
  }
};