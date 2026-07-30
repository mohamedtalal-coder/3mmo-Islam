import { redirect } from "next/navigation";

/**
 * Subject pages are no longer used — the platform is single-subject.
 * Redirect any old bookmarks back to the grade page which now shows courses directly.
 */
export default function SubjectRedirect({ params }: { params: { gradeSlug: string } }) {
  redirect(`/grades/${params.gradeSlug}`);
}
