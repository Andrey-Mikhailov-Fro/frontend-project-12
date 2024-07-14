import { string } from 'yup';

const validate = (channelName, existingNames) => {
  const schema = string()
    .required('signUpForm.errors.required')
    .min(3, 'modals.errors.rules')
    .max(20, 'modals.errors.rules')
    .notOneOf(existingNames, 'modals.errors.exist');

  return schema.validate(channelName);
};

export default validate;
