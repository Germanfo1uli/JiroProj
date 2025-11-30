import * as Yup from 'yup';

export const profileSchema = Yup.object({
    name: Yup.string()
        .required('Имя обязательно для заполнения')
        .min(3, 'Имя должно содержать минимум 3 символа')
        .max(50, 'Имя не должно превышать 50 символов')
        .matches(/^[a-zA-Z]+$/, 'Имя должно содержать только английские буквы'),
    email: Yup.string()
        .required('Email обязателен для заполнения')
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Введите корректный email (например, user@example.com)'
        ),
    bio: Yup.string()
        .max(500, 'Описание не должно превышать 500 символов')
});