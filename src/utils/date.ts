/**
 * 格式化日期工具类
 */

/**
 * 格式化日期为指定格式
 * @param date 日期对象或日期字符串
 * @param format 格式字符串，默认为 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期字符串
 */
export const formatDate = (date: Date | string | number, format: string = 'YYYY-MM-DD HH:mm:ss'): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date');
  }
  
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const seconds = String(dateObj.getSeconds()).padStart(2, '0');
  const milliseconds = String(dateObj.getMilliseconds()).padStart(3, '0');

  return format
    .replace(/YYYY/g, String(year))
    .replace(/MM/g, month)
    .replace(/DD/g, day)
    .replace(/HH/g, hours)
    .replace(/mm/g, minutes)
    .replace(/ss/g, seconds)
    .replace(/SSS/g, milliseconds);
};

/**
 * 获取当前日期时间
 * @param format 格式字符串，默认为 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的当前日期时间字符串
 */
export const getCurrentDateTime = (format: string = 'YYYY-MM-DD HH:mm:ss'): string => {
  return formatDate(new Date(), format);
};

/**
 * 获取当前日期
 * @param format 格式字符串，默认为 'YYYY-MM-DD'
 * @returns 格式化后的当前日期字符串
 */
export const getCurrentDate = (format: string = 'YYYY-MM-DD'): string => {
  return formatDate(new Date(), format);
};

/**
 * 获取当前时间
 * @param format 格式字符串，默认为 'HH:mm:ss'
 * @returns 格式化后的当前时间字符串
 */
export const getCurrentTime = (format: string = 'HH:mm:ss'): string => {
  return formatDate(new Date(), format);
};

/**
 * 计算两个日期之间的差异
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @param unit 返回单位，默认为 'milliseconds'
 * @returns 日期差异值
 */
export const dateDiff = (
  startDate: Date | string | number,
  endDate: Date | string | number,
  unit: 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years' = 'milliseconds'
): number => {
  const startDateObj = startDate instanceof Date ? startDate : new Date(startDate);
  const endDateObj = endDate instanceof Date ? endDate : new Date(endDate);
  
  if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
    throw new Error('Invalid date');
  }
  
  const diffInMs = endDateObj.getTime() - startDateObj.getTime();
  
  switch (unit) {
    case 'seconds':
      return diffInMs / 1000;
    case 'minutes':
      return diffInMs / (1000 * 60);
    case 'hours':
      return diffInMs / (1000 * 60 * 60);
    case 'days':
      return diffInMs / (1000 * 60 * 60 * 24);
    case 'weeks':
      return diffInMs / (1000 * 60 * 60 * 24 * 7);
    case 'months':
      return diffInMs / (1000 * 60 * 60 * 24 * 30); // 近似值
    case 'years':
      return diffInMs / (1000 * 60 * 60 * 24 * 365); // 近似值
    default:
      return diffInMs;
  }
};

/**
 * 日期格式化为相对时间（如：2小时前、昨天等）
 * @param date 日期
 * @returns 相对时间字符串
 */
export const formatToRelativeTime = (date: Date | string | number): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date');
  }
  
  if (diffInSeconds < 0) {
    // 未来时间
    const futureDiffInSeconds = Math.abs(diffInSeconds);
    if (futureDiffInSeconds < 60) return `还有 ${futureDiffInSeconds} 秒`;
    if (futureDiffInSeconds < 3600) return `还有 ${Math.floor(futureDiffInSeconds / 60)} 分钟`;
    if (futureDiffInSeconds < 86400) return `还有 ${Math.floor(futureDiffInSeconds / 3600)} 小时`;
    return formatDate(dateObj, 'YYYY-MM-DD HH:mm');
  }
  
  if (diffInSeconds < 60) return '刚刚';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} 分钟前`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} 小时前`;
  if (diffInSeconds < 172800) return '昨天';
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} 天前`;
  if (diffInSeconds < 5184000) return '一个月前';
  
  return formatDate(dateObj, 'YYYY-MM-DD HH:mm');
};

/**
 * 添加指定时间间隔到日期
 * @param date 原始日期
 * @param interval 时间间隔类型
 * @param count 要添加的数量
 * @returns 新的日期
 */
export const addTime = (
  date: Date | string | number,
  interval: 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years',
  count: number
): Date => {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date');
  }
  
  switch (interval) {
    case 'milliseconds':
      return new Date(dateObj.getTime() + count);
    case 'seconds':
      return new Date(dateObj.getTime() + count * 1000);
    case 'minutes':
      return new Date(dateObj.getTime() + count * 60 * 1000);
    case 'hours':
      return new Date(dateObj.getTime() + count * 60 * 60 * 1000);
    case 'days':
      return new Date(dateObj.getTime() + count * 24 * 60 * 60 * 1000);
    case 'weeks':
      return new Date(dateObj.getTime() + count * 7 * 24 * 60 * 60 * 1000);
    case 'months':
      return new Date(dateObj.getFullYear(), dateObj.getMonth() + count, dateObj.getDate(), 
        dateObj.getHours(), dateObj.getMinutes(), dateObj.getSeconds(), dateObj.getMilliseconds());
    case 'years':
      return new Date(dateObj.getFullYear() + count, dateObj.getMonth(), dateObj.getDate(), 
        dateObj.getHours(), dateObj.getMinutes(), dateObj.getSeconds(), dateObj.getMilliseconds());
    default:
      return dateObj;
  }
};
