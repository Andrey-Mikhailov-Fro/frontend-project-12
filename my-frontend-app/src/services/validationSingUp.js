import { string, object, ref } from 'yup';

const schema = object().shape({
  username: string().required('signUpForm.errors.required').min(3, 'signUpForm.errors.usernameRules').max(20, 'signUpForm.errors.usernameRules'),
  password: string().required('signUpForm.errors.required').min(6, 'signUpForm.errors.minPassword'),
  confirmPassword: string().required('signUpForm.errors.required').oneOf([ref('password'), null], 'signUpForm.errors.passwordMatch'),
});

export default schema;
