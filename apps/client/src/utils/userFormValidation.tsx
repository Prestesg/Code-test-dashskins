export const userFormValidation = (userForm,formErrorHandler) => {
    const errors:any = {
        name:false,
        age:false,
        email:false
    };
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    Object.keys(userForm).forEach(key => {
        switch (key) {
            case "name":
                errors[key] = userForm[key].length > 0?false:true;
                break;
            case "email":
                errors[key] = userForm[key].match(mailformat)?false:true;
                break;
            case "age":
                errors[key] = userForm[key] <= 120 && userForm[key] >= 18 ?false:true;
                break;
            default:
                break;
        }
    });
    formErrorHandler(errors);
    return Object.values(errors).includes(true)
}

export default userFormValidation;