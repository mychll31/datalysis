import { toast } from 'react-toastify';

export const handleResendVerification = async (email, setIsLoading) => {
  try {
    // Safely handle setIsLoading if provided
    if (typeof setIsLoading === 'function') setIsLoading(true);
    
    const csrfToken = localStorage.getItem("csrfToken");
    if (!csrfToken) throw new Error("CSRF token not found");

    const response = await fetch("http://localhost:8000/api/email-send-code/", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken
      },
      credentials: "include",
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to resend code");
    }
    
    toast.success("New verification code sent!");
    return true;
  } catch (err) {
    toast.error(err.message);
    throw err; // Rethrow the error to be handled by the caller
  } finally {
    if (typeof setIsLoading === 'function') setIsLoading(false);
  }
};