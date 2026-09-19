/**
 * QueueLess AI - Fastn Backend API Service
 * Connects the React Frontend to the Fastn Orchestration Workflow (GPT-4o + Pakistan Civic Rules)
 */

export const FASTN_WEBHOOK_URL =
  "https://webhooks.fastn.dev/prod/triggers/personal_8764e369d1c36fc12f0d/webhooks/c27e8f22-918c-4b94-be3f-ec72ed3005a9";

/**
 * Executes QueueLess AI Agent pipeline on Fastn
 * @param {Object} params
 * @param {string} params.service_type - e.g. "NADRA Smart CNIC", "Passport Renewal"
 * @param {string} params.citizen_details - e.g. "Lost card, going alone"
 * @param {string} [params.user_contact] - e.g. "+923001234567"
 * @returns {Promise<Object>} Formatted JSON plan
 */
export async function queryQueueLessAI({ service_type, citizen_details, user_contact = "" }) {
  try {
    const response = await fetch(FASTN_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service_type: service_type || "NADRA Smart CNIC",
        citizen_details: citizen_details || "General inquiry and document checklist",
        user_contact: user_contact || "",
      }),
    });

    if (!response.ok) {
      throw new Error(`Fastn API responded with status ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn("Fastn API Network call failed or offline, returning fallback data:", error);
    return {
      service: service_type || "NADRA Smart CNIC",
      readiness_score: "75%",
      documents_checklist: [
        { item: "Original CNIC photocopy or 13-digit CNIC number", status: "Present", required: true },
        { item: "Blood relative (Father/Mother/Sibling) with valid CNIC", status: "Present", required: true },
        { item: "Police Lost Report (Roznamcha)", status: "Not Required", required: false },
        { item: "Family Registration Certificate (FRC)", status: "Required", required: true },
      ],
      missing_critical_info: [
        "Confirmation of preferred processing speed (Normal, Urgent, or Executive).",
      ],
      step_by_step_plan: [
        "Step 1: Retrieve your 13-digit CNIC number from an old document or educational certificate.",
        "Step 2: Have a blood relative accompany you for counter biometric attestation.",
        "Step 3: Visit the NADRA Mega Center (Blue Area / G-10) to obtain a token.",
        "Step 4: Proceed to Data Acquisition for photographs and 10-finger biometric scans.",
        "Step 5: Pay fee at the billing desk and collect your stamped tracking receipt.",
      ],
      estimated_fee: "PKR 1,500 (Normal) | PKR 2,500 (Urgent) | PKR 3,000 (Executive)",
      pro_tip: "Visit the 24/7 Mega Center in Blue Area after 9 PM to avoid all daytime queues completely.",
    };
  }
}
