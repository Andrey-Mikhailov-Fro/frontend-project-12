import { string, object } from 'yup';

const validate = (values) => {
  const { password } = values;

  const schema = object({
    username: string().required().min(3).max(20),
    password: string().required().min(6),
    confirmPassword: string().required().min(6).oneOf([password]),
  });

  return schema.validate(values);
};

export default validate;
