import Joi from 'joi';


export const registerUserSchema = Joi.object().keys({
    fullName: Joi.string().required(),
    email: Joi.string().trim().lowercase().required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    confirm_password: Joi.any().equal(Joi.ref('password')).required().label('Confirm password').messages({'any.only': '{{#label}} does not match'}),
    gender: Joi.string().valid('male', 'female','transger', 'others'),
    phone: Joi.string().regex(/^\+?\d{1,3}?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/).required(),
    address: Joi.string().required()
})

export const options = {
    abortEarly:false,
    errors:{
        wrap:{
            label: ''
        }
    }
}

export const loginUserSchema = Joi.object().keys({
    email: Joi.string().trim().lowercase().required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
})
export const createNoteSchema = Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().lowercase().required(),
    dueDate: Joi.string().required(),
    status: Joi.string().required(),
})
export const updateNoteSchema = Joi.object().keys({
    status: Joi.string(),
})