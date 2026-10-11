'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2, Send, TriangleAlert } from 'lucide-react';

type Fields = { name: string; email: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

const MESSAGE_MAX = 2000;

// Mirrors the rules in /api/contact
function validate(values: Fields): Errors {
  const errors: Errors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const message = values.message.trim();

  if (name.length < 2) errors.name = 'Enter your name (at least 2 characters).';
  else if (name.length > 100)
    errors.name = 'Keep your name under 100 characters.';

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = 'Enter a valid email address, like name@example.com.';

  if (message.length < 10)
    errors.message = 'Write a message of at least 10 characters.';
  else if (message.length > MESSAGE_MAX)
    errors.message = `Keep your message under ${MESSAGE_MAX} characters.`;

  return errors;
}

const inputClass =
  'w-full rounded-md border bg-bg px-4 py-3 text-base text-fg placeholder:text-muted transition-colors duration-200';

export function ContactForm() {
  const [values, setValues] = useState<Fields>({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [serverError, setServerError] = useState('');

  const update = (field: keyof Fields, value: string) => {
    setValues(current => ({ ...current, [field]: value }));
    if (errors[field])
      setErrors(current => ({ ...current, [field]: undefined }));
    if (status !== 'loading') setStatus('idle');
  };

  const validateField = (field: keyof Fields) => {
    setErrors(current => ({ ...current, [field]: validate(values)[field] }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const found = validate(values);
    setErrors(found);
    const firstInvalid = (['name', 'email', 'message'] as const).find(
      field => found[field]
    );
    if (firstInvalid) {
      document.getElementById(`contact-${firstInvalid}`)?.focus();
      return;
    }

    setStatus('loading');
    setServerError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
        }),
      });

      if (!res.ok) throw new Error('Request failed');

      setValues({ name: '', email: '', message: '' });
      setStatus('success');
    } catch {
      setServerError(
        'Your message could not be sent. Check your connection and try again, or email me directly.'
      );
      setStatus('error');
    }
  };

  const fieldProps = (field: keyof Fields) => ({
    id: `contact-${field}`,
    name: field,
    value: values[field],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      update(field, e.target.value),
    onBlur: () => values[field] && validateField(field),
    'aria-invalid': errors[field] ? true : undefined,
    'aria-describedby': errors[field] ? `contact-${field}-error` : undefined,
    className: `${inputClass} ${
      errors[field] ? 'border-danger' : 'border-line-strong'
    }`,
  });

  const errorText = (field: keyof Fields) =>
    errors[field] && (
      <p
        id={`contact-${field}-error`}
        className="mt-2 flex items-start gap-1.5 text-sm text-danger"
      >
        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        {errors[field]}
      </p>
    );

  return (
    <form onSubmit={onSubmit} noValidate className="panel space-y-5 p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="mb-2 block font-mono text-sm text-fg"
          >
            Name
          </label>
          <input
            type="text"
            autoComplete="name"
            required
            maxLength={100}
            {...fieldProps('name')}
          />
          {errorText('name')}
        </div>

        <div>
          <label
            htmlFor="contact-email"
            className="mb-2 block font-mono text-sm text-fg"
          >
            Email
          </label>
          <input
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            maxLength={200}
            {...fieldProps('email')}
          />
          {errorText('email')}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <label
            htmlFor="contact-message"
            className="font-mono text-sm text-fg"
          >
            Message
          </label>
          <span className="font-mono text-xs text-muted" aria-hidden="true">
            {values.message.length}/{MESSAGE_MAX}
          </span>
        </div>
        <textarea
          rows={6}
          required
          maxLength={MESSAGE_MAX}
          placeholder="Tell me about your project, timeline and budget."
          {...fieldProps('message')}
        />
        {errorText('message')}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn btn-accent group shrink-0"
        >
          {status === 'loading' ? (
            <>
              <Loader2
                className="h-4 w-4 animate-spin motion-reduce:animate-none"
                aria-hidden="true"
              />
              Sending
            </>
          ) : (
            <>
              Send message
              <Send
                className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </>
          )}
        </button>

        <div aria-live="polite" className="text-sm">
          {status === 'success' && (
            <p className="flex items-start gap-2 text-brand">
              <CheckCircle2
                className="mt-0.5 h-4 w-4 shrink-0"
                aria-hidden="true"
              />
              Message sent. Thank you, I will reply soon.
            </p>
          )}
          {status === 'error' && (
            <p className="flex items-start gap-2 text-danger">
              <TriangleAlert
                className="mt-0.5 h-4 w-4 shrink-0"
                aria-hidden="true"
              />
              {serverError}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
