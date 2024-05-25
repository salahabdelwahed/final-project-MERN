import { check, validationResult } from "express-validator";

//rules of validation
export const validationRegister = () => {
  return [
    check("username", "username is required").not().isEmpty(),
    check("email", "please enter your validator email").isEmail(),
    check("pzssword", "enter a strong password").isStrongPassword(),
  ];
};
//end

export const validateLogin = () => {
  return [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "enter a strong password").isStrongPassword(),
];
};

//fuc for handel error from validation
export const validation = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.array().length>0) { 
      
      return res
        .status(400)
        .json({  errors : errors.array().map((error)=>error.msg) });
    }
    next();
    
  };
//end
