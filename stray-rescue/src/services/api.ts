export async function createTicket(formData: FormData) {
  // Simulate network delay and return a fake ticket response
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { ticket_code: `R-MOCK-${Math.floor(Math.random() * 10000)}` };
}