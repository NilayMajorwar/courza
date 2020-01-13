import React from 'react';
import Input from '../input';
import Button from '../button';
import Text from '../text';
import loader from '../../assets/white-loader.svg';

const Form = props => {
  const { scheme, btnText, onSubmit } = props;
  const [formState, setFormState] = React.useState(scheme);
  const [submitting, setSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const _validateField = async (value, validator) => {
    try {
      await validator.validate(value);
      return '';
    } catch (error) {
      return error.message;
    }
  };

  const _validateForm = async () => {
    const state = [...formState];
    let valid = true;
    for (const [idx, field] of state.entries()) {
      const err = await _validateField(field.value, field.validator);
      if (err) valid = false;
      state[idx].error = err;
    }
    setFormState(state);
    return valid;
  };

  const _handleChange = async e => {
    const { name, value } = e.nativeEvent.target;
    const state = [...formState];
    const idx = state.findIndex(field => field.name === name);
    state[idx].value = value;
    setFormState(state);
  };

  const _handleSubmit = async e => {
    e.preventDefault();
    if (submitting) return;
    const formValid = await _validateForm();
    if (!formValid) return;
    let data = {};
    formState.forEach(field => (data[field.name] = field.value));
    setSubmitting(true);
    const message = await onSubmit(data);
    setMessage(message);
    setSubmitting(false);
  };

  return (
    <form onSubmit={_handleSubmit}>
      {formState.map((field, idx) => (
        <React.Fragment key={idx}>
          <Input
            type={field.type}
            onChange={_handleChange}
            placeholder={field.placeholder}
            name={field.name}
            spellCheck="false"
            value={field.value || ''}
            error={!!field.error}
          ></Input>
          <br></br>
          <Text note>{field.error}</Text>
        </React.Fragment>
      ))}
      <Button
        type="submit"
        block
        disabled={submitting}
        style={{ marginTop: 10 }}
      >
        {submitting ? (
          <img src={loader} style={{ width: 20 }} alt="Submitting..."></img>
        ) : (
          btnText
        )}
      </Button>
      <br></br>
      <Text>{message}</Text>
    </form>
  );
};

export default Form;
