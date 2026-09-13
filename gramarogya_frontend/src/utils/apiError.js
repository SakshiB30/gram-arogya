export const NETWORK_ERROR = "NETWORK_ERROR";

const defaultMessage =
  "Something went wrong while processing your request. Please try again.";

export const normalizeApiError = (
  error,
  fallbackMessage = defaultMessage
) => {
  if (error?.apiError) {
    return error.apiError;
  }

  if (error?.response) {
    const data = error.response.data;

    if (data && typeof data === "object") {
      return {
        message: data.message || fallbackMessage,
        code: data.error || "API_ERROR",
        status: data.status || error.response.status,
        fieldErrors: data.errors || null,
      };
    }

    return {
      message: typeof data === "string" ? data : fallbackMessage,
      code: "API_ERROR",
      status: error.response.status,
      fieldErrors: null,
    };
  }

  if (error?.request) {
    return {
      title: "Unable to Connect",
      message:
        "We couldn't reach the server. Please check your internet connection and try again.",
      code: NETWORK_ERROR,
      status: null,
      fieldErrors: null,
    };
  }

  return {
    message: error?.message || fallbackMessage,
    code: "UNKNOWN_ERROR",
    status: null,
    fieldErrors: null,
  };
};

export const getErrorMessage = (error, fallbackMessage) =>
  normalizeApiError(error, fallbackMessage).message;

export const getErrorTitle = (error) => {
  const apiError = normalizeApiError(error);

  switch (apiError.code) {
    case "VERIFICATION_PENDING":
      return "Verification Pending";
    case "REGISTRATION_REJECTED":
      return "Registration Rejected";
    case "ACCOUNT_BLOCKED":
      return "Account Blocked";
    case NETWORK_ERROR:
      return "Unable to Connect";
    default:
      return apiError.status === 401
        ? "Authentication Required"
        : "Request Failed";
  }
};
