import { signOutAdmin } from "@/lib/actions/admin-auth-actions";

export function LogoutButton() {
  return (
    <form action={signOutAdmin}>
      <button className="admin-logout-button" type="submit">Sign out</button>
    </form>
  );
}
