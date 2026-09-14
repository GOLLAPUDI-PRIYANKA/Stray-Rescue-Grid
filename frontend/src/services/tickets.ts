export async function createCitizenTicket(formData: FormData) {
  // Keep the UI usable while the authenticated backend submission is wired in.
  await new Promise((resolve) => window.setTimeout(resolve, 350));
  void formData;
  return { ticket_code: `SR-${Math.random().toString(36).slice(2, 8).toUpperCase()}` };
}
