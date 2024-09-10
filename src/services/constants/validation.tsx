const isValidPassword = (password: string) => {
    // Biểu thức chính quy để kiểm tra độ mạnh mật khẩu
    const regex = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/;
    return regex.test(password);
}

const isValidPhone = (phone: string) => {
    // Biểu thức chính quy kiểm tra số điện thoại VN
    const regex = /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
    return regex.test(phone)
}

export {
    isValidPassword,
    isValidPhone
}