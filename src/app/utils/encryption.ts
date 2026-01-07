import CryptoJS from 'crypto-js';

export const encrypt=(data:string)=>{
    let key = CryptoJS.enc.Utf8.parse('8080808080808080');
    let iv = CryptoJS.enc.Utf8.parse('8080808080808080');
    let encryptedData = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data), key,
        {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }).toString();
    return encryptedData;
}

export const decrypt=(data:string)=>{
    let key = CryptoJS.enc.Utf8.parse('8080808080808080');
    let iv = CryptoJS.enc.Utf8.parse('8080808080808080');
    let cleanData = '';
    [...data].forEach((item,index)=>{
        let char = item
        if(item==' ')
            char='+'
        cleanData += char
    })



    let decryptedData = CryptoJS.AES.decrypt(cleanData, key,
        {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }).toString(CryptoJS.enc.Utf8);
    return decryptedData;
}