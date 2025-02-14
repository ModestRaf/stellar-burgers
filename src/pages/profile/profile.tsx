import React, { FC, SyntheticEvent, useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { updateUserData } from '../../services/slices/userSlice';
import { ProfileUI } from '@ui-pages';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const initialState = useMemo(
    () => ({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    }),
    [user]
  );
  const [formValue, setFormValue] = useState(initialState);

  useEffect(() => setFormValue(initialState), [initialState]);

  const isFormChanged = useMemo(
    () =>
      formValue.name !== initialState.name ||
      formValue.email !== initialState.email ||
      !!formValue.password,
    [formValue, initialState]
  );
  const resetForm = () => setFormValue(initialState);
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(updateUserData(formValue));
    resetForm();
  };
  const handleInputChange = ({
    target
  }: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prev) => ({ ...prev, [target.name]: target.value }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={resetForm}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
