
import UserProfileForm from '@/components/forms/UserProfileForm';
import { getBackendData } from '../back_api';
import { redirect } from 'next/navigation';

export default async function ForgotPassword() {

  const personalDetails: UserRead = await getBackendData({ endpoint: "api/v1/users/me", redir: "/me" });
  return (
    <main>
      <UserProfileForm params={{
        email: personalDetails.email
      }} ></UserProfileForm>
    </main>
  )

}