"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNoteSchema = exports.createNoteSchema = exports.loginUserSchema = exports.options = exports.registerUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerUserSchema = joi_1.default.object().keys({
    fullName: joi_1.default.string().required(),
    email: joi_1.default.string().trim().lowercase().required(),
    password: joi_1.default.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    confirm_password: joi_1.default.any().equal(joi_1.default.ref('password')).required().label('Confirm password').messages({ 'any.only': '{{#label}} does not match' }),
    gender: joi_1.default.string().valid('male', 'female', 'transger', 'others'),
    phone: joi_1.default.string().regex(/^\+?\d{1,3}?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/).required(),
    address: joi_1.default.string().required()
});
exports.options = {
    abortEarly: false,
    errors: {
        wrap: {
            label: ''
        }
    }
};
exports.loginUserSchema = joi_1.default.object().keys({
    email: joi_1.default.string().trim().lowercase().required(),
    password: joi_1.default.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
});
exports.createNoteSchema = joi_1.default.object().keys({
    title: joi_1.default.string().required(),
    description: joi_1.default.string().lowercase().required(),
    dueDate: joi_1.default.string().required(),
    status: joi_1.default.string().required(),
});
exports.updateNoteSchema = joi_1.default.object().keys({
    status: joi_1.default.string(),
});
