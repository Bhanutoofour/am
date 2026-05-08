// Zoho CRM Integration Utility
// This can be used by all contact forms on the website

export interface ZohoFormData {
  name: string;
  email?: string;
  phone: string;
  industry?: string;
  product?: string;
  model?: string;
  leadSource?: string;
  webLeadType?: string;
  enquiryType?: string;
  comments?: string;
  countryAm?: string;
  findDealer?: string;
  additionalData?: Record<string, string>;
}

// Secure server-side Zoho CRM submission function
export const submitToZohoCRM = async (
  formData: ZohoFormData
): Promise<boolean> => {
  try {
    // Validate required fields
    if (!formData.name || !formData.phone) {
      console.error("Missing required fields in Zoho CRM submission");
      return false;
    }

    // Track visitor information with Zoho SalesIQ
    if (typeof window !== "undefined" && (window as any).$zoho) {
      try {
        const $zoho = (window as any).$zoho;
        if ($zoho.salesiq && $zoho.salesiq.visitor) {
          $zoho.salesiq.visitor.name(formData.name);
          $zoho.salesiq.visitor.email(formData.email);
        }
      } catch (error) {
        // Silent fail for SalesIQ tracking
        console.warn("SalesIQ tracking failed:", error);
      }
    }

    // Submit to our secure server-side API
    let response;
    try {
      response = await fetch("/api/submit-lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    } catch (error) {
      console.error("Error calling submit-lead API:", error);
      return false;
    }

    let result;
    try {
      result = await response.json();
    } catch (error) {
      console.error("Error parsing API response:", error);
      return false;
    }

    if (response.ok && result.success) {
      return true;
    } else {
      console.error("API returned error:", result.error);
      return false;
    }
  } catch (error) {
    console.error("Unexpected error in submitToZohoCRM:", error);
    return false;
  }
};

// Helper function for Quote form
export const submitQuoteForm = async (data: {
  name: string;
  email: string;
  phone: string;
  industry: string;
  product: string;
  model?: string;
  webLeadType?: string;
}): Promise<boolean> => {
  try {
    return await submitToZohoCRM({
      name: data.name,
      email: data.email,
      phone: data.phone,
      industry: data.industry,
      product: data.product,
      model: data.model,
      webLeadType: data.webLeadType,
    });
  } catch (error) {
    console.error("Error in submitQuoteForm:", error);
    return false;
  }
};

// Helper function for Contact form
export const submitContactForm = async (data: {
  name: string;
  email: string;
  phone: string;
  industry?: string;
  product?: string;
  model?: string;
  webLeadType?: string;
  enquiryType?: string;
  comments?: string;
}): Promise<boolean> => {
  try {
    return await submitToZohoCRM({
      name: data.name,
      email: data.email,
      phone: data.phone,
      industry: data.industry,
      product: data.product,
      model: data.model,
      webLeadType: data.webLeadType,
      enquiryType: data.enquiryType,
      comments: data.comments,
    });
  } catch (error) {
    console.error("Error in submitContactForm:", error);
    return false;
  }
};

// Helper function for Brochure Download form
export const submitBrochureForm = async (data: {
  name: string;
  email: string;
  phone: string;
  industry?: string;
  product?: string;
  model?: string;
  webLeadType?: string;
}): Promise<boolean> => {
  try {
    return await submitToZohoCRM({
      name: data.name,
      email: data.email,
      phone: data.phone,
      industry: data.industry,
      product: data.product,
      model: data.model,
      webLeadType: data.webLeadType,
    });
  } catch (error) {
    console.error("Error in submitBrochureForm:", error);
    return false;
  }
};

// Helper function for Find a Dealer form
export const submitFindDealerForm = async (data: {
  name: string;
  phone: string;
  email?: string;
  country?: string; // maps to LEADCF130 → countryAm
  role: "looking-for-dealer" | "become-dealer"; // maps to LEADCF192 → findDealer
  webLeadType?: string; // maps to LEADCF189
}): Promise<boolean> => {
  try {
    return await submitToZohoCRM({
      name: data.name,
      email: data.email,
      phone: data.phone,
      countryAm: data.country,
      findDealer: data.role,
      webLeadType: data.webLeadType ?? "Find a Dealer",
    });
  } catch (error) {
    console.error("Error in submitFindDealerForm:", error);
    return false;
  }
};
