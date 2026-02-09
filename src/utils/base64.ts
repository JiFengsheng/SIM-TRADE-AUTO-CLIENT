/**
 * Base64 工具类
 * 提供字符串与 Base64 编码之间的相互转换功能
 */
export class Base64Utils {
  /**
   * 将字符串转换为 Base64 编码
   * @param str 需要编码的字符串
   * @returns Base64 编码的字符串
   */
  static encode(str: string): string {
    try {
      // 在浏览器环境中使用 btoa，处理 UTF-8 字符
      if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
        return btoa(unescape(encodeURIComponent(str)));
      } else {
        // 在 Node.js 环境中使用 Buffer
        return Buffer.from(str, 'utf8').toString('base64');
      }
    } catch (error) {
      console.error('Base64 编码失败:', error);
      throw new Error('Base64 编码失败: ' + (error as Error).message);
    }
  }

  /**
   * 将 Base64 编码的字符串解码为原始字符串
   * @param base64Str Base64 编码的字符串
   * @returns 解码后的原始字符串
   */
  static decode(base64Str: string): string {
    try {
      // 在浏览器环境中使用 atob，处理 UTF-8 字符
      if (typeof window !== 'undefined' && typeof window.atob === 'function') {
        return decodeURIComponent(escape(atob(base64Str)));
      } else {
        // 在 Node.js 环境中使用 Buffer
        return Buffer.from(base64Str, 'base64').toString('utf8');
      }
    } catch (error) {
      console.error('Base64 解码失败:', error);
      throw new Error('Base64 解码失败: ' + (error as Error).message);
    }
  }

  /**
   * 检查字符串是否为有效的 Base64 编码
   * @param str 待检查的字符串
   * @returns 是否为有效的 Base64 编码
   */
  static isValidBase64(str: string): boolean {
    if (typeof str !== 'string') {
      return false;
    }

    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    return base64Regex.test(str) && str.length % 4 === 0;
  }

  /**
   * 从 Data URL 中提取 Base64 编码部分
   * @param dataUrl Data URL 字符串，如 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAAQABAAD'
   * @returns Base64 编码的字符串部分
   */
  static extractBase64FromDataUrl(dataUrl: string): string {
    if (!dataUrl.startsWith('data:')) {
      throw new Error('Invalid data URL format');
    }

    const base64Marker = ';base64,';
    const base64Index = dataUrl.indexOf(base64Marker);

    if (base64Index === -1) {
      throw new Error('Data URL does not contain base64 data');
    }

    return dataUrl.substring(base64Index + base64Marker.length);
  }

  /**
   * 将 Data URL 转换为二进制数据 (ArrayBuffer 或 Buffer)
   * @param dataUrl Data URL 字符串，如 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAAQABAAD'
   * @returns 二进制数据
   */
  static dataUrlToBinary(dataUrl: string): ArrayBuffer | Buffer {
    try {
      const base64String = Base64Utils.extractBase64FromDataUrl(dataUrl);
      
      if (typeof window !== 'undefined') {
        // 浏览器环境
        const binaryString = atob(base64String);
        const bytes = new Uint8Array(binaryString.length);
        
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        return bytes.buffer;
      } else {
        // Node.js 环境
        return Buffer.from(base64String, 'base64');
      }
    } catch (error) {
      console.error('Data URL to binary conversion failed:', error);
      throw new Error('Data URL to binary conversion failed: ' + (error as Error).message);
    }
  }

  /**
   * 将二进制数据转换为 Data URL
   * @param binaryData 二进制数据 (ArrayBuffer, Buffer 或 Uint8Array)
   * @param mimeType MIME 类型，如 'image/jpeg'
   * @returns Data URL 字符串
   */
  static binaryToDataUrl(binaryData: ArrayBuffer | Buffer | Uint8Array, mimeType: string): string {
    try {
      let base64String: string;
      
      if (typeof window !== 'undefined') {
        // 浏览器环境
        let bytes: Uint8Array;
        
        if (binaryData instanceof ArrayBuffer) {
          bytes = new Uint8Array(binaryData);
        } else if (ArrayBuffer.isView(binaryData)) {
          bytes = new Uint8Array(binaryData.buffer, binaryData.byteOffset, binaryData.byteLength);
        } else {
          bytes = binaryData as Uint8Array;
        }
        
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        
        base64String = btoa(binary);
      } else {
        // Node.js 环境
        let buffer: Buffer;
        
        if (binaryData instanceof Buffer) {
          buffer = binaryData;
        } else if (binaryData instanceof ArrayBuffer) {
          buffer = Buffer.from(binaryData);
        } else {
          buffer = Buffer.from(binaryData);
        }
        
        base64String = buffer.toString('base64');
      }
      
      return `data:${mimeType};base64,${base64String}`;
    } catch (error) {
      console.error('Binary to Data URL conversion failed:', error);
      throw new Error('Binary to Data URL conversion failed: ' + (error as Error).message);
    }
  }
}
