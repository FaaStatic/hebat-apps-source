const maxFractionDigits = 2;
const maxFractionDigitsDua = 3;
const thousandSeparator = '.';
export const NomorNOPFormat = (value) => {
    var result;
    let valueDimensiSatu = Math.ceil(value.substring(0, 4))
    let valueDimensiDua = Math.ceil(value.substring(4, 13))
    let valueDimensiDuaFrist = value.substring(5, 4)
    let valueDimensiTiga = value.substring(13, 17)
    let valueDimensiEmpat = value.substring(17, 18)
    const valueSplit = String(valueDimensiSatu.toFixed(maxFractionDigits)).split(`${thousandSeparator}`);
    const firstvalue = valueSplit[0];
    const secondvalue = valueSplit[1];
    const valueReal = String(firstvalue).replace(/\B(?=(\d{2})+(?!\d))/g, `${thousandSeparator}`);
    const valueSplitDua = String(valueDimensiDua.toFixed(maxFractionDigitsDua)).split(`${thousandSeparator}`);
    const firstvalueDua = valueSplitDua[0];
    const secondvalueDua = valueSplitDua[1];
    const valueRealDua = String(firstvalueDua).replace(/\B(?=(\d{3})+(?!\d))/g, `${thousandSeparator}`);
    if (value.length <= 3) {
        if (Number(secondvalue) > 0) {
            result = `${valueReal}${thousandSeparator}${secondvalue}`;
        } else {
            result = valueReal
        }
    } else if (value.length <= 12) {
        if (Number(secondvalueDua) > 0) {
            result = `${valueReal}${thousandSeparator}${valueRealDua}${thousandSeparator}${secondvalueDua}`;
        } else {
            result = `${valueReal}${thousandSeparator}${valueRealDua}`
        }
    } else if (value.length <= 17) {
        result = `${valueReal}${thousandSeparator}${valueRealDua}${thousandSeparator}${valueDimensiTiga}`
    } else {
        result = `${valueReal}${thousandSeparator}${valueDimensiDuaFrist == 0 ? valueDimensiDuaFrist : ''}${valueRealDua}${thousandSeparator}${valueDimensiTiga}${thousandSeparator}${valueDimensiEmpat}`
    }
    return result;
};
