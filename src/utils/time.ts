/**
 * 将秒数转换为时分秒格式的字符串
 * @param seconds 秒数
 * @returns 格式化后的时间字符串，例如：1小时1分钟5秒、1分钟5秒、5秒
 */
export function formatSecondsToTime(seconds: number | null | undefined): string {
  if (seconds == null || seconds === 0) {
    return '-';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours}小时`);
  }

  if (minutes > 0) {
    parts.push(`${minutes}分钟`);
  }

  if (secs > 0) {
    parts.push(`${secs}秒`);
  }

  return parts.length > 0 ? parts.join('') : '0秒';
}
