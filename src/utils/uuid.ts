/**
 * 生成UUID v4
 * @returns {string} UUID字符串
 */
export const generateUUID = (): string => {
  // 使用crypto API（如果可用）以获得更好的随机性，否则回退到Math.random()
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // 回退实现
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * 生成短UUID（不包含连字符）
 * @returns {string} 短UUID字符串
 */
export const generateShortUUID = (): string => {
  return generateUUID().replace(/-/g, '');
};
