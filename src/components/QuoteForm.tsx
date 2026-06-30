"use client";

import { useState } from "react";
import { contactContent } from "@/content/contact";
import { products } from "@/content/products";

function fieldName(label: string) {
  return label.toLowerCase().replaceAll(" / ", "-").replaceAll(" ", "-");
}

export function QuoteForm() {
  const [submissionState, setSubmissionState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const { form } = contactContent;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmissionState("submitting");

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    const payload: Record<string, string> = {};

    formData.forEach((value, key) => {
      if (typeof value === "string") {
        payload[key] = value;
      }
    });

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Quote request failed.");
      }

      formElement.reset();
      setSubmissionState("success");
    } catch {
      setSubmissionState("error");
    }
  }

  return (
    <form
      className="grid gap-5"
      onSubmit={handleSubmit}
    >
      <p className="border-l-2 border-industrial-600 bg-metal-50 px-4 py-3 text-sm leading-6 text-slate-600">
        {form.helperText}
      </p>
      <div className="grid gap-5 sm:grid-cols-2">
        {form.fields.map((field) => (
          <Field key={field.name} label={field.label}>
            <input
              className="focus-ring w-full rounded-[4px] border border-metal-200 bg-white px-3 py-3 text-sm text-navy-950 transition focus-visible:border-industrial-600"
              name={field.name || fieldName(field.label)}
              type={field.type}
              required={field.required}
              placeholder={field.placeholder || undefined}
            />
          </Field>
        ))}
        <Field label={form.productInterestLabel}>
          <select className="focus-ring w-full rounded-[4px] border border-metal-200 bg-white px-3 py-3 text-sm text-navy-950 transition focus-visible:border-industrial-600" name={form.productInterestName}>
            <option value="">{form.productInterestPlaceholder}</option>
            {products.map((product) => (
              <option key={product.slug} value={product.name}>
                {product.name}
              </option>
            ))}
          </select>
        </Field>
        {form.processFields.map((field) => (
          <Field key={field.name} label={field.label}>
            <input
              className="focus-ring w-full rounded-[4px] border border-metal-200 bg-white px-3 py-3 text-sm text-navy-950 transition focus-visible:border-industrial-600"
              name={field.name || fieldName(field.label)}
              type={field.type}
              required={field.required}
              placeholder={field.placeholder || undefined}
            />
          </Field>
        ))}
      </div>
      <Field label={form.requirementsLabel}>
        <textarea
          className="focus-ring min-h-44 w-full rounded-[4px] border border-metal-200 px-3 py-3 text-sm text-navy-950 transition focus-visible:border-industrial-600"
          name={form.requirementsName}
          placeholder={form.requirementsPlaceholder || undefined}
          required
        />
      </Field>
      <Field label={form.attachmentLabel}>
        <input className="focus-ring w-full rounded-[4px] border border-dashed border-metal-200 px-3 py-3 text-sm text-slate-600 transition focus-visible:border-industrial-600" type="file" name={form.attachmentName} />
      </Field>
      <button
        type="submit"
        disabled={submissionState === "submitting"}
        className="focus-ring inline-flex w-fit items-center justify-center gap-2 bg-navy-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-industrial-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submissionState === "submitting" ? "Submitting..." : form.submitLabel}
        <span aria-hidden="true">{">"}</span>
      </button>
      {submissionState === "success" ? (
        <div className="rounded-[6px] border border-industrial-600 bg-blue-50 px-4 py-4 text-sm leading-6 text-navy-950" role="status">
          {form.confirmationMessage}
        </div>
      ) : null}
      {submissionState === "error" ? (
        <div className="rounded-[6px] border border-red-200 bg-red-50 px-4 py-4 text-sm leading-6 text-red-900" role="alert">
          {form.errorMessage}{" "}
          <a className="font-semibold underline" href={`mailto:${form.errorEmail}`}>
            {form.errorEmail}
          </a>
          .
        </div>
      ) : null}
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-navy-950">
      <span>{label}</span>
      {children}
    </label>
  );
}
