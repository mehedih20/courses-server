export const getFormattedTime = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hrs = date.getHours();
  const mins = date.getMinutes().toString().padStart(2, "0");
  const timeFormat = hrs < 12 ? "AM" : "PM";

  const requiredTime = `${year}-${month}-${day} at ${
    hrs % 12 || 12
  }:${mins} ${timeFormat}`;

  return requiredTime;
};
