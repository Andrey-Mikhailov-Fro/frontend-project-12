export default {
  translation: {
    header: {
      brand: 'Hexlet Chat',
      button: 'Выйти',
    },
    signUpForm: {
      username: 'Имя пользователя',
      password: 'Пароль',
      confirmPassword: 'Подтвердите пароль',
      button: 'Зарегистрироваться',
      errors: {
        required: 'Обязательное поле',
        usernameRules: 'От 3 до 20 символов',
        alreadyExist: 'Такой пользователь уже существует',
        minPassword: 'Не менее 6 символов',
        passwordMatch: 'Пароли должны совпадать',
      },
    },
    signInForm: {
      error: 'Неверные имя пользователя или пароль',
      username: 'Ваш ник',
      password: 'Пароль',
      button: 'Войти',
      haveAccount: 'Нет аккаунта?',
      registration: 'Регистрация',
    },
    chat: {
      channels: 'Каналы',
      message: 'Введите сообщение...',
      send: 'Отправить',
      count_one: '{{count}} сообщение',
      count_few: '{{count}} сообщения',
      count_many: '{{count}} сообщений',
      dropdownButton: {
        hiddenLabel: 'Управление каналом',
        delete: 'Удалить',
        edit: 'Переименовать',
      },
    },
    modals: {
      createHeader: 'Добавить канал',
      editHeader: 'Переименовать канал',
      deleteHeader: 'Удалить канал',
      deleteBody: 'Уверены?',
      cancel: 'Отменить',
      confirmCreate: 'Создать',
      confirmEdit: 'Отправить',
      confirmDelete: 'Удалить',
      errors: {
        exist: 'Должно быть уникальным',
        rules: 'От 3 до 20 символов',
      },
    },
    toasts: {
      create: 'Канал создан',
      edit: 'Канал переименован',
      delete: 'Канал удалён',
      connectionError: 'Ошибка соединения',
    },
  },
};
