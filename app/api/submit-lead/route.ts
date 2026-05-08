import { NextRequest, NextResponse } from "next/server";

// TypeScript interfaces for type safety
interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  industry?: string;
  product?: string;
  model?: string;
  enquiryType?: string;
  countryAm?: string;
  state?: string;
  region?: string;
  findDealer?: string;
  comments?: string;
  webLeadType?: string;
  leadSource?: string;
  additionalData?: Record<string, string | number | boolean>;
}

export async function POST(request: NextRequest) {
  try {
    const formData: LeadFormData = await request.json();

    // Server-side validation
    if (!formData.name || !formData.phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if environment variables are set
    const zohoXnQsjsdp = process.env.ZOHO_XNQSJSDP;
    const zohoXmIwtLD = process.env.ZOHO_XMIWTLD;

    if (!zohoXnQsjsdp || !zohoXmIwtLD) {
      console.error("Zoho CRM environment variables not configured");
      return NextResponse.json(
        { error: "CRM configuration error" },
        { status: 500 }
      );
    }

    // Create Zoho CRM form data
    const zohoFormData = new FormData();

    try {
      // Required Zoho CRM fields (server-side tokens - secure)
      const appendedKeys = new Set<string>();

      zohoFormData.append("xnQsjsdp", zohoXnQsjsdp);
      appendedKeys.add("xnQsjsdp");
      zohoFormData.append("zc_gad", "");
      appendedKeys.add("zc_gad");
      zohoFormData.append("xmIwtLD", zohoXmIwtLD);
      appendedKeys.add("xmIwtLD");
      zohoFormData.append("actionType", "TGVhZHM=");
      appendedKeys.add("actionType");
      zohoFormData.append("returnURL", "null");
      appendedKeys.add("returnURL");
      zohoFormData.append("ldeskuid", "");
      appendedKeys.add("ldeskuid");
      zohoFormData.append("LDTuvid", "");
      appendedKeys.add("LDTuvid");
      zohoFormData.append("aG9uZXlwb3Q", "");
      appendedKeys.add("aG9uZXlwb3Q");

      // User data - Exact field names from Zoho CRM form
      zohoFormData.append("Last Name", formData.name);
      appendedKeys.add("Last Name");
      zohoFormData.append("Mobile", formData.phone);
      appendedKeys.add("Mobile");
      if (formData.email && formData.email.trim() !== "") {
        zohoFormData.append("Email", formData.email);
        appendedKeys.add("Email");
      }
      appendedKeys.add("Email");

      // Company
      if (formData.company && formData.company.trim() !== "") {
        zohoFormData.append("Company", formData.company.trim());
        appendedKeys.add("Company");
      }

      // Industry field - LEADCF154 (Industry Name)
      if (formData.industry && formData.industry.trim() !== "") {
        zohoFormData.append("LEADCF154", formData.industry);
        appendedKeys.add("LEADCF154");
      }

      // Product field - LEADCF182 (Product Title)
      if (formData.product && formData.product.trim() !== "") {
        zohoFormData.append("LEADCF182", formData.product);
        appendedKeys.add("LEADCF182");
      }

      // Model field - LEADCF181 (Model Name)
      if (formData.model && formData.model.trim() !== "") {
        zohoFormData.append("LEADCF181", formData.model);
        appendedKeys.add("LEADCF181");
      }

      // Enquiry Type
      if (formData.enquiryType && formData.enquiryType.trim() !== "") {
        zohoFormData.append("LEADCF191", formData.enquiryType);
        appendedKeys.add("LEADCF191");
      }

      // Country (AM)
      if (formData.countryAm && formData.countryAm.trim() !== "") {
        zohoFormData.append("LEADCF130", formData.countryAm);
        appendedKeys.add("LEADCF130");
      }

      // State
      if (formData.state && formData.state.trim() !== "") {
        zohoFormData.append("State", formData.state);
        appendedKeys.add("State");
      }

      // Region
      if (formData.region && formData.region.trim() !== "") {
        zohoFormData.append("LEADCF190", formData.region);
        appendedKeys.add("LEADCF190");
      }

      // Find a Dealer
      if (formData.findDealer && formData.findDealer.trim() !== "") {
        zohoFormData.append("LEADCF192", formData.findDealer);
        appendedKeys.add("LEADCF192");
      }

      // Comments
      if (formData.comments && formData.comments.trim() !== "") {
        zohoFormData.append("LEADCF37", formData.comments);
        appendedKeys.add("LEADCF37");
      }

      // Web Lead Type
      if (formData.webLeadType && formData.webLeadType.trim() !== "") {
        zohoFormData.append("LEADCF189", formData.webLeadType);
        appendedKeys.add("LEADCF189");
      }

      // Lead Source - Set to "Website" as per form default
      zohoFormData.append("Lead Source", "Website");
      appendedKeys.add("Lead Source");

      // Additional data with proper type checking
      if (
        formData.additionalData &&
        typeof formData.additionalData === "object"
      ) {
        Object.entries(formData.additionalData).forEach(([key, value]) => {
          try {
            if (appendedKeys.has(key)) return;
            if (typeof value === "string") {
              zohoFormData.append(key, value);
              appendedKeys.add(key);
            } else if (value !== null && value !== undefined) {
              zohoFormData.append(key, String(value));
              appendedKeys.add(key);
            }
          } catch (error) {
            console.error(
              `Error appending additional data field ${key}:`,
              error
            );
          }
        });
      }
    } catch (error) {
      console.error("Error creating FormData:", error);
      return NextResponse.json(
        { error: "Error preparing form data" },
        { status: 500 }
      );
    }

    // Submit to Zoho CRM
    let response;
    try {
      response = await fetch("https://crm.zoho.in/crm/WebToLeadForm", {
        method: "POST",
        body: zohoFormData,
      });
    } catch (error) {
      console.error("Error submitting to Zoho CRM:", error);
      return NextResponse.json(
        { error: "Failed to connect to CRM" },
        { status: 500 }
      );
    }

    let responseText;
    try {
      responseText = await response.text();
    } catch (error) {
      console.error("Error reading Zoho CRM response:", error);
      return NextResponse.json(
        { error: "Error reading CRM response" },
        { status: 500 }
      );
    }

    if (response.ok) {
      // Check if the response contains success indicators from Zoho CRM
      if (
        responseText.includes("Thank you for submitting your response") ||
        responseText.includes(
          "Your response has been submitted successfully"
        ) ||
        responseText.includes("wf_thankyoumessage") ||
        responseText.includes("success")
      ) {
        return NextResponse.json({ success: true });
      } else {
        console.error("Zoho CRM returned OK status but no success indicator");
        return NextResponse.json(
          { error: "CRM submission may have failed" },
          { status: 500 }
        );
      }
    } else {
      console.error("Zoho CRM returned error status:", response.status);
      return NextResponse.json(
        { error: "Failed to submit to CRM" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Unexpected error in submit-lead API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
