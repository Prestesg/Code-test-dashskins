export const userFormValidation = (userForm,formErrorHandler) => {
    const errors:any = {};
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    Object.keys(userForm).forEach(key => {
        switch (key) {
            case "name":
                errors[key] = userForm[key].length > 0?true:false;
                break;
            case "email":
                errors[key] = userForm[key].match(mailformat)?true:false;
                break;
            case "age":
                errors[key] = userForm[key] <= 120 && userForm[key] >= 18 ?true:false;
                break;
            default:
                break;
        }
    });
    formErrorHandler(errors);
    return Object.values(errors).includes(false)
}

export default userFormValidation;