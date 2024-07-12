import { string } from 'yup';

const validate = (channelName, existingNames) => {
  const schema = string()
    .min(3)
    .max(20)
    .notOneOf(existingNames);

  return schema.validate(channelName);
};

export default validate;
