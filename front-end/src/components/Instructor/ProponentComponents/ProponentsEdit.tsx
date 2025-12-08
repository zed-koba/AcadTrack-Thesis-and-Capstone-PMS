import type { ProponentsEditProps } from '../interface/proponent';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowRightToLine } from 'lucide-react';
import * as z from 'zod';
import { useForm } from '@tanstack/react-form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiUrl } from '@/components/Routes/http';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { Spinner } from '@/components/ui/spinner';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';

const proponentDetailsSchema = z.object({
  name: z.string().optional(),
});

const proponentSchema = z.object({
  academic_yr: z.string().min(1, 'Title is required'),
  title: z.string().min(1, 'Title is required'),
  semester: z.number().min(1, 'Must select a semester').max(2),
  program: z.string().min(1, 'Program is required'),
  adviser: z.string().min(1, 'Adviser is required'),
  details: z.array(proponentDetailsSchema).min(1),
});

const ProponetsEdit = ({
  open,
  setOpen,
  proponent,
  onSuccess,
}: ProponentsEditProps) => {
  const [loading, setLoading] = useState(false);
  type formValues = z.infer<typeof proponentSchema>;
  const defaultValues: formValues = {
    academic_yr: proponent.academic_yr,
    title: proponent.title,
    semester: proponent.semester,
    program: proponent.program,
    adviser: proponent.adviser,
    details: proponent.details,
  };

  const form = useForm({
    defaultValues,
    validators: {
      onChange: proponentSchema,
      onSubmit: proponentSchema,
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
    },
  });

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce}
        />
        <DialogContent className="text-white">
          <DialogHeader>
            <DialogTitle>Edit Proponent: {proponent.proponents_id}</DialogTitle>
            <DialogDescription>
              Update the details of this project member.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field
                name="title"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Ex. Web Based Project Management System"
                        autoComplete="off"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <div className="grid grid-cols-2 gap-2">
                <form.Field
                  name="academic_yr"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Academic Year
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          placeholder="Ex. 2024-2025"
                          autoComplete="off"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
                <form.Field
                  name="semester"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Semester</FieldLabel>
                        <Select
                          name={field.name}
                          value={
                            field.state.value ? String(field.state.value) : ''
                          }
                          onValueChange={(v) => field.handleChange(Number(v))}
                        >
                          <SelectTrigger
                            className="w-auto"
                            aria-invalid={isInvalid}
                            id={field.name}
                          >
                            <SelectValue placeholder="Select Semester" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1st Semester</SelectItem>
                            <SelectItem value="2">2nd Semester</SelectItem>
                          </SelectContent>
                        </Select>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <form.Field
                    name="adviser"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Adviser</FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            aria-invalid={isInvalid}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            autoComplete="off"
                            placeholder="Ex. Jay De Sagun"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />
                </div>
                <form.Field
                  name="program"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Program</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          aria-invalid={isInvalid}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          autoComplete="off"
                          placeholder="Ex. BSCS"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
              </div>
              <div className="pt-2 flex flex-col gap-4">
                <form.Field
                  name="details"
                  children={(field) => {
                    const arrayErrors = field.state.meta.errors;
                    return (
                      <>
                        <div className="flex flex-col gap-1">
                          <h2 className="text-white text-lg">Proponents: </h2>
                          {arrayErrors.length > 0 && (
                            <p className="text-destructive text-md font-normal">
                              {arrayErrors[0]?.message}
                            </p>
                          )}
                        </div>
                        <form.Field
                          name={`details[0].name`}
                          children={(subfield) => {
                            const isInvalid =
                              subfield.state.meta.isTouched &&
                              !subfield.state.meta.isValid;
                            return (
                              <Field data-invalid={isInvalid}>
                                <Input
                                  id={subfield.name}
                                  name={subfield.name}
                                  value={subfield.state.value}
                                  aria-invalid={isInvalid}
                                  onBlur={subfield.handleBlur}
                                  onChange={(e) => {
                                    subfield.handleChange(e.target.value);
                                  }}
                                  autoComplete="off"
                                  placeholder="Ex. Nathan Pabingwit"
                                />
                              </Field>
                            );
                          }}
                        />
                        <form.Field
                          name={`details[1].name`}
                          children={(subfield) => {
                            const isInvalid =
                              subfield.state.meta.isTouched &&
                              !subfield.state.meta.isValid;
                            return (
                              <Field data-invalid={isInvalid}>
                                <Input
                                  id={subfield.name}
                                  name={subfield.name}
                                  value={subfield.state.value}
                                  aria-invalid={isInvalid}
                                  onBlur={subfield.handleBlur}
                                  onChange={(e) =>
                                    subfield.handleChange(e.target.value)
                                  }
                                  autoComplete="off"
                                  placeholder="Ex. John Fritz Selloria"
                                />
                              </Field>
                            );
                          }}
                        />
                        <form.Field
                          name={`details[2].name`}
                          children={(subfield) => {
                            const isInvalid =
                              subfield.state.meta.isTouched &&
                              !subfield.state.meta.isValid;
                            return (
                              <Field data-invalid={isInvalid}>
                                <Input
                                  id={subfield.name}
                                  name={subfield.name}
                                  value={subfield.state.value}
                                  aria-invalid={isInvalid}
                                  onBlur={subfield.handleBlur}
                                  onChange={(e) =>
                                    subfield.handleChange(e.target.value)
                                  }
                                  autoComplete="off"
                                  placeholder="Ex. Cedric Vhon Pidlaoan"
                                />
                              </Field>
                            );
                          }}
                        />
                        <form.Field
                          name={`details[3].name`}
                          children={(subfield) => {
                            const isInvalid =
                              subfield.state.meta.isTouched &&
                              !subfield.state.meta.isValid;
                            return (
                              <Field data-invalid={isInvalid}>
                                <Input
                                  id={subfield.name}
                                  name={subfield.name}
                                  value={subfield.state.value}
                                  aria-invalid={isInvalid}
                                  onBlur={subfield.handleBlur}
                                  onChange={(e) =>
                                    subfield.handleChange(e.target.value)
                                  }
                                  autoComplete="off"
                                  placeholder="Ex. John Michael Borromeo"
                                />
                              </Field>
                            );
                          }}
                        />
                      </>
                    );
                  }}
                />
              </div>
            </FieldGroup>
            <div className="flex justify-end pt-4 gap-3">
              <Button
                className="cursor-pointer"
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="cursor-pointer"
                type="submit"
                variant="edit"
                disabled={loading}
              >
                {loading ? <Spinner /> : ''}
                {loading ? 'Updating...' : 'Update'}
                {loading ? '' : <ArrowRightToLine />}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProponetsEdit;
