const API_BASE = import.meta.env.VITE_API_BASE;

export interface CitizenTicketResponse {
  ticket_code: string;
}

export async function createCitizenTicket(formData: FormData) {
  if (!API_BASE) {
    throw new Error("VITE_API_BASE is not configured.");
  }

  const response = await fetch(`${API_BASE}/tickets/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      animal_type: formData.get("animal_type"),
      description: formData.get("description"),
      severity: "unknown",
      latitude: Number(formData.get("latitude")),
      longitude: Number(formData.get("longitude")),
      address_text: null,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to create ticket (${response.status}): ${errorText}`,
    );
  }

  const data = await response.json();

  return {
    ticket_code: data.ticket_code,
  };
}