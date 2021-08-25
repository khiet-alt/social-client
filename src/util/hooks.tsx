import { useState } from 'react';
// type
import { Error } from '../pages/Register'

export const useForm = (callback: () => void, initialState = {}) => {
  const [values, setValues] = useState<Error>(initialState);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    callback();
  };

  return {
    onChange, onSubmit, values
  };
};
