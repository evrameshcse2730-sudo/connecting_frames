// Only allow safe link formats from admin-edited content
export const safeUrl = (u) => (/^(https:\/\/|#|\/)/i.test(String(u || "")) ? u : "#");
