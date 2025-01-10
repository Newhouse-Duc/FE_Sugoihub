import * as Yup from 'yup';

export const validateLoginSchema = Yup.object({
    email: Yup.string().email('Email không hợp lệ').required("Hãy nhập email"),
    password: Yup.string().min(6).required("Hãy nhập password hợp lệ")
});


export const validateForgotPasswordSchema = Yup.object({
    email: Yup.string().email('Email không hợp lệ').required("Hãy nhập email"),
});

export const validateResetPasswordSchema = Yup.object({
    newpassword: Yup.string().min(6, 'Mật khẩu tối thiểu 6 kí tự').required("Hãy nhập password hợp lệ"),
    repassword: Yup.string()
        .oneOf([Yup.ref("newpassword"), null], "Mật khẩu xác nhận không khớp")
        .required("Hãy nhập mật khẩu xác nhận"),

});
export const validateRegisterSchema = Yup.object({
    username: Yup.string().required("hãy điền tên người dùng"),
    email: Yup.string().email('Email không hợp lệ').required("Hãy nhập email"),
    day: Yup.number().required("Chọn ngày"),
    month: Yup.number().required("Chọn tháng"),
    year: Yup.number()
        .required("Chọn năm")
        .test("is-old-enough", "Bạn phải trên 18 tuổi", function (value) {
            const { day, month } = this.parent;
            const birthDate = new Date(value, month - 1, day);
            const ageDiff = Date.now() - birthDate.getTime();
            const ageDate = new Date(ageDiff);
            return Math.abs(ageDate.getUTCFullYear() - 1970) >= 18;
        }),
    password: Yup.string().min(6, 'Mật khẩu tối thiểu 6 kí tự').required("Hãy nhập password hợp lệ"),
    repassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Mật khẩu xác nhận không khớp")
        .required("Hãy nhập mật khẩu xác nhận"),

});

export const validateVerifyOtpSchema = Yup.object({
    otp: Yup.array()
        .test('is-complete', 'Điền đủ 6 số', (value) => {
            return value && value.length === 6 && value.every((v) => /^[0-9]$/.test(v));
        })
});

export const validateLoginAdminSchema = Yup.object({
    username: Yup.string().required("Hãy nhập tài khoản"),
    password: Yup.string().min(6).required("Hãy nhập password")
})


export const validationDateSchema = Yup.object({

    day: Yup.number().required("Chọn ngày"),
    month: Yup.number().required("Chọn tháng"),
    year: Yup.number()
        .required("Chọn năm")
        .test("is-old-enough", "Bạn phải trên 18 tuổi", function (value) {
            const { day, month } = this.parent;
            const birthDate = new Date(value, month - 1, day);
            const ageDiff = Date.now() - birthDate.getTime();
            const ageDate = new Date(ageDiff);
            return Math.abs(ageDate.getUTCFullYear() - 1970) >= 18;
        }),


});