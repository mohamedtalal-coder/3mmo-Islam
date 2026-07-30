export type EnrollmentAccessFields = {
  status?: string | null;
  expires_at?: string | null;
};

export type ProfileAccessFields = {
  account_status?: string | null;
};

/** Active course access: account active, enrollment active/completed, not expired. */
export function isEnrollmentAccessible(
  enrollment: EnrollmentAccessFields | null | undefined,
  profile?: ProfileAccessFields | null
): boolean {
  if (!enrollment) return false;

  if (profile?.account_status && profile.account_status !== "active") {
    return false;
  }

  const status = enrollment.status ?? "active";
  if (status !== "active" && status !== "completed") {
    return false;
  }

  if (enrollment.expires_at && new Date(enrollment.expires_at) < new Date()) {
    return false;
  }

  return true;
}

export function enrollmentAccessDeniedMessage(
  enrollment: EnrollmentAccessFields | null | undefined,
  profile?: ProfileAccessFields | null
): string {
  if (!enrollment) return "غير مسجل في هذا الكورس";
  if (profile?.account_status && profile.account_status !== "active") {
    return "الحساب معطل — تواصل مع المدرس";
  }
  if (enrollment.status === "suspended") {
    return "تم إيقاف اشتراكك في هذا الكورس";
  }
  if (enrollment.expires_at && new Date(enrollment.expires_at) < new Date()) {
    return "انتهت صلاحية الاشتراك";
  }
  return "غير مصرح بالوصول";
}
