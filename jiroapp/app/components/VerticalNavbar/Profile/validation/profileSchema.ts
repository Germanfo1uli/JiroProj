import * as Yup from 'yup';

export const profileSchema = Yup.object({
    name: Yup.string()
        .required('Имя обязательно для заполнения')
        .min(2, 'Имя должно содержать минимум 2 символа')
        .max(50, 'Имя не должно превышать 50 символов'),
    email: Yup.string()
        .required('Email обязателен для заполнения')
        .email('Введите корректный email'),
    position: Yup.string()
        .required('Должность обязательна для заполнения')
        .min(2, 'Должность должна содержать минимум 2 символа')
        .max(30, 'Должность не должна превышать 30 символов'),
    bio: Yup.string()
        .max(500, 'Описание не должно превышать 500 символов')
});