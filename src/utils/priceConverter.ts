/**
 * 人民币金额转中文大写（元角分），逻辑对齐 Java `PriceConverter`：
 * 四位一节 + 万/亿/兆… + 角分。
 */

const CHINESE_NUMBERS = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'] as const;

/** 节内：个、十、百、千（与 Java 下标一致：unitPos = 3 - i） */
const UNITS = ['', '拾', '佰', '仟'];

/** 节间大单位（可继续扩展） */
const BIG_UNITS = [
  '',
  '万',
  '亿',
  '兆',
  '京',
  '垓',
  '秭',
  '穰',
  '沟',
  '涧',
  '正',
  '载',
  '极',
];

function isAllDigits(s: string): boolean {
  return /^[0-9]+$/.test(s);
}

/** 与 BigDecimal.setScale(2, HALF_UP).toPlainString() 对齐 */
function splitIntegerDecimalScaled2(price: number | string): { integerPart: string; decimalPart: string } {
  const num = typeof price === 'string' ? parseFloat(price.trim()) : price;
  if (num == null || !Number.isFinite(num)) {
    throw new Error('价格无效');
  }
  if (num < 0) {
    throw new Error('价格不能小于0');
  }
  const scaled = Math.round(num * 100) / 100;
  const [a, b = '00'] = scaled.toFixed(2).split('.');
  return { integerPart: a, decimalPart: b };
}

function convertFourDigitGroup(group: string): string {
  let sb = '';
  let zeroFlag = false;
  for (let i = 0; i < group.length; i++) {
    const digit = group.charCodeAt(i) - 48;
    const unitPos = 3 - i;
    if (digit === 0) {
      zeroFlag = true;
    } else {
      if (zeroFlag && sb.length > 0) {
        sb += CHINESE_NUMBERS[0];
      }
      sb += CHINESE_NUMBERS[digit] + UNITS[unitPos];
      zeroFlag = false;
    }
  }
  return sb;
}

function convertToChinesePart(numberStr: string): string {
  if (numberStr === '0') {
    return CHINESE_NUMBERS[0];
  }

  const len = numberStr.length;
  const groupCount = Math.floor((len + 3) / 4);
  const groups: string[] = [];

  let end = len;
  for (let g = groupCount - 1; g >= 0; g--) {
    const start = Math.max(0, end - 4);
    const group = numberStr.slice(start, end);
    groups[g] = group.padStart(4, '0');
    end = start;
  }

  let result = '';
  let zeroBefore = false;

  for (let g = 0; g < groupCount; g++) {
    const groupStr = groups[g];
    const allZero = groupStr === '0000';
    if (allZero) {
      if (result.length > 0) {
        zeroBefore = true;
      }
      continue;
    }

    const groupChinese = convertFourDigitGroup(groupStr);
    if (groupChinese.length === 0) {
      continue;
    }

    if (
      zeroBefore &&
      result.length > 0 &&
      result.charAt(result.length - 1) !== CHINESE_NUMBERS[0].charAt(0)
    ) {
      result += CHINESE_NUMBERS[0];
    }
    zeroBefore = false;

    if (g > 0) {
      const prevGroup = groups[g - 1];
      if (prevGroup !== '0000' && groupStr.charAt(0) === '0') {
        if (result.length > 0 && result.charAt(result.length - 1) !== CHINESE_NUMBERS[0].charAt(0)) {
          result += CHINESE_NUMBERS[0];
        }
      }
    }

    result += groupChinese;

    const bigUnitIndex = groupCount - 1 - g;
    if (bigUnitIndex > 0 && bigUnitIndex < BIG_UNITS.length) {
      result += BIG_UNITS[bigUnitIndex];
    }
  }

  return result.length === 0 ? CHINESE_NUMBERS[0] : result;
}

function convertToDecimalChinese(decimalPart: string): string {
  let sb = '';
  if (decimalPart.charAt(0) !== '0') {
    sb += CHINESE_NUMBERS[parseInt(decimalPart.charAt(0), 10)] + '角';
  }
  if (decimalPart.length > 1 && decimalPart.charAt(1) !== '0') {
    sb += CHINESE_NUMBERS[parseInt(decimalPart.charAt(1), 10)] + '分';
  }
  return sb;
}

/**
 * 金额转中文大写（含元角分，整数为「…元」，两位小数 00 不读角分）
 *
 * @param price 非负；`string` 形式可支持较大整数（避免浮点误差）
 */
export function convertPriceToChinese(price: number | string): string {
  const { integerPart, decimalPart } = splitIntegerDecimalScaled2(price);

  if (!isAllDigits(integerPart)) {
    throw new Error('价格格式无效');
  }

  const normalizedInt = integerPart.replace(/^0+(?=\d)/, '') || '0';

  const integerChinese = convertToChinesePart(normalizedInt);

  let decimalChinese = '';
  if (decimalPart !== '00') {
    decimalChinese = convertToDecimalChinese(decimalPart);
  }

  return integerChinese + '元' + decimalChinese;
}
