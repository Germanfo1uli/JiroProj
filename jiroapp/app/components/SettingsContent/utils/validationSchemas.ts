import * as yup from 'yup';

export const settingsValidationSchema = yup.object({
    projectName: yup
        .string()
        .required('Название проекта обязательно')
        .min(3, 'Название должно содержать минимум 3 символа')
        .max(50, 'Название не должно превышать 50 символов'),
    description: yup
        .string()
        .max(500, 'Описание не должно превышать 500 символов'),
    avatar: yup
        .string()
        .url('Аватар должен быть валидной ссылкой')
});